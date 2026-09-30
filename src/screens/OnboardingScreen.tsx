import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

interface OnboardingScreenProps {
  onFinish: (userName: string, loadSamples: boolean) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { palette } = useTheme();

  const [name, setName] = useState('');
  const [loadSamples, setLoadSamples] = useState(true);

  const handleStart = () => {
    onFinish(name.trim() || (isRTL ? 'صديقي' : 'Friend'), loadSamples);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-7 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-300">
        {/* Language switch top corner */}
        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={() => setLanguage('ar')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              language === 'ar'
                ? 'font-bold bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              language === 'en'
                ? 'font-bold bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            English
          </button>
        </div>

        {/* Icon & Title */}
        <div className="space-y-3">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-xs"
            style={{
              backgroundColor: palette.primaryBg,
              color: palette.primary,
            }}
          >
            <Sparkles size={32} />
          </div>

          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {t('appName')}
          </h1>
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            {t('onboardingTitle')}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed px-2">
            {t('onboardingSubtitle')}
          </p>
        </div>

        {/* User Name input */}
        <div className="text-left rtl:text-right space-y-1.5 pt-2">
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400">
            {t('onboardingNamePrompt')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('onboardingNamePlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Option to load starter habits */}
        <label className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-left rtl:text-right cursor-pointer select-none">
          <input
            type="checkbox"
            checked={loadSamples}
            onChange={(e) => setLoadSamples(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              loadSamples
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
            }`}
          >
            {loadSamples && <Check size={14} strokeWidth={3} />}
          </div>
          <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
            {t('onboardingLoadSampleOption')}
          </span>
        </label>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-4 rounded-xl text-white text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          style={{ backgroundColor: palette.primary }}
        >
          <span>{t('onboardingStartBtn')}</span>
          {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};
