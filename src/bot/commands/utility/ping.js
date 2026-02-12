import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { t } from '../../../i18n/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName(t('cmd_ping_name'))
    .setDescription(t('cmd_ping_description')),

  async execute(interaction) {
    const { resource } = await interaction.deferReply({ withResponse: true });
    const sent = resource.message;
    const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);
    const uptime = formatUptime(interaction.client.uptime);

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setTitle(t('cmd_ping_response'))
      .addFields(
        {
          name: `📡 ${t('cmd_ping_latency')}`,
          value: `\`${botLatency}ms\``,
          inline: true,
        },
        {
          name: `🌐 ${t('cmd_ping_api_latency')}`,
          value: `\`${apiLatency}ms\``,
          inline: true,
        },
        {
          name: `⏱️ ${t('cmd_ping_uptime')}`,
          value: `\`${uptime}\``,
          inline: true,
        },
        {
          name: `🟢 ${t('cmd_ping_status')}`,
          value: `\`${t('cmd_ping_online')}\``,
          inline: true,
        },
      )
      .setFooter({
        text: `${process.env.BOT_NAME || 'Astra'} v${process.env.BOT_VERSION || '5.0.0'}`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
