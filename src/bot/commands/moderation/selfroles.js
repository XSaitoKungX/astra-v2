import {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('selfroles')
    .setDescription('Create a self-role panel')
    .addSubcommand(sub =>
      sub.setName('button')
        .setDescription('Create a button-based self-role panel')
        .addStringOption(opt => opt.setName('title').setDescription('Panel title').setRequired(true))
        .addStringOption(opt => opt.setName('roles').setDescription('Role mentions or IDs, separated by spaces').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Panel description'))
    )
    .addSubcommand(sub =>
      sub.setName('dropdown')
        .setDescription('Create a dropdown-based self-role panel')
        .addStringOption(opt => opt.setName('title').setDescription('Panel title').setRequired(true))
        .addStringOption(opt => opt.setName('roles').setDescription('Role mentions or IDs, separated by spaces').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Panel description'))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const title = interaction.options.getString('title');
    const rolesStr = interaction.options.getString('roles');
    const description = interaction.options.getString('description') || 'Click to toggle your roles.';

    // Parse role IDs from mentions or raw IDs
    const roleIds = [...rolesStr.matchAll(/<@&(\d+)>|(\d{17,20})/g)].map(m => m[1] || m[2]);

    if (roleIds.length === 0) {
      return interaction.reply({ content: '❌ No valid roles found. Mention roles or provide role IDs.', ephemeral: true });
    }

    if (roleIds.length > 25) {
      return interaction.reply({ content: '❌ Maximum 25 roles per panel.', ephemeral: true });
    }

    // Resolve roles
    const roles = roleIds
      .map(id => interaction.guild.roles.cache.get(id))
      .filter(Boolean);

    if (roles.length === 0) {
      return interaction.reply({ content: '❌ None of the specified roles were found.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setTitle(title)
      .setDescription(`${description}\n\n${roles.map(r => `• ${r}`).join('\n')}`)
      .setFooter({ text: `${roles.length} role(s) available` });

    if (sub === 'button') {
      // Split into rows of 5 (Discord limit)
      const rows = [];
      for (let i = 0; i < roles.length; i += 5) {
        const row = new ActionRowBuilder();
        const chunk = roles.slice(i, i + 5);
        for (const role of chunk) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`selfrole_${role.id}`)
              .setLabel(role.name)
              .setStyle(ButtonStyle.Secondary)
          );
        }
        rows.push(row);
      }

      await interaction.channel.send({ embeds: [embed], components: rows });
      await interaction.reply({ content: `✅ Self-role panel created with ${roles.length} role(s).`, ephemeral: true });
    }

    if (sub === 'dropdown') {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('selfrole_dropdown')
          .setPlaceholder('Select a role...')
          .setMinValues(0)
          .setMaxValues(roles.length)
          .addOptions(
            roles.map(r => ({
              label: r.name,
              value: r.id,
              description: `Toggle ${r.name}`,
            }))
          )
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: `✅ Self-role dropdown created with ${roles.length} role(s).`, ephemeral: true });
    }
  },
};
