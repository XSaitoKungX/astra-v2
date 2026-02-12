import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { modEmbed, successEmbed, logModAction, sendModLog, canModerate, parseDuration, formatDuration } from '../../utils/moderation.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member (mute them temporarily)')
    .addUserOption(opt => opt.setName('user').setDescription('The user to timeout').setRequired(true))
    .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g. 10m, 1h, 1d)').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the timeout'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    const check = canModerate(interaction, member);
    if (!check.ok) {
      return interaction.reply({ content: `❌ ${check.reason}`, ephemeral: true });
    }

    const seconds = parseDuration(durationStr);
    if (!seconds || seconds < 1 || seconds > 2419200) {
      return interaction.reply({ content: '❌ Invalid duration. Use format like `10m`, `1h`, `1d`. Max 28 days.', ephemeral: true });
    }

    try {
      await member.timeout(seconds * 1000, `${reason} | By: ${interaction.user.tag}`);

      const duration = formatDuration(seconds);
      const embed = successEmbed({ action: 'timed out', target: member.user, reason, duration });
      await interaction.reply({ embeds: [embed] });

      const logEmbed = modEmbed({
        action: 'Timeout',
        target: member.user,
        moderator: interaction.user,
        reason,
        duration,
      });
      await sendModLog(interaction.guild, logEmbed);
      await logModAction({
        guildId: interaction.guildId,
        userId: member.id,
        moderator: interaction.user.id,
        action: 'timeout',
        reason,
        duration: seconds,
      });
    } catch (error) {
      await interaction.reply({ content: `❌ Failed to timeout: ${error.message}`, ephemeral: true });
    }
  },
};
