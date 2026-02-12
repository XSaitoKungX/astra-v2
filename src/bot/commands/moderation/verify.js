import {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder
} from 'discord.js';
import { getDatabase } from '../../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Set up a verification panel')
    .addSubcommand(sub =>
      sub.setName('button')
        .setDescription('Create a button verification panel')
        .addStringOption(opt => opt.setName('message').setDescription('Custom message for the panel'))
    )
    .addSubcommand(sub =>
      sub.setName('dropdown')
        .setDescription('Create a dropdown verification panel')
        .addStringOption(opt => opt.setName('message').setDescription('Custom message for the panel'))
    )
    .addSubcommand(sub =>
      sub.setName('rules')
        .setDescription('Create an "agree to rules" verification panel')
        .addStringOption(opt => opt.setName('rules').setDescription('Server rules (separate with |)').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const db = getDatabase();

    const guildData = await db.guild.findUnique({ where: { id: interaction.guildId } });
    if (!guildData?.verifyRole) {
      return interaction.reply({
        content: '❌ No verification role set. Use `/setup verify` first.',
        ephemeral: true,
      });
    }

    const customMsg = interaction.options.getString('message')
      || `Welcome to **${interaction.guild.name}**! Please verify to gain access to the server.`;

    if (sub === 'button') {
      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle('✅ Verification Required')
        .setDescription(customMsg)
        .setFooter({ text: 'Click the button below to verify' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_button')
          .setLabel('Verify')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: '✅ Verification panel created.', ephemeral: true });
    }

    if (sub === 'dropdown') {
      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle('✅ Verification Required')
        .setDescription(customMsg)
        .setFooter({ text: 'Select "Verify" from the dropdown below' });

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('verify_dropdown')
          .setPlaceholder('Select to verify...')
          .addOptions([
            { label: 'Verify Me', value: 'verify', description: 'Click to verify and gain access', emoji: '✅' },
          ])
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: '✅ Verification panel created.', ephemeral: true });
    }

    if (sub === 'rules') {
      const rulesStr = interaction.options.getString('rules');
      const rulesList = rulesStr.split('|').map((r, i) => `**${i + 1}.** ${r.trim()}`).join('\n');

      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle('📜 Server Rules')
        .setDescription(`${rulesList}\n\n*By clicking the button below, you agree to follow these rules.*`)
        .setFooter({ text: 'Click "I Agree" to verify' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_rules')
          .setLabel('I Agree')
          .setStyle(ButtonStyle.Success)
          .setEmoji('📜')
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: '✅ Rules verification panel created.', ephemeral: true });
    }
  },
};
