import { afkUsers } from '../commands/utility/afk.js';

export default {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const authorKey = `${message.guild.id}:${message.author.id}`;

    // Remove AFK if the user sends a message
    if (afkUsers.has(authorKey)) {
      const afkData = afkUsers.get(authorKey);
      afkUsers.delete(authorKey);

      const duration = Math.floor((Date.now() - afkData.timestamp) / 1000);
      const fmt = duration < 60 ? `${duration}s` : duration < 3600 ? `${Math.floor(duration / 60)}m` : `${Math.floor(duration / 3600)}h`;

      try {
        const reply = await message.reply({
          content: `👋 Welcome back, ${message.author}! You were AFK for **${fmt}**.`,
          allowedMentions: { repliedUser: false },
        });
        setTimeout(() => reply.delete().catch(() => {}), 5000);
      } catch { /* ignore */ }

      // Restore nickname if it was changed
      if (message.member.nickname?.startsWith('[AFK] ')) {
        try {
          await message.member.setNickname(message.member.nickname.replace('[AFK] ', ''));
        } catch { /* ignore */ }
      }
    }

    // Notify when mentioning an AFK user
    if (message.mentions.users.size > 0) {
      for (const [userId, user] of message.mentions.users) {
        const mentionKey = `${message.guild.id}:${userId}`;
        if (afkUsers.has(mentionKey)) {
          const afkData = afkUsers.get(mentionKey);
          const ago = Math.floor((Date.now() - afkData.timestamp) / 1000);
          const fmt = ago < 60 ? `${ago}s ago` : ago < 3600 ? `${Math.floor(ago / 60)}m ago` : `${Math.floor(ago / 3600)}h ago`;

          try {
            await message.reply({
              content: `💤 **${user.tag}** is AFK: **${afkData.reason}** *(${fmt})*`,
              allowedMentions: { repliedUser: false },
            });
          } catch { /* ignore */ }
        }
      }
    }
  },
};
