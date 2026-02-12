import chalk from 'chalk';
import dotenv from 'dotenv';
import { t } from '../i18n/index.js';

dotenv.config();

const BOT_NAME = process.env.BOT_NAME || 'Astra';
const BOT_VERSION = process.env.BOT_VERSION || '5.0.0';
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://astra-bot.app';
const DISCORD_SUPPORT_URL = process.env.DISCORD_SUPPORT_URL || '';
const GITHUB_URL = process.env.GITHUB_URL || '';

export function showStartupBanner() {
  const banner = `
${chalk.hex('#7C3AED').bold('╔══════════════════════════════════════════════════════════════╗')}
${chalk.hex('#7C3AED').bold('║')}                                                              ${chalk.hex('#7C3AED').bold('║')}
${chalk.hex('#7C3AED').bold('║')}     ${chalk.hex('#A78BFA').bold('★')}  ${chalk.white.bold(`${BOT_NAME} Bot`)} ${chalk.gray(`v${BOT_VERSION}`)}                                      ${chalk.hex('#7C3AED').bold('║')}
${chalk.hex('#7C3AED').bold('║')}     ${chalk.gray('All-in-One Discord Bot with Web Dashboard')}                ${chalk.hex('#7C3AED').bold('║')}
${chalk.hex('#7C3AED').bold('║')}                                                              ${chalk.hex('#7C3AED').bold('║')}
${chalk.hex('#7C3AED').bold('╚══════════════════════════════════════════════════════════════╝')}
`;
  console.log(banner);
}

export function showLicenseInfo() {
  console.log(chalk.hex('#C084FC').bold('\n┌─────────────────────────────────────────────────────────────┐'));
  console.log(chalk.hex('#C084FC').bold('│') + chalk.white.bold('  📜 License & Terms                                         ') + chalk.hex('#C084FC').bold('│'));
  console.log(chalk.hex('#C084FC').bold('├─────────────────────────────────────────────────────────────┤'));
  console.log(chalk.hex('#C084FC').bold('│') + chalk.gray(`  License:   MIT License                                     `) + chalk.hex('#C084FC').bold('│'));
  console.log(chalk.hex('#C084FC').bold('│') + chalk.gray(`  Terms:     By using this bot, you agree to our ToS.        `) + chalk.hex('#C084FC').bold('│'));
  console.log(chalk.hex('#C084FC').bold('│') + chalk.gray(`  Usage:     Personal & commercial use allowed.              `) + chalk.hex('#C084FC').bold('│'));
  console.log(chalk.hex('#C084FC').bold('│') + chalk.gray(`  Template:  Licensed template — do not redistribute.        `) + chalk.hex('#C084FC').bold('│'));
  console.log(chalk.hex('#C084FC').bold('└─────────────────────────────────────────────────────────────┘'));
}

export function showSystemInfo() {
  const env = process.env.NODE_ENV || 'development';
  const runMode = process.env.RUN_MODE || 'all';
  const port = process.env.PORT || 3000;
  const dbHost = process.env.PGHOST || 'unknown';

  console.log(chalk.hex('#60A5FA').bold('\n┌─────────────────────────────────────────────────────────────┐'));
  console.log(chalk.hex('#60A5FA').bold('│') + chalk.white.bold('  ⚙️  System Information                                      ') + chalk.hex('#60A5FA').bold('│'));
  console.log(chalk.hex('#60A5FA').bold('├─────────────────────────────────────────────────────────────┤'));
  console.log(chalk.hex('#60A5FA').bold('│') + chalk.gray(`  Environment:   ${chalk.white(env.padEnd(44))}`) + chalk.hex('#60A5FA').bold('│'));
  console.log(chalk.hex('#60A5FA').bold('│') + chalk.gray(`  Run Mode:      ${chalk.white(runMode.padEnd(44))}`) + chalk.hex('#60A5FA').bold('│'));
  console.log(chalk.hex('#60A5FA').bold('│') + chalk.gray(`  Port:          ${chalk.white(String(port).padEnd(44))}`) + chalk.hex('#60A5FA').bold('│'));
  console.log(chalk.hex('#60A5FA').bold('│') + chalk.gray(`  Database:      ${chalk.white('Neon PostgreSQL'.padEnd(44))}`) + chalk.hex('#60A5FA').bold('│'));
  console.log(chalk.hex('#60A5FA').bold('│') + chalk.gray(`  DB Host:       ${chalk.white(dbHost.substring(0, 44).padEnd(44))}`) + chalk.hex('#60A5FA').bold('│'));
  console.log(chalk.hex('#60A5FA').bold('│') + chalk.gray(`  Runtime:       ${chalk.white('Bun'.padEnd(44))}`) + chalk.hex('#60A5FA').bold('│'));
  console.log(chalk.hex('#60A5FA').bold('└─────────────────────────────────────────────────────────────┘'));
}

export function showLinks() {
  console.log(chalk.hex('#34D399').bold('\n┌─────────────────────────────────────────────────────────────┐'));
  console.log(chalk.hex('#34D399').bold('│') + chalk.white.bold('  🔗 Links                                                   ') + chalk.hex('#34D399').bold('│'));
  console.log(chalk.hex('#34D399').bold('├─────────────────────────────────────────────────────────────┤'));
  if (WEBSITE_URL) {
    console.log(chalk.hex('#34D399').bold('│') + chalk.gray(`  Website:     ${chalk.hex('#34D399')(WEBSITE_URL.padEnd(46))}`) + chalk.hex('#34D399').bold('│'));
  }
  if (DISCORD_SUPPORT_URL) {
    console.log(chalk.hex('#34D399').bold('│') + chalk.gray(`  Support:     ${chalk.hex('#34D399')(DISCORD_SUPPORT_URL.padEnd(46))}`) + chalk.hex('#34D399').bold('│'));
  }
  if (GITHUB_URL) {
    console.log(chalk.hex('#34D399').bold('│') + chalk.gray(`  GitHub:      ${chalk.hex('#34D399')(GITHUB_URL.padEnd(46))}`) + chalk.hex('#34D399').bold('│'));
  }
  console.log(chalk.hex('#34D399').bold('└─────────────────────────────────────────────────────────────┘\n'));
}

export function showFullStartup() {
  showStartupBanner();
  showLicenseInfo();
  showSystemInfo();
  showLinks();
}
