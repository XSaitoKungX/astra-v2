import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkMusic, checkQueue } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Search for song lyrics')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Song name (default: currently playing)')
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    let query = interaction.options.getString('query');

    if (!query) {
      const queueCheck = checkQueue(interaction);
      if (!queueCheck.ok) return interaction.reply({ content: '❌ Nothing is playing. Provide a song name.', ephemeral: true });
      query = queueCheck.queue.current.track.info.title;
    }

    await interaction.deferReply();

    try {
      // Use lrclib.net — free, no API key needed
      const encoded = encodeURIComponent(query.replace(/\(.*?\)|\[.*?\]/g, '').trim());
      const res = await fetch(`https://lrclib.net/api/search?q=${encoded}`);

      if (!res.ok) {
        return interaction.editReply({ content: '❌ Lyrics service unavailable.' });
      }

      const data = await res.json();

      if (!data || data.length === 0) {
        return interaction.editReply({ content: `❌ No lyrics found for **${query}**.` });
      }

      const song = data[0];
      const lyrics = song.plainLyrics || song.syncedLyrics;

      if (!lyrics) {
        return interaction.editReply({ content: `❌ No lyrics found for **${query}**.` });
      }

      // Paginate if lyrics are too long
      const maxLen = 4000;
      const pages = [];
      let current = '';

      for (const line of lyrics.split('\n')) {
        if (current.length + line.length + 1 > maxLen) {
          pages.push(current);
          current = '';
        }
        current += line + '\n';
      }
      if (current) pages.push(current);

      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle(`🎤 ${song.trackName || query}`)
        .setDescription(pages[0])
        .setTimestamp();

      if (song.artistName) embed.setAuthor({ name: song.artistName });
      if (pages.length > 1) embed.setFooter({ text: `Page 1/${pages.length}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({ content: `❌ Failed to fetch lyrics: ${error.message}` });
    }
  },
};
