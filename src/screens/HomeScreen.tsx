import React from 'react';
import { Plus, Sparkles, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import { Habit, HabitCompletion, Achievement, StreakStats } from '../types';
import { HabitCard } from '../components/HabitCard';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { getTodayString, formatDisplayDate, getGreeting } from '../utils/dateUtils';
import { calculateHabitStreak } from '../utils/streakCalculator';
import { TranslationKey } from '../i18n/translations';

interface HomeScreenProps {
  habits: Habit[];
  completions: HabitCompletion[];
  achievements: Achievement[];
  userName: string;
  onToggleComplete: (habit: Habit) => void;
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onGoToAchievements: () => void;
  onGoToCalendar: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  habits,
  completions,
  achievements,
  userName,
  onToggleComplete,
  onAddHabit,
  onEditHabit,
  onGoToAchievements,
  onGoToCalendar,
}) => {
  const { t, language } = useLanguage();
  const { palette } = useTheme();
  const today = getTodayString();

  // Compute today's completed habit IDs
  const todayCompletions = new Set(
    completions.filter((c) => c.date === today).map((c) => c.habitId)
  );

  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) => todayCompletions.has(h.id)).length;
  const todayPercent = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  // Recent unlocked achievement
  const recentUnlocked = achievements
    .filter((a) => a.unlocked && a.unlockedAt)
    .sort((a, b) => (b.unlockedAt || '').localeCompare(a.unlockedAt || ''))[0];

  // Weekly goals overview
  const habitsWithWeeklyGoal = habits.filter((h) => h.targetPerWeek > 0);
  const totalWeeklyTarget = habitsWithWeeklyGoal.reduce((acc, h) => acc + h.targetPerWeek, 0);
  const totalWeeklyAchieved = habitsWithWeeklyGoal.reduce((acc, h) => {
    const stats = calculateHabitStreak(h.id, completions);
    return acc + Math.min(stats.weeklyCompletions, h.targetPerWeek);
  }, 0);
  const weeklyPercent = totalWeeklyTarget > 0 ? Math.round((totalWeeklyAchieved / totalWeeklyTarget) * 100) : 0;

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top Greeting & Date Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {getGreeting(language, userName)} ✨
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium flex items-center gap-1.5">
            <CalendarIcon size={12} />
            {formatDisplayDate(today, language)}
          </p>
        </div>

        <button
          onClick={onAddHabit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          style={{ backgroundColor: palette.primary }}
          title={t('createHabitTitle')}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>{t('addHabitAction')}</span>
        </button>
      </div>

      {/* Today's Progress Card */}
      {totalHabits > 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                {t('todayProgress')}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-stone-900 dark:text-stone-100">
                  {todayPercent}%
                </span>
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  ({completedTodayCount} / {totalHabits} {t('completedHabit')})
                </span>
              </div>
            </div>

            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-colors"
              style={{
                backgroundColor: palette.primaryBg,
                color: palette.primary,
              }}
            >
              {todayPercent === 100 ? (
                <CheckCircle2 size={24} className="animate-in zoom-in duration-300" />
              ) : (
                <Sparkles size={22} />
              )}
            </div>
          </div>

          <ProgressBar
            progress={todayPercent}
            color={palette.primary}
            height="md"
          />

          <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 font-medium">
            {todayPercent === 100 ? t('allDoneToday') : t('keepGoing')}
          </p>
        </div>
      )}

      {/* Weekly Goal Progress Strip */}
      {totalWeeklyTarget > 0 && (
        <div
          onClick={onGoToCalendar}
          className="bg-stone-50/90 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-100/80 dark:hover:bg-stone-800/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🎯</span>
            <div>
              <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {t('weeklyGoalProgress')}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {totalWeeklyAchieved} / {totalWeeklyTarget} {t('daysCount', { count: '' }).trim()}
              </p>
            </div>
          </div>

          <div className="w-24">
            <ProgressBar progress={weeklyPercent} height="sm" />
            <span className="block text-[10px] text-right font-bold text-stone-500 mt-1">
              {weeklyPercent}%
            </span>
          </div>
        </div>
      )}

      {/* Recent Highlight Badge (if unlocked) */}
      {recentUnlocked && (
        <div
          onClick={onGoToAchievements}
          className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-lg shrink-0">
              {recentUnlocked.icon}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                {t('recentHighlight')}
              </span>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                {t(recentUnlocked.titleKey as TranslationKey)}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
            &rarr;
          </span>
        </div>
      )}

      {/* Today's Habits List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            {t('todayHabits')} ({totalHabits})
          </h2>
          <span className="text-xs text-stone-400 font-medium">
            {completedTodayCount}/{totalHabits}
          </span>
        </div>

        {habits.length === 0 ? (
          <EmptyState
            icon="🌱"
            title={t('noHabitsTitle')}
            subtitle={t('noHabitsSubtitle')}
            actionText={t('addHabitAction')}
            onAction={onAddHabit}
          />
        ) : (
          <div className="space-y-2.5">
            {habits.map((habit) => {
              const stats: StreakStats = calculateHabitStreak(habit.id, completions);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  stats={stats}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditHabit}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
