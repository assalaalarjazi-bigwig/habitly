import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isFrameMode, setIsFrameMode] = useState(false);
  const { isRTL, t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col items-center justify-start text-stone-900 dark:text-stone-100 selection:bg-emerald-500/20">
      {/* Top Floating Device Mode Toggle (subtle, non-intrusive) */}
      <div className="w-full max-w-lg px-4 pt-2 pb-1 flex justify-between items-center text-xs text-stone-400">
        <span className="font-semibold tracking-wider text-[11px] uppercase opacity-75">
          {t('appDeviceHeader')}
        </span>

        <button
          onClick={() => setIsFrameMode(!isFrameMode)}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer text-[11px] shadow-xs"
          title="Toggle Android Device Frame"
        >
          {isFrameMode ? <Monitor size={12} /> : <Smartphone size={12} />}
          <span>{isFrameMode ? t('fullView') : t('phoneFrame')}</span>
        </button>
      </div>

      {isFrameMode ? (
        <div className="my-3 w-full max-w-[420px] bg-stone-900 p-3 rounded-[48px] shadow-2xl border-4 border-stone-800 ring-1 ring-stone-700/50">
          {/* Android Camera Punch Hole / Speaker */}
          <div className="w-20 h-4 bg-stone-950 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-800 ring-1 ring-stone-700" />
          </div>

          {/* Screen area */}
          <div className="w-full bg-stone-50 dark:bg-stone-950 rounded-[38px] overflow-hidden min-h-[780px] max-h-[820px] overflow-y-auto relative shadow-inner">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
