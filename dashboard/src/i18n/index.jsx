import { useState, useCallback } from 'react';
import { I18nContext } from './i18nContext.js';
import en from './en.js';
import de from './de.js';

const locales = { en, de };

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('astra-lang');
    if (saved && locales[saved]) return saved;
    const browser = navigator.language?.slice(0, 2);
    return locales[browser] ? browser : 'en';
  });

  const switchLang = useCallback((newLang) => {
    if (locales[newLang]) {
      setLang(newLang);
      localStorage.setItem('astra-lang', newLang);
    }
  }, []);

  const t = useCallback((key, params = {}) => {
    let str = locales[lang]?.[key] || locales.en?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, v);
    }
    return str;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ t, lang, switchLang, locales: Object.keys(locales) }}>
      {children}
    </I18nContext.Provider>
  );
}
