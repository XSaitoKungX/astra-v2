import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic } from '../../utils/music.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add it to the queue')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Song name or URL (YouTube, Spotify, SoundCloud, Apple Music)').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('source')
        .setDescription('Search source')
        .addChoices(
          { name: 'YouTube', value: 'ytsearch' },
          { name: 'YouTube Music', value: 'ytmsearch' },
          { name: 'SoundCloud', value: 'scsearch' },
          { name: 'Spotify', value: 'spsearch' },
          { name: 'Apple Music', value: 'amsearch' },
        )
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const query = interaction.options.getString('query');
    const source = interaction.options.getString('source') || 'ytsearch';

    await interaction.deferReply();

    try {
      const result = await interaction.client.music.search(query, source);

      if (!result || result.loadType === 'empty' || result.loadType === 'error') {
        return interaction.editReply({ content: '❌ No results found.' });
      }

      let queue = interaction.client.music.getQueue(interaction.guildId);
      if (!queue) {
        queue = await interaction.client.music.createQueue(
          interaction.guildId,
          interaction.channel,
          voiceCheck.vc,
        );
      }

      if (result.loadType === 'playlist') {
        for (const track of result.data.tracks) {
          queue.add(track, interaction.user);
        }

        const embed = new EmbedBuilder()
          .setColor(0x7C3AED)
          .setDescription(`📋 Added **${result.data.tracks.length}** tracks from **${result.data.info.name}** to the queue.`)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
      } else {
        const track = result.loadType === 'search' ? result.data[0] : result.data;
        queue.add(track, interaction.user);

        if (queue.current) {
          const embed = new EmbedBuilder()
            .setColor(0x7C3AED)
            .setDescription(`🎵 Added **[${track.info.title}](${track.info.uri})** to the queue. Position: **#${queue.tracks.length}**`)
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.editReply({ content: '🎵 Starting playback...' });
        }
      }

      if (!queue.current) {
        await queue.play();
      }
    } catch (error) {
      await interaction.editReply({ content: `❌ Failed to play: ${error.message}` });
    }
  },
};
