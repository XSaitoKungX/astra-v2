import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from 'discord.js';
import { getDatabase } from '../../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure server settings')
    .addSubcommand(sub =>
      sub.setName('logchannel')
        .setDescription('Set the server log channel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Log channel (leave empty to disable)').addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand(sub =>
      sub.setName('modlog')
        .setDescription('Set the moderation log channel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Mod log channel (leave empty to disable)').addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand(sub =>
      sub.setName('welcome')
        .setDescription('Set the welcome channel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Welcome channel (leave empty to disable)').addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand(sub =>
      sub.setName('goodbye')
        .setDescription('Set the goodbye channel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Goodbye channel (leave empty to disable)').addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand(sub =>
      sub.setName('verify')
        .setDescription('Set verification channel and role')
        .addChannelOption(opt => opt.setName('channel').setDescription('Verification channel').addChannelTypes(ChannelType.GuildText))
        .addRoleOption(opt => opt.setName('role').setDescription('Role to give after verification'))
    )
    .addSubcommand(sub =>
      sub.setName('view')
        .setDescription('View current server settings')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const db = getDatabase();
    const guildId = interaction.guildId;

    // Ensure guild exists in DB
    await db.guild.upsert({
      where: { id: guildId },
      update: { name: interaction.guild.name },
      create: {
        id: guildId,
        name: interaction.guild.name,
        icon: interaction.guild.iconURL(),
        ownerId: interaction.guild.ownerId,
      },
    });

    if (sub === 'logchannel') {
      const channel = interaction.options.getChannel('channel');
      await db.guild.update({ where: { id: guildId }, data: { logChannel: channel?.id || null } });
      return interaction.reply({
        content: channel ? `✅ Log channel set to ${channel}.` : '✅ Log channel **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'modlog') {
      const channel = interaction.options.getChannel('channel');
      await db.guild.update({ where: { id: guildId }, data: { modLogChannel: channel?.id || null } });
      return interaction.reply({
        content: channel ? `✅ Mod log channel set to ${channel}.` : '✅ Mod log channel **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'welcome') {
      const channel = interaction.options.getChannel('channel');
      await db.guild.update({ where: { id: guildId }, data: { welcomeChannel: channel?.id || null } });
      return interaction.reply({
        content: channel ? `✅ Welcome channel set to ${channel}.` : '✅ Welcome channel **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'goodbye') {
      const channel = interaction.options.getChannel('channel');
      await db.guild.update({ where: { id: guildId }, data: { goodbyeChannel: channel?.id || null } });
      return interaction.reply({
        content: channel ? `✅ Goodbye channel set to ${channel}.` : '✅ Goodbye channel **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'verify') {
      const channel = interaction.options.getChannel('channel');
      const role = interaction.options.getRole('role');
      const data = {};
      if (channel !== null) data.verifyChannel = channel?.id || null;
      if (role !== null) data.verifyRole = role?.id || null;

      if (Object.keys(data).length > 0) {
        await db.guild.update({ where: { id: guildId }, data });
      }

      const parts = [];
      if (channel) parts.push(`Channel: ${channel}`);
      if (role) parts.push(`Role: ${role}`);

      return interaction.reply({
        content: parts.length > 0
          ? `✅ Verification settings updated.\n${parts.join('\n')}`
          : '✅ Verification settings cleared.',
        ephemeral: true,
      });
    }

    if (sub === 'view') {
      const guild = await db.guild.findUnique({ where: { id: guildId } });

      const fmt = (id) => id ? `<#${id}>` : '`Not set`';
      const fmtRole = (id) => id ? `<@&${id}>` : '`Not set`';

      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle('⚙️ Server Settings')
        .addFields(
          { name: 'Log Channel', value: fmt(guild?.logChannel), inline: true },
          { name: 'Mod Log', value: fmt(guild?.modLogChannel), inline: true },
          { name: 'Welcome', value: fmt(guild?.welcomeChannel), inline: true },
          { name: 'Goodbye', value: fmt(guild?.goodbyeChannel), inline: true },
          { name: 'Verify Channel', value: fmt(guild?.verifyChannel), inline: true },
          { name: 'Verify Role', value: fmtRole(guild?.verifyRole), inline: true },
          { name: 'Locale', value: `\`${guild?.locale || 'en'}\``, inline: true },
          { name: 'Premium', value: guild?.premium ? '✅ Yes' : '❌ No', inline: true },
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
