import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause or resume playback'),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const { queue } = queueCheck;

    if (queue.paused) {
      queue.resume();
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setDescription('▶️ Playback resumed.')
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      queue.pause();
      const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setDescription('⏸️ Playback paused.')
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    }
  },
};
