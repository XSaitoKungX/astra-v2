import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { logModAction, sendModLog, modEmbed } from '../../utils/moderation.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete messages from a channel')
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .addUserOption(opt => opt.setName('user').setDescription('Only delete messages from this user'))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for clearing messages'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    await interaction.deferReply({ ephemeral: true });

    try {
      let messages = await interaction.channel.messages.fetch({ limit: 100 });

      // Filter by user if specified
      if (targetUser) {
        messages = messages.filter(m => m.author.id === targetUser.id);
      }

      // Filter out messages older than 14 days (Discord limitation)
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      messages = messages.filter(m => m.createdTimestamp > twoWeeksAgo);

      // Limit to requested amount
      const toDelete = [...messages.values()].slice(0, amount);

      if (toDelete.length === 0) {
        return interaction.editReply({ content: '❌ No deletable messages found.' });
      }

      const deleted = await interaction.channel.bulkDelete(toDelete, true);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setDescription(`✅ Deleted **${deleted.size}** message(s).${targetUser ? ` (from ${targetUser})` : ''}`)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      const logEmbed = modEmbed({
        action: 'Clear Messages',
        target: targetUser || { toString: () => `#${interaction.channel.name}`, id: interaction.channelId },
        moderator: interaction.user,
        reason,
        extra: { name: 'Messages Deleted', value: `${deleted.size}`, inline: true },
      });
      await sendModLog(interaction.guild, logEmbed);
      await logModAction({
        guildId: interaction.guildId,
        userId: targetUser?.id || 'channel',
        moderator: interaction.user.id,
        action: 'clear',
        reason: `${deleted.size} messages | ${reason}`,
      });
    } catch (error) {
      await interaction.editReply({ content: `❌ Failed to delete messages: ${error.message}` });
    }
  },
};
