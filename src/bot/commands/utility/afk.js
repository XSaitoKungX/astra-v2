import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// In-memory AFK store: Map<guildId:userId, { reason, timestamp }>
// Exported so the messageCreate event can access it
export const afkUsers = new Map();

export default {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(opt => opt.setName('reason').setDescription('AFK reason')),

  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'AFK';
    const key = `${interaction.guildId}:${interaction.user.id}`;

    afkUsers.set(key, {
      reason,
      timestamp: Date.now(),
    });

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setDescription(`💤 ${interaction.user} is now AFK: **${reason}**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
