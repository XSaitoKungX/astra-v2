import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { modEmbed, successEmbed, logModAction, sendModLog, canModerate } from '../../utils/moderation.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban'))
    .addIntegerOption(opt => opt.setName('days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days = interaction.options.getInteger('days') || 0;

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member) {
      const check = canModerate(interaction, member);
      if (!check.ok) {
        return interaction.reply({ content: `❌ ${check.reason}`, ephemeral: true });
      }
    }

    try {
      await interaction.guild.members.ban(user.id, {
        reason: `${reason} | By: ${interaction.user.tag}`,
        deleteMessageSeconds: days * 86400,
      });

      const embed = successEmbed({ action: 'banned', target: user, reason });
      await interaction.reply({ embeds: [embed] });

      const logEmbed = modEmbed({
        action: 'Ban',
        target: user,
        moderator: interaction.user,
        reason,
        extra: days > 0 ? { name: 'Messages Deleted', value: `${days} day(s)`, inline: true } : undefined,
      });
      await sendModLog(interaction.guild, logEmbed);
      await logModAction({
        guildId: interaction.guildId,
        userId: user.id,
        moderator: interaction.user.id,
        action: 'ban',
        reason,
      });
    } catch (error) {
      await interaction.reply({ content: `❌ Failed to ban: ${error.message}`, ephemeral: true });
    }
  },
};
