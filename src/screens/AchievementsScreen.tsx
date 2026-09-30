import React, { useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { Achievement } from '../types';
import { AchievementCard } from '../components/AchievementCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { ProgressBar } from '../components/ProgressBar';

interface AchievementsScreenProps {
  achievements: Achievement[];
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements }) => {
  const { t } = useLanguage();
  const { palette } = useTheme();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const overallUnlockedPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const filtered = achievements.filter((a) => {
    if (activeFilter === 'unlocked') return a.unlocked;
    if (activeFilter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Title & Overall Banner */}
      <div className="pt-1">
        <h1 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          {t('achievementsTitle')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          {t('achievementsUnlockedCount', { unlocked: unlockedCount, total: totalCount })}
        </p>
      </div>

      {/* Hero Achievement Score Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl shadow-xs shrink-0">
            <Trophy size={28} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {unlockedCount} / {totalCount}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ({overallUnlockedPercent}%)
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {unlockedCount === totalCount
                ? t('allAchievementsUnlockedMsg')
                : t('keepGoingAchievementsMsg')}
            </p>
          </div>
        </div>

        <ProgressBar progress={overallUnlockedPercent} height="sm" color="#f59e0b" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          {t('achFilterAll')} ({totalCount})
        </button>
        <button
          onClick={() => setActiveFilter('unlocked')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'unlocked'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          {t('achFilterUnlocked')} ({unlockedCount})
        </button>
        <button
          onClick={() => setActiveFilter('locked')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'locked'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          {t('achFilterLocked')} ({totalCount - unlockedCount})
        </button>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {filtered.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
};
