import { EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../database/index.js';

export default {
  name: 'messageDelete',
  once: false,
  async execute(message) {
    if (!message.guild || message.author?.bot) return;

    const db = getDatabase();
    if (!db) return;

    let guild;
    try {
      guild = await db.guild.findUnique({ where: { id: message.guild.id } });
    } catch { return; }

    if (!guild?.logChannel) return;

    const channel = message.guild.channels.cache.get(guild.logChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('🗑️ Message Deleted')
      .addFields(
        { name: 'Author', value: `${message.author || 'Unknown'} (${message.author?.id || '?'})`, inline: true },
        { name: 'Channel', value: `${message.channel}`, inline: true },
      )
      .setTimestamp();

    if (message.content) {
      embed.addFields({
        name: 'Content',
        value: message.content.length > 1024 ? message.content.slice(0, 1021) + '...' : message.content,
      });
    }

    if (message.attachments.size > 0) {
      embed.addFields({
        name: 'Attachments',
        value: message.attachments.map(a => a.name).join(', '),
      });
    }

    try {
      await channel.send({ embeds: [embed] });
    } catch { /* ignore */ }
  },
};
