import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { logModAction, sendModLog, modEmbed } from '../../utils/moderation.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock or unlock a channel')
    .addSubcommand(sub =>
      sub.setName('on')
        .setDescription('Lock a channel (prevent members from sending messages)')
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel to lock (default: current)'))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for locking'))
    )
    .addSubcommand(sub =>
      sub.setName('off')
        .setDescription('Unlock a channel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel to unlock (default: current)'))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for unlocking'))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const lock = sub === 'on';

    if (!channel.isTextBased()) {
      return interaction.reply({ content: '❌ This command only works on text channels.', ephemeral: true });
    }

    try {
      const everyoneRole = interaction.guild.roles.everyone;

      await channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: lock ? false : null,
        AddReactions: lock ? false : null,
      }, { reason: `${reason} | By: ${interaction.user.tag}` });

      const embed = new EmbedBuilder()
        .setColor(lock ? 0xED4245 : 0x57F287)
        .setDescription(lock
          ? `🔒 ${channel} has been **locked**.`
          : `🔓 ${channel} has been **unlocked**.`
        )
        .setTimestamp();

      if (reason !== 'No reason provided') {
        embed.addFields({ name: 'Reason', value: reason });
      }

      await interaction.reply({ embeds: [embed] });

      const logEmbed = modEmbed({
        action: lock ? 'Channel Locked' : 'Channel Unlocked',
        target: { toString: () => `${channel}`, id: channel.id },
        moderator: interaction.user,
        reason,
      });
      await sendModLog(interaction.guild, logEmbed);
      await logModAction({
        guildId: interaction.guildId,
        userId: channel.id,
        moderator: interaction.user.id,
        action: lock ? 'lock' : 'unlock',
        reason,
      });
    } catch (error) {
      await interaction.reply({ content: `❌ Failed to ${lock ? 'lock' : 'unlock'}: ${error.message}`, ephemeral: true });
    }
  },
};
