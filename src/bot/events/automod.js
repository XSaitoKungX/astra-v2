import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';
import { log } from '../../utils/logger.js';

// In-memory spam tracker: Map<guildId:userId, { count, firstMessage }>
const spamTracker = new Map();

export default {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (message.author.bot || !message.guild || !message.member) return;

    const db = getDatabase();
    if (!db) return;

    let config;
    try {
      config = await db.autoMod.findUnique({ where: { id: message.guild.id } });
    } catch {
      return;
    }

    if (!config || !config.enabled) return;

    // Check exemptions
    const exemptRoles = JSON.parse(config.exemptRoles || '[]');
    const exemptChannels = JSON.parse(config.exemptChannels || '[]');

    if (exemptChannels.includes(message.channel.id)) return;
    if (message.member.roles.cache.some(r => exemptRoles.includes(r.id))) return;
    if (message.member.permissions.has('ManageMessages')) return;

    const content = message.content;
    let violated = false;
    let reason = '';

    // Anti-Invite
    if (!violated && config.antiInvite) {
      const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/.+/gi;
      if (inviteRegex.test(content)) {
        violated = true;
        reason = 'Discord invite link detected';
      }
    }

    // Anti-Link
    if (!violated && config.antiLink) {
      const linkRegex = /https?:\/\/[^\s]+/gi;
      if (linkRegex.test(content)) {
        violated = true;
        reason = 'External link detected';
      }
    }

    // Bad Words
    if (!violated && config.badWords) {
      const badWordsList = JSON.parse(config.badWordsList || '[]');
      const lower = content.toLowerCase();
      const found = badWordsList.find(w => lower.includes(w.toLowerCase()));
      if (found) {
        violated = true;
        reason = 'Blocked word detected';
      }
    }

    // Caps Filter
    if (!violated && config.capsFilter && content.length > 10) {
      const letters = content.replace(/[^a-zA-Z]/g, '');
      if (letters.length > 0) {
        const capsPercent = (letters.replace(/[^A-Z]/g, '').length / letters.length) * 100;
        if (capsPercent >= config.capsThreshold) {
          violated = true;
          reason = `Excessive caps (${Math.round(capsPercent)}%)`;
        }
      }
    }

    // Emoji Filter
    if (!violated && config.emojiFilter) {
      const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|<a?:\w+:\d+>)/gu;
      const emojiCount = (content.match(emojiRegex) || []).length;
      if (emojiCount > config.emojiLimit) {
        violated = true;
        reason = `Too many emojis (${emojiCount}/${config.emojiLimit})`;
      }
    }

    // Anti-Spam
    if (!violated && config.antiSpam) {
      const key = `${message.guild.id}:${message.author.id}`;
      const now = Date.now();
      const tracker = spamTracker.get(key);

      if (tracker && now - tracker.firstMessage < config.antiSpamInterval * 1000) {
        tracker.count++;
        if (tracker.count >= config.antiSpamLimit) {
          violated = true;
          reason = `Spam detected (${tracker.count} messages in ${config.antiSpamInterval}s)`;
          spamTracker.delete(key);
        }
      } else {
        spamTracker.set(key, { count: 1, firstMessage: now });
      }

      // Cleanup old entries every 100 messages
      if (Math.random() < 0.01) {
        for (const [k, v] of spamTracker) {
          if (now - v.firstMessage > 30000) spamTracker.delete(k);
        }
      }
    }

    if (!violated) return;

    // Take action
    try {
      await message.delete();
    } catch {
      // May not have permission
    }

    try {
      const warn = await message.channel.send({
        content: `⚠️ ${message.author}, your message was removed. **${reason}**.`,
      });
      setTimeout(() => warn.delete().catch(() => {}), 5000);
    } catch {
      // Ignore
    }

    // Log to automod channel
    if (config.logChannel) {
      try {
        const logChannel = message.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('🛡️ AutoMod Action')
            .addFields(
              { name: 'User', value: `${message.author} (${message.author.id})`, inline: true },
              { name: 'Channel', value: `${message.channel}`, inline: true },
              { name: 'Reason', value: reason },
              { name: 'Message', value: content.length > 1024 ? content.slice(0, 1021) + '...' : content || '*empty*' },
            )
            .setTimestamp();
          await logChannel.send({ embeds: [embed] });
        }
      } catch (error) {
        log.bot(`AutoMod log failed: ${error.message}`, 'warn');
      }
    }
  },
};
