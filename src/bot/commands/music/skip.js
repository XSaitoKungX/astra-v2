import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current track')
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('Number of tracks to skip').setMinValue(1)
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const amount = interaction.options.getInteger('amount') || 1;
    const { queue } = queueCheck;

    if (amount > 1) {
      const toRemove = Math.min(amount - 1, queue.tracks.length);
      queue.tracks.splice(0, toRemove);
    }

    const skipped = queue.current.track.info.title;
    queue.skip();

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setDescription(`⏭️ Skipped **${skipped}**${amount > 1 ? ` (+${amount - 1} more)` : ''}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
