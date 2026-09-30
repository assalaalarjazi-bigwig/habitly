import React from 'react';
import { Habit, StreakStats } from '../types';
import { HabitIcon } from './HabitIcon';
import { ProgressBar } from './ProgressBar';
import { useLanguage } from '../i18n/LanguageContext';
import { Target, CheckCircle2 } from 'lucide-react';
import { getHabitDisplayName } from '../storage/storageService';

interface WeeklyGoalCardProps {
  habit: Habit;
  stats: StreakStats;
  onEditHabit?: (habit: Habit) => void;
}

export const WeeklyGoalCard: React.FC<WeeklyGoalCardProps> = ({
  habit,
  stats,
  onEditHabit,
}) => {
  const { t, language } = useLanguage();
  const target = habit.targetPerWeek || 7;
  const current = stats.weeklyCompletions;
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const isGoalReached = current >= target;

  return (
    <div
      onClick={() => onEditHabit?.(habit)}
      className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 transition-all hover:shadow-sm cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${habit.color}18`,
              color: habit.color,
            }}
          >
            <HabitIcon name={habit.icon} size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
              {getHabitDisplayName(habit, language)}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Target size={12} />
              <span>{t('daysPerWeek', { days: target })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-right">
          {isGoalReached ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 size={12} />
              100%
            </span>
          ) : (
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {current} / {target} ({percentage}%)
            </span>
          )}
        </div>
      </div>

      <ProgressBar
        progress={percentage}
        color={habit.color}
        height="sm"
      />
    </div>
  );
};
