import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a track from the queue')
    .addIntegerOption(opt =>
      opt.setName('position').setDescription('Position in queue (1-based)').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const position = interaction.options.getInteger('position');
    const { queue } = queueCheck;

    const removed = queue.remove(position - 1);
    if (!removed) {
      return interaction.reply({ content: `❌ No track at position **#${position}**.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription(`🗑️ Removed **${removed.track.info.title}** from the queue.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
