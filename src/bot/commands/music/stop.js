import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playback and clear the queue'),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    queueCheck.queue.destroy();

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription('⏹️ Playback stopped and queue cleared.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
