import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';
import { log } from '../../utils/logger.js';

const MOD_COLOR = 0xED4245;
const SUCCESS_COLOR = 0x57F287;

export function modEmbed({ action, target, moderator, reason, duration, extra }) {
  const embed = new EmbedBuilder()
    .setColor(MOD_COLOR)
    .setTitle(`🔨 ${action}`)
    .addFields(
      { name: 'User', value: `${target} (${target.id})`, inline: true },
      { name: 'Moderator', value: `${moderator}`, inline: true },
      { name: 'Reason', value: reason || 'No reason provided' },
    )
    .setTimestamp();

  if (duration) embed.addFields({ name: 'Duration', value: duration, inline: true });
  if (extra) embed.addFields(extra);

  return embed;
}

export function successEmbed({ action, target, reason, duration, extra }) {
  const embed = new EmbedBuilder()
    .setColor(SUCCESS_COLOR)
    .setDescription(`✅ **${target.tag || target.user?.tag || target}** has been **${action}**.`)
    .setTimestamp();

  if (reason) embed.addFields({ name: 'Reason', value: reason, inline: true });
  if (duration) embed.addFields({ name: 'Duration', value: duration, inline: true });
  if (extra) embed.addFields(extra);

  return embed;
}

export async function logModAction({ guildId, userId, moderator, action, reason, duration }) {
  try {
    const db = getDatabase();
    if (!db) return;

    await db.modAction.create({
      data: {
        guildId,
        userId,
        moderator,
        action,
        reason: reason || null,
        duration: duration || null,
      },
    });
  } catch (error) {
    log.bot(`Failed to log mod action: ${error.message}`, 'warn');
  }
}

export async function sendModLog(guild, embed) {
  try {
    const db = getDatabase();
    if (!db) return;

    const guildData = await db.guild.findUnique({ where: { id: guild.id } });
    if (!guildData?.modLogChannel) return;

    const channel = guild.channels.cache.get(guildData.modLogChannel);
    if (channel) await channel.send({ embeds: [embed] });
  } catch (error) {
    log.bot(`Failed to send mod log: ${error.message}`, 'warn');
  }
}

export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return null;
  const [, num, unit] = match;
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  return parseInt(num) * (multipliers[unit.toLowerCase()] || 1);
}

export function canModerate(interaction, target) {
  const member = interaction.member;
  const botMember = interaction.guild.members.me;

  if (target.id === interaction.user.id) {
    return { ok: false, reason: 'You cannot moderate yourself.' };
  }
  if (target.id === interaction.client.user.id) {
    return { ok: false, reason: 'I cannot moderate myself.' };
  }
  if (target.roles?.highest.position >= member.roles.highest.position) {
    return { ok: false, reason: 'You cannot moderate a member with equal or higher role.' };
  }
  if (target.roles?.highest.position >= botMember.roles.highest.position) {
    return { ok: false, reason: 'I cannot moderate a member with equal or higher role than mine.' };
  }
  return { ok: true };
}
