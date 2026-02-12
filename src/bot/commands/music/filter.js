import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';
import { FILTERS } from '../../music/manager.js';

const filterNames = Object.keys(FILTERS);

export default {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Apply an audio filter')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Filter name')
        .setRequired(true)
        .addChoices(
          ...filterNames.slice(0, 25).map(f => ({ name: f, value: f }))
        )
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const name = interaction.options.getString('name');
    const filter = FILTERS[name];

    if (!filter) {
      return interaction.reply({ content: `❌ Unknown filter: \`${name}\``, ephemeral: true });
    }

    await queueCheck.queue.applyFilter(filter);

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setDescription(name === 'clear'
        ? '🎛️ All filters **cleared**.'
        : `🎛️ Applied filter: **${name}**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
