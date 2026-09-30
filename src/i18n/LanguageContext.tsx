import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { translations, TranslationKey } from './translations';
import { storageService } from '../storage/storageService';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    return storageService.getSettings().language || 'ar'; // Default Arabic as specified
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    // Sync document root dir and lang
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.body.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    const settings = storageService.getSettings();
    storageService.saveSettings({ ...settings, language: lang });
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.ar;
    let text = (dict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
