import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Move a track in the queue')
    .addIntegerOption(opt =>
      opt.setName('from').setDescription('Current position (1-based)').setRequired(true).setMinValue(1)
    )
    .addIntegerOption(opt =>
      opt.setName('to').setDescription('New position (1-based)').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const from = interaction.options.getInteger('from') - 1;
    const to = interaction.options.getInteger('to') - 1;
    const { queue } = queueCheck;

    if (!queue.move(from, to)) {
      return interaction.reply({ content: '❌ Invalid positions.', ephemeral: true });
    }

    const track = queue.tracks[to];
    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setDescription(`↕️ Moved **${track.track.info.title}** to position **#${to + 1}**.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
