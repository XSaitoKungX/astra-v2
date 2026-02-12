import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';

export default {
  name: 'guildMemberAdd',
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
        const accountAge = Math.floor((Date.now() - member.user.createdTimestamp) / 86400000);
        const embed = new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle('📥 Member Joined')
          .setThumbnail(member.user.displayAvatarURL())
          .addFields(
            { name: 'User', value: `${member} (${member.id})`, inline: true },
            { name: 'Account Age', value: `${accountAge} day(s)`, inline: true },
            { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true },
          )
          .setTimestamp();

        if (accountAge < 7) {
          embed.addFields({ name: '⚠️ Warning', value: 'Account is less than 7 days old!' });
        }

        try { await logChannel.send({ embeds: [embed] }); } catch { /* ignore */ }
      }
    }

    // Welcome message
    if (guild?.welcomeChannel) {
      const welcomeChannel = member.guild.channels.cache.get(guild.welcomeChannel);
      if (welcomeChannel) {
        const embed = new EmbedBuilder()
          .setColor(0x7C3AED)
          .setTitle(`Welcome to ${member.guild.name}! 🎉`)
          .setDescription(`Hey ${member}, welcome to **${member.guild.name}**! You are member **#${member.guild.memberCount}**.`)
          .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
          .setTimestamp();

        try { await welcomeChannel.send({ embeds: [embed] }); } catch { /* ignore */ }
      }
    }
  },
};
