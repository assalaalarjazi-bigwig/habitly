import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Smartphone,
  Globe,
  Bell,
  Volume2,
  Trash2,
  Sparkles,
  Info,
  Check,
  Save,
} from 'lucide-react';
import { AppearanceMode, ColorTheme, AppSettings } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { THEME_PALETTES } from '../theme/themeConfig';
import { notificationService } from '../services/notificationService';
import { soundService } from '../services/soundService';
import { ConfirmModal } from '../components/ConfirmModal';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetAllData: () => void;
  onLoadSampleData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onLoadSampleData,
}) => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { appearance, setAppearance, colorTheme, setColorTheme, palette } = useTheme();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Local draft state for quick immediate feedback
  const [pendingAppearance, setPendingAppearance] = useState<AppearanceMode>(appearance);
  const [pendingTheme, setPendingTheme] = useState<ColorTheme>(colorTheme);
  const [pendingSound, setPendingSound] = useState<boolean>(settings.soundEnabled);
  const [pendingNotifications, setPendingNotifications] = useState<boolean>(settings.notificationsEnabled);

  // Synchronize when settings change from outside
  React.useEffect(() => {
    setPendingAppearance(appearance);
    setPendingTheme(colorTheme);
    setPendingSound(settings.soundEnabled);
    setPendingNotifications(settings.notificationsEnabled);
  }, [appearance, colorTheme, settings.soundEnabled, settings.notificationsEnabled]);

  // Test Notification
  const handleTestNotification = async () => {
    soundService.playTap();
    await notificationService.requestPermission();
    notificationService.triggerNotification(
      '🌟 Habitly Test Notification',
      language === 'ar'
        ? 'تذكير تجريبي ناجح! حافظ على التزامك بعاداتك اليومية.'
        : 'Sample reminder successful! Keep up your daily habits.',
      undefined,
      '🎯'
    );
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  const handleSelectAppearance = (mode: AppearanceMode) => {
    setPendingAppearance(mode);
    setAppearance(mode); // Immediate visual feedback
    soundService.playTap();
  };

  const handleSelectColorTheme = (themeId: ColorTheme) => {
    setPendingTheme(themeId);
    setColorTheme(themeId); // Immediate visual feedback
    soundService.playTap();
  };

  const handleSaveAllSettings = () => {
    onUpdateSettings({
      appearance: pendingAppearance,
      colorTheme: pendingTheme,
      soundEnabled: pendingSound,
      notificationsEnabled: pendingNotifications,
    });
    soundService.setEnabled(pendingSound);
    soundService.playComplete();

    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3500);
  };

  const appearanceOptions: { mode: AppearanceMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: t('themeLight'), icon: <Sun size={16} /> },
    { mode: 'dark', label: t('themeDark'), icon: <Moon size={16} /> },
    { mode: 'system', label: t('themeSystem'), icon: <Smartphone size={16} /> },
  ];

  const colorPresets: ColorTheme[] = ['default', 'green', 'blue', 'purple', 'pink', 'orange'];

  return (
    <div className="pb-32 pt-2 px-4 max-w-lg mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Title */}
      <div className="pt-1">
        <h1 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
          {t('appTagline')}
        </p>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMessage && (
        <div
          className="p-3.5 rounded-2xl flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300 shadow-sm border"
          style={{
            backgroundColor: palette.primaryBg,
            borderColor: palette.borderAccent,
            color: palette.primary,
          }}
        >
          <Check size={18} strokeWidth={2.5} />
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
            {t('settingsSavedToast')}
          </span>
        </div>
      )}

      {/* 1. Appearance (Light / Dark / System) */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {t('appearanceHeader')}
          </h3>
          <span className="text-[11px] font-semibold text-stone-400">
            {appearanceOptions.find((o) => o.mode === pendingAppearance)?.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {appearanceOptions.map((opt) => {
            const isSelected = pendingAppearance === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => handleSelectAppearance(opt.mode)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 font-bold shadow-xs'
                    : 'border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: palette.primaryBg,
                        color: palette.primary,
                        borderColor: palette.borderAccent,
                        boxShadow: `0 0 0 2px ${palette.primary}`,
                      }
                    : undefined
                }
              >
                {opt.icon}
                <span className="text-xs">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Theme Presets */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {t('colorThemeHeader')}
          </h3>
          <span className="text-[11px] font-bold" style={{ color: palette.primary }}>
            {isRTL ? palette.nameAr : palette.name}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {colorPresets.map((themeId) => {
            const preset = THEME_PALETTES[themeId];
            const isSelected = pendingTheme === themeId;

            return (
              <button
                key={themeId}
                onClick={() => handleSelectColorTheme(themeId)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-xs font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50/70 dark:hover:bg-stone-800/50'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: preset.primaryBg,
                        borderColor: preset.borderAccent,
                        boxShadow: `0 0 0 2px ${preset.primary}`,
                      }
                    : undefined
                }
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-transform transform hover:scale-105"
                  style={{ backgroundColor: preset.primary }}
                >
                  {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span
                  className={`text-[11px] truncate w-full text-center ${
                    isSelected ? 'font-bold' : 'text-stone-700 dark:text-stone-300'
                  }`}
                  style={isSelected ? { color: preset.primary } : undefined}
                >
                  {isRTL ? preset.nameAr : preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Language Switcher (Arabic RTL / English LTR) */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-stone-400" />
          <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {t('languageHeader')}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              setLanguage('ar');
              soundService.playTap();
            }}
            className={`py-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
              language === 'ar'
                ? 'shadow-xs'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
            style={
              language === 'ar'
                ? {
                    backgroundColor: palette.primaryBg,
                    color: palette.primary,
                    borderColor: palette.borderAccent,
                    boxShadow: `0 0 0 2px ${palette.primary}`,
                  }
                : undefined
            }
          >
            <span>{t('langArabic')}</span>
            {language === 'ar' && <Check size={16} strokeWidth={2.5} />}
          </button>

          <button
            onClick={() => {
              setLanguage('en');
              soundService.playTap();
            }}
            className={`py-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
              language === 'en'
                ? 'shadow-xs'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
            style={
              language === 'en'
                ? {
                    backgroundColor: palette.primaryBg,
                    color: palette.primary,
                    borderColor: palette.borderAccent,
                    boxShadow: `0 0 0 2px ${palette.primary}`,
                  }
                : undefined
            }
          >
            <span>{t('langEnglish')}</span>
            {language === 'en' && <Check size={16} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* 4. Notifications & Audio */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          {t('notificationsHeader')}
        </h3>

        {/* Local Notifications toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: palette.primaryBg, color: palette.primary }}
            >
              <Bell size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {t('enableNotifications')}
              </p>
              <p className="text-[11px] text-stone-400">
                {t('notifications_unsupported')}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pendingNotifications}
              onChange={(e) => {
                setPendingNotifications(e.target.checked);
                soundService.playTap();
              }}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600"
              style={pendingNotifications ? { backgroundColor: palette.primary } : undefined}
            ></div>
          </label>
        </div>

        {/* Sound toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: palette.primaryBg, color: palette.primary }}
            >
              <Volume2 size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {t('enableSounds')}
              </p>
              <p className="text-[11px] text-stone-400">
                {t('soundEffectsDesc')}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pendingSound}
              onChange={(e) => {
                setPendingSound(e.target.checked);
                soundService.setEnabled(e.target.checked);
                if (e.target.checked) soundService.playTap();
              }}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600"
              style={pendingSound ? { backgroundColor: palette.primary } : undefined}
            ></div>
          </label>
        </div>

        {/* Test Notification Button */}
        <div className="pt-2">
          <button
            onClick={handleTestNotification}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>{testNotificationSent ? t('testNotificationSent') : t('testNotificationBtn')}</span>
          </button>
        </div>
      </div>

      {/* Save Settings Explicit Button */}
      <button
        onClick={handleSaveAllSettings}
        className="w-full py-3.5 px-5 rounded-2xl text-white text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        style={{
          backgroundColor: palette.primary,
        }}
      >
        <Save size={18} />
        <span>{t('saveSettingsBtn')}</span>
      </button>

      {/* 5. Data Management */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          {t('dataHeader')}
        </h3>

        <div className="space-y-2">
          <button
            onClick={onLoadSampleData}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={14} style={{ color: palette.primary }} />
            <span>{t('loadSampleDataBtn')}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>{t('resetAllDataBtn')}</span>
          </button>
        </div>
      </div>

      {/* 6. About App */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Info size={16} className="text-stone-400" />
          <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {t('aboutHeader')}
          </h3>
        </div>

        <div className="flex justify-between items-center text-xs py-1 text-stone-600 dark:text-stone-300">
          <span>{t('appName')}</span>
          <span className="font-bold text-stone-900 dark:text-stone-100">v1.0.0</span>
        </div>
        <div className="flex justify-between items-center text-xs py-1 text-stone-600 dark:text-stone-300">
          <span>{t('offlineStatusLabel')}</span>
          <span
            className="font-bold"
            style={{ color: palette.primary }}
          >
            {t('offlineStatusValue')}
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title={t('confirmResetTitle')}
        message={t('confirmResetMsg')}
        confirmText={t('resetAllDataBtn')}
        cancelText={t('cancelBtn')}
        isDestructive={true}
        onConfirm={() => {
          onResetAllData();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
