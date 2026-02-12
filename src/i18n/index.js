import en from './en.js';
import de from './de.js';
import { log } from '../utils/logger.js';

const locales = { en, de };
const defaultLocale = 'en';

/**
 * Get a translated string by key.
 * Supports placeholder replacement: t('key', { name: 'Astra' }) => 'Hello Astra'
 * Placeholders in translation strings use {key} format.
 */
export function t(key, params = {}, locale = defaultLocale) {
  const lang = locales[locale] || locales[defaultLocale];
  let text = lang[key] || locales[defaultLocale][key] || key;

  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
  }

  return text;
}

/**
 * Get all available locale codes.
 */
export function getLocales() {
  return Object.keys(locales);
}

/**
 * Check if a locale is supported.
 */
export function isLocaleSupported(locale) {
  return locale in locales;
}

log.i18n(`Loaded ${Object.keys(locales).length} locale(s): ${Object.keys(locales).join(', ')}`);

export default { t, getLocales, isLocaleSupported };
