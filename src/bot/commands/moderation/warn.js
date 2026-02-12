import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { modEmbed, successEmbed, logModAction, sendModLog, canModerate } from '../../utils/moderation.js';
import { getDatabase } from '../../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Manage warnings for a member')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Warn a member')
        .addUserOption(opt => opt.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('View warnings for a member')
        .addUserOption(opt => opt.setName('user').setDescription('The user to check').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove a specific warning')
        .addIntegerOption(opt => opt.setName('id').setDescription('Warning ID to remove').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('clear')
        .setDescription('Clear all warnings for a member')
        .addUserOption(opt => opt.setName('user').setDescription('The user to clear warnings for').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const db = getDatabase();

    if (sub === 'add') {
      const member = interaction.options.getMember('user');
      const reason = interaction.options.getString('reason');

      if (!member) {
        return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
      }

      const check = canModerate(interaction, member);
      if (!check.ok) {
        return interaction.reply({ content: `❌ ${check.reason}`, ephemeral: true });
      }

      try {
        const warning = await db.warning.create({
          data: {
            guildId: interaction.guildId,
            userId: member.id,
            moderator: interaction.user.id,
            reason,
          },
        });

        const totalWarnings = await db.warning.count({
          where: { guildId: interaction.guildId, userId: member.id },
        });

        const embed = successEmbed({
          action: 'warned',
          target: member.user,
          reason,
          extra: { name: 'Total Warnings', value: `${totalWarnings}`, inline: true },
        });
        embed.setFooter({ text: `Warning ID: ${warning.id}` });
        await interaction.reply({ embeds: [embed] });

        const logEmbed = modEmbed({
          action: 'Warning',
          target: member.user,
          moderator: interaction.user,
          reason,
          extra: { name: 'Total Warnings', value: `${totalWarnings}`, inline: true },
        });
        await sendModLog(interaction.guild, logEmbed);
        await logModAction({
          guildId: interaction.guildId,
          userId: member.id,
          moderator: interaction.user.id,
          action: 'warn',
          reason,
        });
      } catch (error) {
        await interaction.reply({ content: `❌ Failed to warn: ${error.message}`, ephemeral: true });
      }
    }

    if (sub === 'list') {
      const user = interaction.options.getUser('user');

      try {
        const warnings = await db.warning.findMany({
          where: { guildId: interaction.guildId, userId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 25,
        });

        if (warnings.length === 0) {
          return interaction.reply({ content: `✅ **${user.tag}** has no warnings.`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setColor(0xFEE75C)
          .setTitle(`⚠️ Warnings for ${user.tag}`)
          .setThumbnail(user.displayAvatarURL())
          .setDescription(
            warnings.map((w, i) =>
              `**#${w.id}** — <t:${Math.floor(w.createdAt.getTime() / 1000)}:R>\n` +
              `Reason: ${w.reason}\nBy: <@${w.moderator}>`
            ).join('\n\n')
          )
          .setFooter({ text: `${warnings.length} warning(s) total` })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        await interaction.reply({ content: `❌ Failed to fetch warnings: ${error.message}`, ephemeral: true });
      }
    }

    if (sub === 'remove') {
      const id = interaction.options.getInteger('id');

      try {
        const warning = await db.warning.findFirst({
          where: { id, guildId: interaction.guildId },
        });

        if (!warning) {
          return interaction.reply({ content: `❌ Warning #${id} not found.`, ephemeral: true });
        }

        await db.warning.delete({ where: { id } });
        await interaction.reply({ content: `✅ Warning **#${id}** has been removed.`, ephemeral: true });
      } catch (error) {
        await interaction.reply({ content: `❌ Failed to remove warning: ${error.message}`, ephemeral: true });
      }
    }

    if (sub === 'clear') {
      const user = interaction.options.getUser('user');

      try {
        const { count } = await db.warning.deleteMany({
          where: { guildId: interaction.guildId, userId: user.id },
        });

        await interaction.reply({
          content: count > 0
            ? `✅ Cleared **${count}** warning(s) for **${user.tag}**.`
            : `✅ **${user.tag}** had no warnings to clear.`,
          ephemeral: true,
        });
      } catch (error) {
        await interaction.reply({ content: `❌ Failed to clear warnings: ${error.message}`, ephemeral: true });
      }
    }
  },
};
