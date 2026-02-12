import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue'),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const { queue } = queueCheck;

    if (queue.tracks.length < 2) {
      return interaction.reply({ content: '❌ Not enough tracks to shuffle.', ephemeral: true });
    }

    queue.shuffle();

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setDescription(`🔀 Shuffled **${queue.tracks.length}** tracks.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
