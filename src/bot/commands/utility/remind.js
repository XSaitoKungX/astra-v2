import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { parseDuration, formatDuration } from '../../utils/moderation.js';
import { log } from '../../../utils/logger.js';

// In-memory reminders store
const reminders = new Map();
let reminderId = 0;

export default {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('Create a new reminder')
        .addStringOption(opt => opt.setName('time').setDescription('When to remind (e.g. 10m, 1h, 1d)').setRequired(true))
        .addStringOption(opt => opt.setName('message').setDescription('What to remind you about').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('View your active reminders')
    )
    .addSubcommand(sub =>
      sub.setName('cancel')
        .setDescription('Cancel a reminder')
        .addIntegerOption(opt => opt.setName('id').setDescription('Reminder ID to cancel').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const timeStr = interaction.options.getString('time');
      const message = interaction.options.getString('message');

      const seconds = parseDuration(timeStr);
      if (!seconds || seconds < 10 || seconds > 2592000) {
        return interaction.reply({ content: '❌ Invalid time. Use format like `10m`, `1h`, `1d`. Min 10s, max 30 days.', ephemeral: true });
      }

      reminderId++;
      const id = reminderId;
      const endsAt = Date.now() + seconds * 1000;

      const timeout = setTimeout(async () => {
        reminders.delete(`${interaction.user.id}:${id}`);
        try {
          const embed = new EmbedBuilder()
            .setColor(0x7C3AED)
            .setTitle('⏰ Reminder')
            .setDescription(message)
            .setFooter({ text: `Reminder #${id}` })
            .setTimestamp();

          await interaction.user.send({ embeds: [embed] }).catch(async () => {
            // If DMs are closed, try to send in the original channel
            const channel = interaction.channel;
            if (channel) {
              await channel.send({ content: `⏰ ${interaction.user}, reminder: **${message}**` }).catch(() => {});
            }
          });
        } catch (error) {
          log.bot(`Reminder delivery failed: ${error.message}`, 'warn');
        }
      }, seconds * 1000);

      reminders.set(`${interaction.user.id}:${id}`, {
        id,
        message,
        endsAt,
        timeout,
        channelId: interaction.channelId,
      });

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setDescription(`✅ Reminder set! I'll remind you in **${formatDuration(seconds)}**.`)
        .addFields({ name: 'Message', value: message })
        .setFooter({ text: `Reminder #${id}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'list') {
      const userReminders = [];
      for (const [key, data] of reminders) {
        if (key.startsWith(`${interaction.user.id}:`)) {
          userReminders.push(data);
        }
      }

      if (userReminders.length === 0) {
        return interaction.reply({ content: '📭 You have no active reminders.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle('⏰ Your Reminders')
        .setDescription(
          userReminders.map(r =>
            `**#${r.id}** — <t:${Math.floor(r.endsAt / 1000)}:R>\n${r.message}`
          ).join('\n\n')
        )
        .setFooter({ text: `${userReminders.length} active reminder(s)` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'cancel') {
      const id = interaction.options.getInteger('id');
      const key = `${interaction.user.id}:${id}`;

      if (!reminders.has(key)) {
        return interaction.reply({ content: `❌ Reminder #${id} not found.`, ephemeral: true });
      }

      const data = reminders.get(key);
      clearTimeout(data.timeout);
      reminders.delete(key);

      await interaction.reply({ content: `✅ Reminder **#${id}** cancelled.`, ephemeral: true });
    }
  },
};
