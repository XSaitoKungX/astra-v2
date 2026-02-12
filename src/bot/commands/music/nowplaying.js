import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkMusic, checkQueue, formatDuration } from '../../utils/music.js';
import { LOOP_NONE, LOOP_TRACK, LOOP_QUEUE } from '../../music/manager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing track'),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const { queue } = queueCheck;
    const info = queue.current.track.info;

    const loopText = queue.loop === LOOP_TRACK ? '🔂 Track' : queue.loop === LOOP_QUEUE ? '🔁 Queue' : '▶️ Off';

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setTitle('🎵 Now Playing')
      .setDescription(`**[${info.title}](${info.uri})**`)
      .addFields(
        { name: 'Author', value: info.author || 'Unknown', inline: true },
        { name: 'Duration', value: formatDuration(info.length), inline: true },
        { name: 'Volume', value: `${queue.volume}%`, inline: true },
        { name: 'Loop', value: loopText, inline: true },
        { name: 'Queue', value: `${queue.tracks.length} track(s)`, inline: true },
        { name: 'Requested by', value: `${queue.current.requester}`, inline: true },
      )
      .setThumbnail(info.artworkUrl || null)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
