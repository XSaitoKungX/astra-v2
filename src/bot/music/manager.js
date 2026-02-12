import { Shoukaku, Connectors } from 'shoukaku';
import { log } from '../../utils/logger.js';
import { EmbedBuilder } from 'discord.js';

const LOOP_NONE = 0;
const LOOP_TRACK = 1;
const LOOP_QUEUE = 2;

export class MusicManager {
  constructor(client) {
    this.client = client;
    this.queues = new Map(); // guildId -> GuildQueue

    const nodes = [{
      name: 'main',
      url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
      auth: process.env.LAVALINK_PASSWORD,
      secure: process.env.LAVALINK_SECURE === 'true',
    }];

    this.shoukaku = new Shoukaku(new Connectors.DiscordJS(client), nodes, {
      moveOnDisconnect: false,
      resumable: false,
      reconnectTries: 3,
      reconnectInterval: 5000,
    });

    this.shoukaku.on('ready', (name) => log.bot(`Lavalink node "${name}" connected`));
    this.shoukaku.on('error', (name, error) => log.bot(`Lavalink node "${name}" error: ${error.message}`, 'error'));
    this.shoukaku.on('close', (name, code, reason) => log.bot(`Lavalink node "${name}" closed [${code}]: ${reason}`, 'warn'));
    this.shoukaku.on('disconnect', (name, players, moved) => {
      if (!moved) {
        for (const [guildId] of players) {
          this.queues.delete(guildId);
        }
      }
      log.bot(`Lavalink node "${name}" disconnected`, 'warn');
    });
  }

  getQueue(guildId) {
    return this.queues.get(guildId);
  }

  async createQueue(guildId, textChannel, voiceChannel) {
    const node = this.shoukaku.options.nodeResolver(this.shoukaku.nodes);
    if (!node) throw new Error('No Lavalink nodes available');

    const player = await node.joinChannel({
      guildId,
      channelId: voiceChannel.id,
      shardId: 0,
      deaf: true,
    });

    const queue = new GuildQueue(this, player, textChannel, voiceChannel, guildId);
    this.queues.set(guildId, queue);

    player.on('end', (data) => {
      if (data.reason === 'replaced') return;
      queue.onTrackEnd();
    });

    player.on('closed', () => {
      queue.destroy();
    });

    player.on('exception', (error) => {
      log.bot(`Player exception in ${guildId}: ${error.message}`, 'error');
      queue.textChannel.send({ content: `❌ Playback error: ${error.message}` }).catch(() => {});
      queue.onTrackEnd();
    });

    return queue;
  }

  async search(query, source = 'ytsearch') {
    const node = this.shoukaku.options.nodeResolver(this.shoukaku.nodes);
    if (!node) throw new Error('No Lavalink nodes available');

    // Detect source from URL
    let searchQuery = query;
    if (!query.startsWith('http')) {
      searchQuery = `${source}:${query}`;
    }

    const result = await node.rest.resolve(searchQuery);
    return result;
  }

  async destroy(guildId) {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.destroy();
    }
  }
}

class GuildQueue {
  constructor(manager, player, textChannel, voiceChannel, guildId) {
    this.manager = manager;
    this.player = player;
    this.textChannel = textChannel;
    this.voiceChannel = voiceChannel;
    this.guildId = guildId;
    this.tracks = [];
    this.current = null;
    this.loop = LOOP_NONE;
    this.volume = 80;
    this.paused = false;
    this.djRole = null;

    player.setGlobalVolume(this.volume);
  }

  add(track, requester) {
    this.tracks.push({ track, requester });
  }

  async play() {
    if (this.tracks.length === 0) {
      this.sendEmbed('📭 Queue is empty. Leaving voice channel.', 0xFEE75C);
      return this.destroy();
    }

    this.current = this.tracks.shift();
    await this.player.playTrack({ track: { encoded: this.current.track.encoded } });
    this.paused = false;

    const info = this.current.track.info;
    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setTitle('🎵 Now Playing')
      .setDescription(`**[${info.title}](${info.uri})**`)
      .addFields(
        { name: 'Duration', value: this.formatDuration(info.length), inline: true },
        { name: 'Author', value: info.author || 'Unknown', inline: true },
        { name: 'Requested by', value: `${this.current.requester}`, inline: true },
      )
      .setThumbnail(info.artworkUrl || null)
      .setTimestamp();

    this.textChannel.send({ embeds: [embed] }).catch(() => {});
  }

  onTrackEnd() {
    if (this.loop === LOOP_TRACK && this.current) {
      this.tracks.unshift(this.current);
    } else if (this.loop === LOOP_QUEUE && this.current) {
      this.tracks.push(this.current);
    }
    this.play();
  }

  skip() {
    this.player.stopTrack();
  }

  pause() {
    this.paused = true;
    this.player.setPaused(true);
  }

  resume() {
    this.paused = false;
    this.player.setPaused(false);
  }

  setVolume(vol) {
    this.volume = vol;
    this.player.setGlobalVolume(vol);
  }

  shuffle() {
    for (let i = this.tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
    }
  }

  remove(index) {
    if (index < 0 || index >= this.tracks.length) return null;
    return this.tracks.splice(index, 1)[0];
  }

  move(from, to) {
    if (from < 0 || from >= this.tracks.length) return false;
    if (to < 0 || to >= this.tracks.length) return false;
    const [track] = this.tracks.splice(from, 1);
    this.tracks.splice(to, 0, track);
    return true;
  }

  clearQueue() {
    this.tracks = [];
  }

  setLoop(mode) {
    this.loop = mode;
  }

  async applyFilter(filter) {
    await this.player.setFilters(filter);
  }

  destroy() {
    this.tracks = [];
    this.current = null;
    try {
      this.player.connection.disconnect();
    } catch { /* ignore */ }
    this.manager.queues.delete(this.guildId);
  }

  sendEmbed(description, color = 0x7C3AED) {
    const embed = new EmbedBuilder().setColor(color).setDescription(description);
    this.textChannel.send({ embeds: [embed] }).catch(() => {});
  }

  formatDuration(ms) {
    if (!ms || ms === 0) return 'Live';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }
}

export const FILTERS = {
  bassboost:    { equalizer: [{ band: 0, gain: 0.6 }, { band: 1, gain: 0.5 }, { band: 2, gain: 0.4 }, { band: 3, gain: 0.3 }] },
  nightcore:    { timescale: { speed: 1.3, pitch: 1.3, rate: 1.0 } },
  vaporwave:    { timescale: { speed: 0.85, pitch: 0.85, rate: 1.0 }, equalizer: [{ band: 0, gain: 0.3 }, { band: 1, gain: 0.3 }] },
  '8d':         { rotation: { rotationHz: 0.2 } },
  karaoke:      { karaoke: { level: 1.0, monoLevel: 1.0, filterBand: 220.0, filterWidth: 100.0 } },
  tremolo:      { tremolo: { frequency: 4.0, depth: 0.75 } },
  vibrato:      { vibrato: { frequency: 4.0, depth: 0.75 } },
  pop:          { equalizer: [{ band: 0, gain: -0.1 }, { band: 1, gain: 0.1 }, { band: 2, gain: 0.2 }, { band: 3, gain: 0.1 }, { band: 4, gain: 0.0 }, { band: 5, gain: -0.1 }] },
  soft:         { lowPass: { smoothing: 20.0 } },
  treble:       { equalizer: [{ band: 10, gain: 0.4 }, { band: 11, gain: 0.4 }, { band: 12, gain: 0.4 }, { band: 13, gain: 0.4 }] },
  china:        { timescale: { speed: 0.75, pitch: 1.25, rate: 1.25 } },
  chipmunk:     { timescale: { speed: 1.05, pitch: 1.35, rate: 1.25 } },
  darthvader:   { timescale: { speed: 0.975, pitch: 0.5, rate: 0.8 } },
  earrape:      { equalizer: Array.from({ length: 15 }, (_, i) => ({ band: i, gain: 0.5 })) },
  slowmo:       { timescale: { speed: 0.7, pitch: 1.0, rate: 0.8 } },
  speed:        { timescale: { speed: 1.5, pitch: 1.0, rate: 1.0 } },
  doubletime:   { timescale: { speed: 2.0, pitch: 1.0, rate: 1.0 } },
  halftime:     { timescale: { speed: 0.5, pitch: 1.0, rate: 1.0 } },
  distortion:   { distortion: { sinOffset: 0, sinScale: 1, cosOffset: 0, cosScale: 1, tanOffset: 0, tanScale: 1, offset: 0, scale: 1 } },
  lofi:         { lowPass: { smoothing: 30.0 }, equalizer: [{ band: 0, gain: 0.2 }, { band: 1, gain: 0.15 }] },
  clear:        {},
};

export { LOOP_NONE, LOOP_TRACK, LOOP_QUEUE };
