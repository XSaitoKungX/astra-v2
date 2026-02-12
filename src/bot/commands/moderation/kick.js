import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { modEmbed, successEmbed, logModAction, sendModLog, canModerate } from '../../utils/moderation.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('The user to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    const check = canModerate(interaction, member);
    if (!check.ok) {
      return interaction.reply({ content: `❌ ${check.reason}`, ephemeral: true });
    }

    try {
      await member.kick(`${reason} | By: ${interaction.user.tag}`);

      const embed = successEmbed({ action: 'kicked', target: member.user, reason });
      await interaction.reply({ embeds: [embed] });

      const logEmbed = modEmbed({
        action: 'Kick',
        target: member.user,
        moderator: interaction.user,
        reason,
      });
      await sendModLog(interaction.guild, logEmbed);
      await logModAction({
        guildId: interaction.guildId,
        userId: member.id,
        moderator: interaction.user.id,
        action: 'kick',
        reason,
      });
    } catch (error) {
      await interaction.reply({ content: `❌ Failed to kick: ${error.message}`, ephemeral: true });
    }
  },
};
