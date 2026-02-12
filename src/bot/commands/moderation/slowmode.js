import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { logModAction, sendModLog, modEmbed, parseDuration, formatDuration } from '../../utils/moderation.js';

export default {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for a channel')
    .addStringOption(opt =>
      opt.setName('duration').setDescription('Slowmode duration (e.g. 5s, 10m, 1h) or "off"').setRequired(true)
    )
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to set slowmode in (default: current)'))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for slowmode'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const durationStr = interaction.options.getString('duration');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!channel.isTextBased()) {
      return interaction.reply({ content: '❌ Slowmode can only be set on text channels.', ephemeral: true });
    }

    let seconds;
    if (durationStr.toLowerCase() === 'off' || durationStr === '0') {
      seconds = 0;
    } else {
      seconds = parseDuration(durationStr);
      if (!seconds || seconds < 0 || seconds > 21600) {
        return interaction.reply({ content: '❌ Invalid duration. Use format like `5s`, `10m`, `1h`. Max 6 hours.', ephemeral: true });
      }
    }

    try {
      await channel.setRateLimitPerUser(seconds, `${reason} | By: ${interaction.user.tag}`);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setDescription(
          seconds === 0
            ? `✅ Slowmode **disabled** in ${channel}.`
            : `✅ Slowmode set to **${formatDuration(seconds)}** in ${channel}.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      const logEmbed = modEmbed({
        action: seconds === 0 ? 'Slowmode Disabled' : 'Slowmode Set',
        target: { toString: () => `${channel}`, id: channel.id },
        moderator: interaction.user,
        reason,
        duration: seconds > 0 ? formatDuration(seconds) : undefined,
      });
      await sendModLog(interaction.guild, logEmbed);
      await logModAction({
        guildId: interaction.guildId,
        userId: channel.id,
        moderator: interaction.user.id,
        action: 'slowmode',
        reason,
        duration: seconds,
      });
    } catch (error) {
      await interaction.reply({ content: `❌ Failed to set slowmode: ${error.message}`, ephemeral: true });
    }
  },
};
