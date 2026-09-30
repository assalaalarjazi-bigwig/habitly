import React from 'react';
import { Achievement } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { ProgressBar } from './ProgressBar';
import { Lock, Check } from 'lucide-react';
import { TranslationKey } from '../i18n/translations';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { t } = useLanguage();
  const title = t(achievement.titleKey as TranslationKey);
  const description = t(achievement.descKey as TranslationKey);
  const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.maxProgress) * 100));

  return (
    <div
      className={`relative rounded-2xl p-4 border transition-all duration-200 ${
        achievement.unlocked
          ? 'bg-white dark:bg-stone-900 border-amber-200/80 dark:border-amber-900/50 shadow-sm'
          : 'bg-stone-50/70 dark:bg-stone-900/30 border-stone-200/60 dark:border-stone-800/60 opacity-80'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Achievement Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform ${
            achievement.unlocked
              ? 'bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 shadow-xs'
              : 'bg-stone-200/60 dark:bg-stone-800 grayscale opacity-60'
          }`}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4
              className={`font-bold text-sm truncate ${
                achievement.unlocked
                  ? 'text-stone-900 dark:text-stone-100'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {title}
            </h4>

            {achievement.unlocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                <Check size={11} strokeWidth={3} />
                {t('unlockedBadge')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                <Lock size={10} />
                {achievement.progress}/{achievement.maxProgress}
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 mb-2.5 leading-relaxed">
            {description}
          </p>

          {!achievement.unlocked && (
            <ProgressBar
              progress={progressPercent}
              height="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};
