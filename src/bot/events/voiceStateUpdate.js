import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';

export default {
  name: 'voiceStateUpdate',
  once: false,
  async execute(oldState, newState) {
    const guild = oldState.guild || newState.guild;
    if (!guild) return;

    const db = getDatabase();
    if (!db) return;

    let guildData;
    try {
      guildData = await db.guild.findUnique({ where: { id: guild.id } });
    } catch { return; }

    if (!guildData?.logChannel) return;

    const logChannel = guild.channels.cache.get(guildData.logChannel);
    if (!logChannel) return;

    const member = newState.member || oldState.member;
    if (!member || member.user.bot) return;

    let embed = null;

    // Joined voice channel
    if (!oldState.channelId && newState.channelId) {
      embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('🔊 Voice Join')
        .addFields(
          { name: 'User', value: `${member} (${member.id})`, inline: true },
          { name: 'Channel', value: `${newState.channel}`, inline: true },
        )
        .setTimestamp();
    }

    // Left voice channel
    else if (oldState.channelId && !newState.channelId) {
      embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('🔇 Voice Leave')
        .addFields(
          { name: 'User', value: `${member} (${member.id})`, inline: true },
          { name: 'Channel', value: `${oldState.channel}`, inline: true },
        )
        .setTimestamp();
    }

    // Moved voice channel
    else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle('🔀 Voice Move')
        .addFields(
          { name: 'User', value: `${member} (${member.id})`, inline: true },
          { name: 'From', value: `${oldState.channel}`, inline: true },
          { name: 'To', value: `${newState.channel}`, inline: true },
        )
        .setTimestamp();
    }

    if (embed) {
      try { await logChannel.send({ embeds: [embed] }); } catch { /* ignore */ }
    }
  },
};
