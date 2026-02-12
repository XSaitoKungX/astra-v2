import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';

export default {
  name: 'guildMemberRemove',
  once: false,
  async execute(member) {
    const db = getDatabase();
    if (!db) return;

    let guild;
    try {
      guild = await db.guild.findUnique({ where: { id: member.guild.id } });
    } catch { return; }

    // Log to log channel
    if (guild?.logChannel) {
      const logChannel = member.guild.channels.cache.get(guild.logChannel);
      if (logChannel) {
        const roles = member.roles.cache
          .filter(r => r.id !== member.guild.id)
          .map(r => r.toString())
          .join(', ') || 'None';

        const embed = new EmbedBuilder()
          .setColor(0xED4245)
          .setTitle('📤 Member Left')
          .setThumbnail(member.user.displayAvatarURL())
          .addFields(
            { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
            { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true },
            { name: 'Roles', value: roles.length > 1024 ? roles.slice(0, 1021) + '...' : roles },
          )
          .setTimestamp();

        try { await logChannel.send({ embeds: [embed] }); } catch { /* ignore */ }
      }
    }

    // Goodbye message
    if (guild?.goodbyeChannel) {
      const goodbyeChannel = member.guild.channels.cache.get(guild.goodbyeChannel);
      if (goodbyeChannel) {
        const embed = new EmbedBuilder()
          .setColor(0xED4245)
          .setDescription(`**${member.user.tag}** has left the server. We now have **${member.guild.memberCount}** members.`)
          .setTimestamp();

        try { await goodbyeChannel.send({ embeds: [embed] }); } catch { /* ignore */ }
      }
    }
  },
};
