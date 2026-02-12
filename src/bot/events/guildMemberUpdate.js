import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';

export default {
  name: 'guildMemberUpdate',
  once: false,
  async execute(oldMember, newMember) {
    const db = getDatabase();
    if (!db) return;

    let guild;
    try {
      guild = await db.guild.findUnique({ where: { id: newMember.guild.id } });
    } catch { return; }

    if (!guild?.logChannel) return;

    const logChannel = newMember.guild.channels.cache.get(guild.logChannel);
    if (!logChannel) return;

    // Role changes
    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

    if (addedRoles.size > 0 || removedRoles.size > 0) {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🏷️ Role Update')
        .addFields(
          { name: 'User', value: `${newMember} (${newMember.id})`, inline: true },
        )
        .setTimestamp();

      if (addedRoles.size > 0) {
        embed.addFields({ name: 'Added', value: addedRoles.map(r => r.toString()).join(', '), inline: true });
      }
      if (removedRoles.size > 0) {
        embed.addFields({ name: 'Removed', value: removedRoles.map(r => r.toString()).join(', '), inline: true });
      }

      try { await logChannel.send({ embeds: [embed] }); } catch { /* ignore */ }
    }

    // Nickname change
    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('📝 Nickname Changed')
        .addFields(
          { name: 'User', value: `${newMember} (${newMember.id})`, inline: true },
          { name: 'Before', value: oldMember.nickname || '*None*', inline: true },
          { name: 'After', value: newMember.nickname || '*None*', inline: true },
        )
        .setTimestamp();

      try { await logChannel.send({ embeds: [embed] }); } catch { /* ignore */ }
    }
  },
};
