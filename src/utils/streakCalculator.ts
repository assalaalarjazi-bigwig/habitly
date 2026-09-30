import { HabitCompletion, StreakStats } from '../types';
import { getTodayString, getYesterdayString, addDays, getCurrentWeekDates } from './dateUtils';

/**
 * Calculates current streak, best streak, and completion statistics for a habit.
 * Fully deterministic, date-safe, handles timezone shifts and gaps correctly.
 */
export function calculateHabitStreak(
  habitId: string,
  completions: HabitCompletion[]
): StreakStats {
  const habitCompletions = completions.filter((c) => c.habitId === habitId);
  const totalCompletions = habitCompletions.length;

  if (totalCompletions === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      completedToday: false,
      completedYesterday: false,
      weeklyCompletions: 0,
    };
  }

  // Extract unique sorted date strings (ascending YYYY-MM-DD)
  const uniqueDates = Array.from(new Set(habitCompletions.map((c) => c.date))).sort();
  const dateSet = new Set(uniqueDates);

  const today = getTodayString();
  const yesterday = getYesterdayString();

  const completedToday = dateSet.has(today);
  const completedYesterday = dateSet.has(yesterday);

  // 1. Current Streak calculation:
  // If completed today: count backward starting from today
  // If not completed today, but completed yesterday: count backward starting from yesterday
  // If neither today nor yesterday: streak is broken (0)
  let currentStreak = 0;
  let checkDate = completedToday ? today : completedYesterday ? yesterday : null;

  if (checkDate) {
    while (dateSet.has(checkDate)) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  }

  // 2. Best Streak calculation:
  // Walk through the sorted unique dates and calculate maximum contiguous run
  let bestStreak = 0;
  let currentRun = 0;
  let previousDate: string | null = null;

  for (const date of uniqueDates) {
    if (!previousDate) {
      currentRun = 1;
    } else {
      const expectedNext = addDays(previousDate, 1);
      if (date === expectedNext) {
        currentRun++;
      } else {
        currentRun = 1;
      }
    }
    if (currentRun > bestStreak) {
      bestStreak = currentRun;
    }
    previousDate = date;
  }

  // Current streak can be the best streak if it exceeded past best
  bestStreak = Math.max(bestStreak, currentStreak);

  // 3. Weekly completions for current week
  const currentWeek = getCurrentWeekDates(new Date());
  const weeklyCompletions = currentWeek.filter((d) => dateSet.has(d)).length;

  return {
    currentStreak,
    bestStreak,
    totalCompletions,
    completedToday,
    completedYesterday,
    weeklyCompletions,
  };
}

/**
 * Calculates overall streak & statistics across all habits for a specific date or overall
 */
export function calculateOverallStats(
  habitsCount: number,
  completions: HabitCompletion[]
): {
  totalCompletions: number;
  overallCurrentStreak: number;
  overallBestStreak: number;
  activeDaysCount: number;
} {
  const totalCompletions = completions.length;
  if (totalCompletions === 0) {
    return {
      totalCompletions: 0,
      overallCurrentStreak: 0,
      overallBestStreak: 0,
      activeDaysCount: 0,
    };
  }

  // Dates with at least one completion
  const activeDates = Array.from(new Set(completions.map((c) => c.date))).sort();
  const dateSet = new Set(activeDates);

  const today = getTodayString();
  const yesterday = getYesterdayString();

  const completedToday = dateSet.has(today);
  const completedYesterday = dateSet.has(yesterday);

  let overallCurrentStreak = 0;
  let checkDate = completedToday ? today : completedYesterday ? yesterday : null;

  if (checkDate) {
    while (dateSet.has(checkDate)) {
      overallCurrentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  }

  let overallBestStreak = 0;
  let currentRun = 0;
  let prevDate: string | null = null;

  for (const date of activeDates) {
    if (!prevDate) {
      currentRun = 1;
    } else {
      if (date === addDays(prevDate, 1)) {
        currentRun++;
      } else {
        currentRun = 1;
      }
    }
    if (currentRun > overallBestStreak) {
      overallBestStreak = currentRun;
    }
    prevDate = date;
  }

  overallBestStreak = Math.max(overallBestStreak, overallCurrentStreak);

  return {
    totalCompletions,
    overallCurrentStreak,
    overallBestStreak,
    activeDaysCount: activeDates.length,
  };
}
