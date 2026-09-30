import React from 'react';
import { Check, Bell, ChevronRight, ChevronLeft } from 'lucide-react';
import { Habit, StreakStats } from '../types';
import { HabitIcon } from './HabitIcon';
import { StreakBadge } from './StreakBadge';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDisplayTime } from '../utils/dateUtils';
import { getHabitDisplayName } from '../storage/storageService';

interface HabitCardProps {
  habit: Habit;
  stats: StreakStats;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  stats,
  onToggleComplete,
  onEdit,
}) => {
  const { t, isRTL, language } = useLanguage();
  const isCompleted = stats.completedToday;

  return (
    <div
      className={`group relative bg-white dark:bg-stone-900 border rounded-2xl p-4 transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'border-stone-200/90 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-900/40'
          : 'border-stone-200/70 dark:border-stone-800 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* Habit Completion Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(habit);
          }}
          aria-label={isCompleted ? t('undoComplete') : t('markComplete')}
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform active:scale-90 cursor-pointer ${
            isCompleted
              ? 'shadow-sm text-white scale-100'
              : 'border-2 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-stone-50 dark:bg-stone-800/60'
          }`}
          style={
            isCompleted
              ? { backgroundColor: habit.color || '#10b981' }
              : undefined
          }
        >
          {isCompleted ? (
            <Check size={22} strokeWidth={3} className="animate-in zoom-in-50 duration-200" />
          ) : (
            <div
              className="w-3.5 h-3.5 rounded-full opacity-30 transition-opacity group-hover:opacity-70"
              style={{ backgroundColor: habit.color || '#10b981' }}
            />
          )}
        </button>

        {/* Habit Content (click to edit) */}
        <div
          onClick={() => onEdit(habit)}
          className="flex-1 min-w-0 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${habit.color}18`,
                color: habit.color,
              }}
            >
              <HabitIcon name={habit.icon} size={14} />
            </div>

            <h3
              className={`font-semibold text-stone-900 dark:text-stone-100 text-base leading-snug truncate transition-opacity ${
                isCompleted ? 'line-through opacity-70' : ''
              }`}
            >
              {getHabitDisplayName(habit, language)}
            </h3>
          </div>

          {/* Subtitle row: Streak badge + Weekly progress + Reminder */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
            {stats.currentStreak > 0 && (
              <StreakBadge count={stats.currentStreak} size="sm" />
            )}

            {/* Weekly Target pill */}
            {habit.targetPerWeek > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                {stats.weeklyCompletions}/{habit.targetPerWeek} {t('daysCount', { count: '' }).trim()}
              </span>
            )}

            {/* Reminder Badge if enabled */}
            {habit.reminderEnabled && habit.reminderTime && (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500">
                <Bell size={11} />
                {formatDisplayTime(habit.reminderTime, language)}
              </span>
            )}
          </div>
        </div>

        {/* Right arrow to indicate tap to edit */}
        <button
          onClick={() => onEdit(habit)}
          className="p-1.5 text-stone-300 hover:text-stone-500 dark:text-stone-700 dark:hover:text-stone-400 rounded-lg transition-colors cursor-pointer"
        >
          {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
};
