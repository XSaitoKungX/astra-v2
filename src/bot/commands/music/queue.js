import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkMusic, checkQueue, formatDuration } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue')
    .addIntegerOption(opt =>
      opt.setName('page').setDescription('Page number').setMinValue(1)
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const { queue } = queueCheck;
    const page = (interaction.options.getInteger('page') || 1) - 1;
    const perPage = 10;
    const start = page * perPage;
    const end = start + perPage;
    const totalPages = Math.ceil(queue.tracks.length / perPage) || 1;

    const info = queue.current.track.info;

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setTitle('📋 Queue')
      .setDescription(`**Now Playing:** [${info.title}](${info.uri}) — ${formatDuration(info.length)}`)
      .setTimestamp();

    if (queue.tracks.length > 0) {
      const tracks = queue.tracks.slice(start, end);
      const list = tracks.map((t, i) => {
        const ti = t.track.info;
        return `**${start + i + 1}.** [${ti.title}](${ti.uri}) — ${formatDuration(ti.length)} | ${t.requester}`;
      }).join('\n');

      embed.addFields({ name: `Up Next (${queue.tracks.length} total)`, value: list || 'Empty' });
    } else {
      embed.addFields({ name: 'Up Next', value: 'No more tracks in queue.' });
    }

    embed.setFooter({ text: `Page ${page + 1}/${totalPages} • Volume: ${queue.volume}%` });

    await interaction.reply({ embeds: [embed] });
  },
};
