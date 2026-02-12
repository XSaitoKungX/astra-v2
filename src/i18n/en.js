export default {
  // General
  bot_name: 'Astra',
  bot_description: 'All-in-One Discord Bot with Web Dashboard',

  // Startup
  startup_banner: 'Starting Astra Bot v{version}...',
  startup_ready: '✨ {botName} is online and ready!',
  startup_guilds: 'Serving {count} guild(s)',
  startup_commands: 'Loaded {count} command(s)',
  startup_api: 'API server running on port {port}',
  startup_db: 'Database connected successfully',

  // License
  license_title: '📜 License Agreement',
  license_text: 'This software is licensed under the MIT License.',
  license_tos: 'By using this bot, you agree to our Terms of Service.',
  license_usage: 'This bot template is for personal and commercial use.',
  license_support: 'Support: {supportUrl}',
  license_website: 'Website: {websiteUrl}',

  // Commands
  cmd_ping_name: 'ping',
  cmd_ping_description: 'Check bot latency and API response time',
  cmd_ping_response: '🏓 Pong!',
  cmd_ping_latency: 'Bot Latency',
  cmd_ping_api_latency: 'API Latency',
  cmd_ping_uptime: 'Uptime',
  cmd_ping_status: 'Status',
  cmd_ping_online: 'Online',

  // Dashboard
  dash_title: 'Astra Dashboard',
  dash_home: 'Home',
  dash_servers: 'Servers',
  dash_commands: 'Commands',
  dash_stats: 'Statistics',
  dash_settings: 'Settings',
  dash_login: 'Login with Discord',
  dash_logout: 'Logout',
  dash_welcome: 'Welcome to {botName}',
  dash_subtitle: 'The All-in-One Discord Bot',
  dash_total_servers: 'Total Servers',
  dash_total_users: 'Total Users',
  dash_total_commands: 'Commands Used',
  dash_uptime: 'Uptime',

  // API
  api_unauthorized: 'Unauthorized',
  api_not_found: 'Not found',
  api_error: 'Internal server error',
  api_rate_limit: 'Too many requests, please try again later',

  // Moderation
  cmd_ban_description: 'Ban a member from the server',
  cmd_kick_description: 'Kick a member from the server',
  cmd_timeout_description: 'Timeout a member (mute them temporarily)',
  cmd_warn_description: 'Manage warnings for a member',
  cmd_clear_description: 'Delete messages from a channel',
  cmd_slowmode_description: 'Set slowmode for a channel',
  cmd_lock_description: 'Lock or unlock a channel',
  cmd_setup_description: 'Configure server settings',
  cmd_automod_description: 'Configure AutoMod settings',
  cmd_verify_description: 'Set up a verification panel',
  cmd_selfroles_description: 'Create a self-role panel',
  mod_no_reason: 'No reason provided',
  mod_banned: 'banned',
  mod_kicked: 'kicked',
  mod_timed_out: 'timed out',
  mod_warned: 'warned',

  // Music
  cmd_play_description: 'Play a song or add it to the queue',
  cmd_stop_description: 'Stop playback and clear the queue',
  cmd_skip_description: 'Skip the current track',
  cmd_pause_description: 'Pause or resume playback',
  cmd_nowplaying_description: 'Show the currently playing track',
  cmd_queue_description: 'Show the current queue',
  cmd_volume_description: 'Set the playback volume',
  cmd_loop_description: 'Set loop mode',
  cmd_shuffle_description: 'Shuffle the queue',
  cmd_remove_description: 'Remove a track from the queue',
  cmd_move_description: 'Move a track in the queue',
  cmd_filter_description: 'Apply an audio filter',
  cmd_lyrics_description: 'Search for song lyrics',
  cmd_dj_description: 'Configure DJ role for music commands',

  // Utility
  cmd_afk_description: 'Set your AFK status',
  cmd_remind_description: 'Set a reminder',
  afk_set: '{user} is now AFK: {reason}',
  afk_welcome_back: 'Welcome back, {user}! You were AFK for {duration}.',
  afk_mention: '{user} is AFK: {reason} ({time})',
  remind_set: 'Reminder set! I\'ll remind you in {duration}.',
  remind_none: 'You have no active reminders.',

  // Errors
  error_generic: 'An error occurred. Please try again.',
  error_no_permission: 'You do not have permission to use this command.',
  error_bot_no_permission: 'I do not have the required permissions.',
  error_cooldown: 'Please wait {time} before using this command again.',
};
