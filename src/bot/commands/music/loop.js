import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkVoice, checkMusic, checkQueue } from '../../utils/music.js';
import { LOOP_NONE, LOOP_TRACK, LOOP_QUEUE } from '../../music/manager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set loop mode')
    .addStringOption(opt =>
      opt.setName('mode')
        .setDescription('Loop mode')
        .setRequired(true)
        .addChoices(
          { name: 'Off', value: 'off' },
          { name: 'Track', value: 'track' },
          { name: 'Queue', value: 'queue' },
        )
    ),

  async execute(interaction) {
    const musicCheck = checkMusic(interaction);
    if (!musicCheck.ok) return interaction.reply({ content: musicCheck.reason, ephemeral: true });

    const voiceCheck = checkVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ content: voiceCheck.reason, ephemeral: true });

    const queueCheck = checkQueue(interaction);
    if (!queueCheck.ok) return interaction.reply({ content: queueCheck.reason, ephemeral: true });

    const mode = interaction.options.getString('mode');
    const { queue } = queueCheck;

    const modes = { off: LOOP_NONE, track: LOOP_TRACK, queue: LOOP_QUEUE };
    const labels = { off: '▶️ Loop disabled', track: '🔂 Looping current track', queue: '🔁 Looping entire queue' };

    queue.setLoop(modes[mode]);

    const embed = new EmbedBuilder()
      .setColor(0x7C3AED)
      .setDescription(labels[mode])
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
