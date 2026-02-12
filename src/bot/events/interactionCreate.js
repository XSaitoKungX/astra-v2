import { log } from '../../utils/logger.js';
import { t } from '../../i18n/index.js';
import { getDatabase } from '../../database/index.js';

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction) {
    // Handle verification buttons/dropdowns
    if (interaction.isButton() || interaction.isStringSelectMenu()) {
      const verifyIds = ['verify_button', 'verify_rules', 'verify_dropdown'];
      if (verifyIds.includes(interaction.customId) ||
          (interaction.isStringSelectMenu() && interaction.customId === 'verify_dropdown')) {
        return handleVerification(interaction);
      }

      // Handle self-role interactions
      if (interaction.customId.startsWith('selfrole_')) {
        return handleSelfRole(interaction);
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      log.bot(`Unknown command: ${interaction.commandName}`, 'warn');
      return;
    }

    try {
      await command.execute(interaction);

      // Log command usage to database
      try {
        const db = getDatabase();
        const guildId = interaction.guildId || 'DM';

        // Ensure guild exists before logging
        if (interaction.guild) {
          await db.guild.upsert({
            where: { id: guildId },
            update: { name: interaction.guild.name, icon: interaction.guild.iconURL() },
            create: {
              id: guildId,
              name: interaction.guild.name,
              icon: interaction.guild.iconURL(),
              ownerId: interaction.guild.ownerId,
            },
          });
        }

        await db.commandLog.create({
          data: {
            guildId,
            userId: interaction.user.id,
            command: interaction.commandName,
            channel: interaction.channelId,
            success: true,
          },
        });
      } catch {
        // Silently fail DB logging — don't break command execution
      }

      log.bot(`/${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`, 'debug');
    } catch (error) {
      log.bot(`Error executing /${interaction.commandName}: ${error.message}`, 'error');

      const errorMessage = t('error_generic');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true }).catch(() => {});
      }
    }
  },
};

async function handleVerification(interaction) {
  try {
    const db = getDatabase();
    if (!db) return interaction.reply({ content: '❌ Database unavailable.', ephemeral: true });

    const guildData = await db.guild.findUnique({ where: { id: interaction.guildId } });
    if (!guildData?.verifyRole) {
      return interaction.reply({ content: '❌ Verification is not configured.', ephemeral: true });
    }

    const member = interaction.member;
    if (member.roles.cache.has(guildData.verifyRole)) {
      return interaction.reply({ content: '✅ You are already verified!', ephemeral: true });
    }

    await member.roles.add(guildData.verifyRole);
    await interaction.reply({ content: '✅ You have been verified! Welcome to the server.', ephemeral: true });

    log.bot(`${member.user.tag} verified in ${interaction.guild.name}`, 'debug');
  } catch (error) {
    log.bot(`Verification error: ${error.message}`, 'error');
    await interaction.reply({ content: '❌ Verification failed. Please contact a moderator.', ephemeral: true }).catch(() => {});
  }
}

async function handleSelfRole(interaction) {
  try {
    const roleId = interaction.customId.replace('selfrole_', '');
    const member = interaction.member;
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
      return interaction.reply({ content: '❌ This role no longer exists.', ephemeral: true });
    }

    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
      return interaction.reply({ content: `✅ Removed role **${role.name}**.`, ephemeral: true });
    } else {
      await member.roles.add(roleId);
      return interaction.reply({ content: `✅ Added role **${role.name}**.`, ephemeral: true });
    }
  } catch (error) {
    log.bot(`Self-role error: ${error.message}`, 'error');
    await interaction.reply({ content: '❌ Failed to update role. Please contact a moderator.', ephemeral: true }).catch(() => {});
  }
}
