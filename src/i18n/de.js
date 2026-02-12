export default {
  // General
  bot_name: 'Astra',
  bot_description: 'All-in-One Discord Bot mit Web Dashboard',

  // Startup
  startup_banner: 'Starte Astra Bot v{version}...',
  startup_ready: '✨ {botName} ist online und bereit!',
  startup_guilds: 'Bedient {count} Server',
  startup_commands: '{count} Befehl(e) geladen',
  startup_api: 'API-Server läuft auf Port {port}',
  startup_db: 'Datenbankverbindung erfolgreich',

  // License
  license_title: '📜 Lizenzvereinbarung',
  license_text: 'Diese Software ist unter der MIT-Lizenz lizenziert.',
  license_tos: 'Durch die Nutzung dieses Bots stimmen Sie unseren Nutzungsbedingungen zu.',
  license_usage: 'Dieses Bot-Template ist für persönliche und kommerzielle Nutzung.',
  license_support: 'Support: {supportUrl}',
  license_website: 'Webseite: {websiteUrl}',

  // Commands
  cmd_ping_name: 'ping',
  cmd_ping_description: 'Bot-Latenz und API-Antwortzeit prüfen',
  cmd_ping_response: '🏓 Pong!',
  cmd_ping_latency: 'Bot-Latenz',
  cmd_ping_api_latency: 'API-Latenz',
  cmd_ping_uptime: 'Betriebszeit',
  cmd_ping_status: 'Status',
  cmd_ping_online: 'Online',

  // Dashboard
  dash_title: 'Astra Dashboard',
  dash_home: 'Startseite',
  dash_servers: 'Server',
  dash_commands: 'Befehle',
  dash_stats: 'Statistiken',
  dash_settings: 'Einstellungen',
  dash_login: 'Mit Discord anmelden',
  dash_logout: 'Abmelden',
  dash_welcome: 'Willkommen bei {botName}',
  dash_subtitle: 'Der All-in-One Discord Bot',
  dash_total_servers: 'Server gesamt',
  dash_total_users: 'Nutzer gesamt',
  dash_total_commands: 'Befehle ausgeführt',
  dash_uptime: 'Betriebszeit',

  // API
  api_unauthorized: 'Nicht autorisiert',
  api_not_found: 'Nicht gefunden',
  api_error: 'Interner Serverfehler',
  api_rate_limit: 'Zu viele Anfragen, bitte versuchen Sie es später erneut',

  // Moderation
  cmd_ban_description: 'Ein Mitglied vom Server bannen',
  cmd_kick_description: 'Ein Mitglied vom Server kicken',
  cmd_timeout_description: 'Ein Mitglied temporär stummschalten',
  cmd_warn_description: 'Verwarnungen für ein Mitglied verwalten',
  cmd_clear_description: 'Nachrichten aus einem Kanal löschen',
  cmd_slowmode_description: 'Slowmode für einen Kanal einstellen',
  cmd_lock_description: 'Einen Kanal sperren oder entsperren',
  cmd_setup_description: 'Server-Einstellungen konfigurieren',
  cmd_automod_description: 'AutoMod-Einstellungen konfigurieren',
  cmd_verify_description: 'Ein Verifizierungspanel erstellen',
  cmd_selfroles_description: 'Ein Selbstrollen-Panel erstellen',
  mod_no_reason: 'Kein Grund angegeben',
  mod_banned: 'gebannt',
  mod_kicked: 'gekickt',
  mod_timed_out: 'stummgeschaltet',
  mod_warned: 'verwarnt',

  // Music
  cmd_play_description: 'Einen Song abspielen oder zur Warteschlange hinzufügen',
  cmd_stop_description: 'Wiedergabe stoppen und Warteschlange leeren',
  cmd_skip_description: 'Aktuellen Track überspringen',
  cmd_pause_description: 'Wiedergabe pausieren oder fortsetzen',
  cmd_nowplaying_description: 'Aktuell spielenden Track anzeigen',
  cmd_queue_description: 'Aktuelle Warteschlange anzeigen',
  cmd_volume_description: 'Wiedergabelautstärke einstellen',
  cmd_loop_description: 'Loop-Modus einstellen',
  cmd_shuffle_description: 'Warteschlange mischen',
  cmd_remove_description: 'Einen Track aus der Warteschlange entfernen',
  cmd_move_description: 'Einen Track in der Warteschlange verschieben',
  cmd_filter_description: 'Einen Audiofilter anwenden',
  cmd_lyrics_description: 'Songtexte suchen',
  cmd_dj_description: 'DJ-Rolle für Musikbefehle konfigurieren',

  // Utility
  cmd_afk_description: 'AFK-Status setzen',
  cmd_remind_description: 'Eine Erinnerung setzen',
  afk_set: '{user} ist jetzt AFK: {reason}',
  afk_welcome_back: 'Willkommen zurück, {user}! Du warst {duration} AFK.',
  afk_mention: '{user} ist AFK: {reason} ({time})',
  remind_set: 'Erinnerung gesetzt! Ich erinnere dich in {duration}.',
  remind_none: 'Du hast keine aktiven Erinnerungen.',

  // Errors
  error_generic: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  error_no_permission: 'Sie haben keine Berechtigung, diesen Befehl zu verwenden.',
  error_bot_no_permission: 'Ich habe nicht die erforderlichen Berechtigungen.',
  error_cooldown: 'Bitte warten Sie {time}, bevor Sie diesen Befehl erneut verwenden.',
};
