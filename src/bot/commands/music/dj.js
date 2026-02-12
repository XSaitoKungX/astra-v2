import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dj')
    .setDescription('Configure DJ role for music commands')
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('Set the DJ role')
        .addRoleOption(opt => opt.setName('role').setDescription('DJ role').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove the DJ role requirement')
    )
    .addSubcommand(sub =>
      sub.setName('status')
        .setDescription('View current DJ settings')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const db = getDatabase();

    await db.guild.upsert({
      where: { id: interaction.guildId },
      update: { name: interaction.guild.name },
      create: {
        id: interaction.guildId,
        name: interaction.guild.name,
        icon: interaction.guild.iconURL(),
        ownerId: interaction.guild.ownerId,
      },
    });

    if (sub === 'set') {
      const role = interaction.options.getRole('role');
      await db.guild.update({
        where: { id: interaction.guildId },
        data: { djRole: role.id },
      });

      // Also set on active queue
      const queue = interaction.client.music?.getQueue(interaction.guildId);
      if (queue) queue.djRole = role.id;

      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setDescription(`🎧 DJ role set to ${role}. Only members with this role can use music commands.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    if (sub === 'remove') {
      await db.guild.update({
        where: { id: interaction.guildId },
        data: { djRole: null },
      });

      const queue = interaction.client.music?.getQueue(interaction.guildId);
      if (queue) queue.djRole = null;

      await interaction.reply({ content: '✅ DJ role requirement **removed**. Anyone can use music commands.', ephemeral: true });
    }

    if (sub === 'status') {
      const guild = await db.guild.findUnique({ where: { id: interaction.guildId } });
      const djRole = guild?.djRole;

      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle('🎧 DJ Settings')
        .addFields({
          name: 'DJ Role',
          value: djRole ? `<@&${djRole}>` : 'Not set (everyone can use music commands)',
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
