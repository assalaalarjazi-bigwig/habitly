import React from 'react';
import { Habit, HabitCompletion, StreakStats } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { calculateHabitStreak, calculateOverallStats } from '../utils/streakCalculator';
import { getCurrentWeekDates, parseLocalDate } from '../utils/dateUtils';
import { HabitIcon } from '../components/HabitIcon';
import { EmptyState } from '../components/EmptyState';
import { Award, Flame, CheckCircle, TrendingUp, BarChart2 } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { getHabitDisplayName } from '../storage/storageService';

interface StatisticsScreenProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  habits,
  completions,
  onAddHabit,
  onEditHabit,
}) => {
  const { t, isRTL, language } = useLanguage();
  const { palette } = useTheme();

  const totalCompletionsCount = completions.length;
  const overall = calculateOverallStats(habits.length, completions);

  // Per habit stats
  const habitStatsMap = new Map<string, StreakStats>();
  habits.forEach((h) => {
    habitStatsMap.set(h.id, calculateHabitStreak(h.id, completions));
  });

  // Most consistent habit (highest total completions and best streak)
  let mostConsistentHabit: Habit | null = null;
  let maxScore = -1;
  habits.forEach((h) => {
    const stats = habitStatsMap.get(h.id);
    if (stats) {
      const score = stats.totalCompletions * 2 + stats.bestStreak;
      if (score > maxScore && stats.totalCompletions > 0) {
        maxScore = score;
        mostConsistentHabit = h;
      }
    }
  });

  const topConsistentHabit = mostConsistentHabit as Habit | null;

  // Weekly bar data (current week days)
  const weekDaysDates = getCurrentWeekDates(new Date(), isRTL);
  const weekDayLabels = isRTL
    ? ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weeklyChartData = weekDaysDates.map((dateStr, idx) => {
    const count = completions.filter((c) => c.date === dateStr).length;
    const maxCapacity = Math.max(habits.length, 1);
    const ratio = Math.min(1, count / maxCapacity);
    const dayDate = parseLocalDate(dateStr);
    const dayNumber = dayDate.getDate();

    return {
      dateStr,
      label: weekDayLabels[idx] || '',
      dayNumber,
      count,
      ratio,
    };
  });

  // Overall rate calculation (past 30 days active ratio)
  const totalDaysTarget = habits.length > 0 ? habits.length * 7 : 1;
  const totalThisWeekCompletions = weeklyChartData.reduce((acc, d) => acc + d.count, 0);
  const weeklyRate = Math.min(100, Math.round((totalThisWeekCompletions / totalDaysTarget) * 100));

  if (habits.length === 0) {
    return (
      <div className="pb-28 pt-6 px-4 max-w-lg mx-auto">
        <EmptyState
          icon="📊"
          title={t('noStatsTitle')}
          subtitle={t('noStatsSubtitle')}
          actionText={t('addHabitAction')}
          onAction={onAddHabit}
        />
      </div>
    );
  }

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Title */}
      <div className="pt-1">
        <h1 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          {t('statsTitle')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          {t('statActiveHabits')}: {habits.length}
        </p>
      </div>

      {/* Grid of Key Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Total Completions */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2">
            <CheckCircle size={15} className="text-emerald-500" />
            <span>{t('statTotalCompletions')}</span>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {totalCompletionsCount}
          </p>
          <span className="text-[11px] text-stone-400 font-medium">
            {t('completionsCount', { count: totalCompletionsCount })}
          </span>
        </div>

        {/* Metric 2: Best Streak */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2">
            <Flame size={15} className="text-amber-500" />
            <span>{t('statBestStreak')}</span>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {overall.overallBestStreak}
          </p>
          <span className="text-[11px] text-stone-400 font-medium">
            {t('daysCount', { count: overall.overallBestStreak })}
          </span>
        </div>

        {/* Metric 3: Current Streak */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2">
            <TrendingUp size={15} className="text-sky-500" />
            <span>{t('statCurrentStreak')}</span>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {overall.overallCurrentStreak}
          </p>
          <span className="text-[11px] text-stone-400 font-medium">
            {t('daysCount', { count: overall.overallCurrentStreak })}
          </span>
        </div>

        {/* Metric 4: Weekly Consistency */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2">
            <BarChart2 size={15} className="text-purple-500" />
            <span>{t('statOverallRate')}</span>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {weeklyRate}%
          </p>
          <span className="text-[11px] text-stone-400 font-medium">
            {t('weeklyPerformance')}
          </span>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            {t('weeklyPerformance')}
          </h3>
          <span className="text-xs font-bold text-stone-500">
            {totalThisWeekCompletions} {t('completedHabit')}
          </span>
        </div>

        {/* 7 Vertical Bar Columns */}
        <div className="grid grid-cols-7 gap-2 items-end h-32 pt-2 pb-1">
          {weeklyChartData.map((item) => {
            const barHeightPercent = Math.max(12, Math.round(item.ratio * 100));
            const isFilled = item.count > 0;

            return (
              <div key={item.dateStr} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-stone-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>

                <div className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-xl h-24 flex items-end p-1">
                  <div
                    className="w-full rounded-lg transition-all duration-500"
                    style={{
                      height: `${barHeightPercent}%`,
                      backgroundColor: isFilled ? palette.primary : '#d6d3d140',
                    }}
                  />
                </div>

                <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 mt-2 truncate">
                  {item.label}
                </span>
                <span className="text-[9px] text-stone-400">
                  {item.dayNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Consistent Habit Spotlight Card */}
      {topConsistentHabit ? (
        <div
          onClick={() => onEditHabit(topConsistentHabit)}
          className="bg-stone-50/90 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4.5 cursor-pointer hover:shadow-xs transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
              <Award size={22} />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                {t('statMostConsistent')}
              </span>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                {getHabitDisplayName(topConsistentHabit, language)}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {habitStatsMap.get(topConsistentHabit.id)?.totalCompletions}{' '}
                {t('completionsCount', { count: '' }).trim()} • {t('statBestStreak')}:{' '}
                {habitStatsMap.get(topConsistentHabit.id)?.bestStreak} {t('daysCount', { count: '' }).trim()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-stone-50/60 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-stone-400 font-medium">
            {t('noConsistentHabitYet')}
          </p>
        </div>
      )}

      {/* Individual Habits Performance Breakdown */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
          {t('todayHabits')}
        </h3>

        <div className="space-y-3">
          {habits.map((habit) => {
            const stats = habitStatsMap.get(habit.id);
            if (!stats) return null;
            const weekTarget = habit.targetPerWeek || 7;
            const weekPercent = Math.min(100, Math.round((stats.weeklyCompletions / weekTarget) * 100));

            return (
              <div
                key={habit.id}
                onClick={() => onEditHabit(habit)}
                className="p-3 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-700/50 cursor-pointer hover:bg-stone-100/70 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                    >
                      <HabitIcon name={habit.icon} size={13} />
                    </div>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {getHabitDisplayName(habit, language)}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-stone-500">
                    {stats.weeklyCompletions} / {weekTarget} {t('daysCount', { count: '' }).trim()}
                  </span>
                </div>

                <ProgressBar progress={weekPercent} color={habit.color} height="sm" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
