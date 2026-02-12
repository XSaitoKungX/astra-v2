import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the playback volume')
    .addIntegerOption(opt =>
      opt.setName('level').setDescription('Volume level (0-150)').setRequired(true).setMinValue(0).setMaxValue(150)
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const level = interaction.options.getInteger('level');
    queueCheck.queue.setVolume(level);

    const emoji = level === 0 ? '🔇' : level < 50 ? '🔉' : '🔊';

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setDescription(`${emoji} Volume set to **${level}%**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
