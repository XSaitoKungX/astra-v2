export function checkVoice(interaction) {
  const vc = interaction.member.voice.channel;
  if (!vc) {
    return { ok: false, reason: '❌ You must be in a voice channel.' };
  }

  const queue = interaction.client.music?.getQueue(interaction.guildId);
  if (queue && queue.voiceChannel.id !== vc.id) {
    return { ok: false, reason: '❌ You must be in the same voice channel as the bot.' };
  }

  return { ok: true, vc };
}

export function checkMusic(interaction) {
  if (!interaction.client.music) {
    return { ok: false, reason: '❌ Music system is not available.' };
  }
  return { ok: true };
}

export function checkQueue(interaction) {
  const queue = interaction.client.music?.getQueue(interaction.guildId);
  if (!queue || !queue.current) {
    return { ok: false, reason: '❌ Nothing is playing right now.' };
  }
  return { ok: true, queue };
}

export function formatDuration(ms) {
  if (!ms || ms === 0) return 'Live';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}
