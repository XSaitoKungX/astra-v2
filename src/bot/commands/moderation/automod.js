import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getDatabase } from '../../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure AutoMod settings')
    .addSubcommand(sub =>
      sub.setName('enable').setDescription('Enable AutoMod for this server')
    )
    .addSubcommand(sub =>
      sub.setName('disable').setDescription('Disable AutoMod for this server')
    )
    .addSubcommand(sub =>
      sub.setName('status').setDescription('View current AutoMod settings')
    )
    .addSubcommand(sub =>
      sub.setName('antispam')
        .setDescription('Toggle anti-spam filter')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
        .addIntegerOption(opt => opt.setName('limit').setDescription('Max messages per interval (default: 5)').setMinValue(2).setMaxValue(20))
        .addIntegerOption(opt => opt.setName('interval').setDescription('Interval in seconds (default: 5)').setMinValue(2).setMaxValue(30))
    )
    .addSubcommand(sub =>
      sub.setName('antilink')
        .setDescription('Toggle anti-link filter')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('antiinvite')
        .setDescription('Toggle anti-invite filter')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('badwords')
        .setDescription('Toggle bad words filter')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
        .addStringOption(opt => opt.setName('words').setDescription('Comma-separated list of bad words'))
    )
    .addSubcommand(sub =>
      sub.setName('caps')
        .setDescription('Toggle caps filter')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
        .addIntegerOption(opt => opt.setName('threshold').setDescription('Caps percentage threshold (default: 70)').setMinValue(50).setMaxValue(100))
    )
    .addSubcommand(sub =>
      sub.setName('emoji')
        .setDescription('Toggle emoji filter')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
        .addIntegerOption(opt => opt.setName('limit').setDescription('Max emojis per message (default: 10)').setMinValue(1).setMaxValue(50))
    )
    .addSubcommand(sub =>
      sub.setName('logchannel')
        .setDescription('Set the AutoMod log channel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Log channel (leave empty to disable)'))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const db = getDatabase();
    const guildId = interaction.guildId;

    // Ensure config exists
    const getOrCreate = async () => {
      let config = await db.autoMod.findUnique({ where: { id: guildId } });
      if (!config) {
        config = await db.autoMod.create({ data: { id: guildId } });
      }
      return config;
    };

    if (sub === 'enable') {
      await getOrCreate();
      await db.autoMod.update({ where: { id: guildId }, data: { enabled: true } });
      return interaction.reply({ content: '✅ AutoMod has been **enabled**.', ephemeral: true });
    }

    if (sub === 'disable') {
      await getOrCreate();
      await db.autoMod.update({ where: { id: guildId }, data: { enabled: false } });
      return interaction.reply({ content: '✅ AutoMod has been **disabled**.', ephemeral: true });
    }

    if (sub === 'status') {
      const config = await getOrCreate();
      const on = '🟢';
      const off = '🔴';

      const embed = new EmbedBuilder()
        .setColor(0x7C3AED)
        .setTitle('🛡️ AutoMod Settings')
        .addFields(
          { name: 'Status', value: config.enabled ? `${on} Enabled` : `${off} Disabled`, inline: true },
          { name: 'Anti-Spam', value: config.antiSpam ? `${on} ${config.antiSpamLimit} msgs/${config.antiSpamInterval}s` : `${off} Off`, inline: true },
          { name: 'Anti-Link', value: config.antiLink ? `${on} On` : `${off} Off`, inline: true },
          { name: 'Anti-Invite', value: config.antiInvite ? `${on} On` : `${off} Off`, inline: true },
          { name: 'Bad Words', value: config.badWords ? `${on} ${JSON.parse(config.badWordsList || '[]').length} word(s)` : `${off} Off`, inline: true },
          { name: 'Caps Filter', value: config.capsFilter ? `${on} >${config.capsThreshold}%` : `${off} Off`, inline: true },
          { name: 'Emoji Filter', value: config.emojiFilter ? `${on} Max ${config.emojiLimit}` : `${off} Off`, inline: true },
          { name: 'Log Channel', value: config.logChannel ? `<#${config.logChannel}>` : 'Not set', inline: true },
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'antispam') {
      await getOrCreate();
      const enabled = interaction.options.getBoolean('enabled');
      const limit = interaction.options.getInteger('limit');
      const interval = interaction.options.getInteger('interval');

      const data = { antiSpam: enabled };
      if (limit) data.antiSpamLimit = limit;
      if (interval) data.antiSpamInterval = interval;

      await db.autoMod.update({ where: { id: guildId }, data });
      return interaction.reply({
        content: enabled
          ? `✅ Anti-spam **enabled** (${limit || 5} messages per ${interval || 5}s).`
          : '✅ Anti-spam **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'antilink') {
      await getOrCreate();
      const enabled = interaction.options.getBoolean('enabled');
      await db.autoMod.update({ where: { id: guildId }, data: { antiLink: enabled } });
      return interaction.reply({ content: `✅ Anti-link **${enabled ? 'enabled' : 'disabled'}**.`, ephemeral: true });
    }

    if (sub === 'antiinvite') {
      await getOrCreate();
      const enabled = interaction.options.getBoolean('enabled');
      await db.autoMod.update({ where: { id: guildId }, data: { antiInvite: enabled } });
      return interaction.reply({ content: `✅ Anti-invite **${enabled ? 'enabled' : 'disabled'}**.`, ephemeral: true });
    }

    if (sub === 'badwords') {
      await getOrCreate();
      const enabled = interaction.options.getBoolean('enabled');
      const words = interaction.options.getString('words');

      const data = { badWords: enabled };
      if (words) {
        const wordList = words.split(',').map(w => w.trim()).filter(Boolean);
        data.badWordsList = JSON.stringify(wordList);
      }

      await db.autoMod.update({ where: { id: guildId }, data });
      return interaction.reply({
        content: enabled
          ? `✅ Bad words filter **enabled**${words ? ` with ${words.split(',').length} word(s)` : ''}.`
          : '✅ Bad words filter **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'caps') {
      await getOrCreate();
      const enabled = interaction.options.getBoolean('enabled');
      const threshold = interaction.options.getInteger('threshold');

      const data = { capsFilter: enabled };
      if (threshold) data.capsThreshold = threshold;

      await db.autoMod.update({ where: { id: guildId }, data });
      return interaction.reply({
        content: enabled
          ? `✅ Caps filter **enabled** (threshold: ${threshold || 70}%).`
          : '✅ Caps filter **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'emoji') {
      await getOrCreate();
      const enabled = interaction.options.getBoolean('enabled');
      const limit = interaction.options.getInteger('limit');

      const data = { emojiFilter: enabled };
      if (limit) data.emojiLimit = limit;

      await db.autoMod.update({ where: { id: guildId }, data });
      return interaction.reply({
        content: enabled
          ? `✅ Emoji filter **enabled** (max ${limit || 10} per message).`
          : '✅ Emoji filter **disabled**.',
        ephemeral: true,
      });
    }

    if (sub === 'logchannel') {
      await getOrCreate();
      const channel = interaction.options.getChannel('channel');
      await db.autoMod.update({
        where: { id: guildId },
        data: { logChannel: channel?.id || null },
      });
      return interaction.reply({
        content: channel
          ? `✅ AutoMod log channel set to ${channel}.`
          : '✅ AutoMod log channel **removed**.',
        ephemeral: true,
      });
    }
  },
};
