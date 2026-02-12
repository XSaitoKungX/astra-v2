import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';

export default {
  name: 'messageUpdate',
  once: false,
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const db = getDatabase();
    if (!db) return;

    let guild;
    try {
      guild = await db.guild.findUnique({ where: { id: newMessage.guild.id } });
    } catch { return; }

    if (!guild?.logChannel) return;

    const channel = newMessage.guild.channels.cache.get(guild.logChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('✏️ Message Edited')
      .setURL(newMessage.url)
      .addFields(
        { name: 'Author', value: `${newMessage.author} (${newMessage.author.id})`, inline: true },
        { name: 'Channel', value: `${newMessage.channel}`, inline: true },
        {
          name: 'Before',
          value: (oldMessage.content || '*empty*').slice(0, 1024),
        },
        {
          name: 'After',
          value: (newMessage.content || '*empty*').slice(0, 1024),
        },
      )
      .setTimestamp();

    try {
      await channel.send({ embeds: [embed] });
    } catch { /* ignore */ }
  },
};
