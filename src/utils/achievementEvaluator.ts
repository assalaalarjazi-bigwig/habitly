import { Achievement, Habit, HabitCompletion } from '../types';
import { calculateHabitStreak } from './streakCalculator';
import { getTodayString } from './dateUtils';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    titleKey: 'ach_first_step_title',
    descKey: 'ach_first_step_desc',
    icon: '🌱',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'starter',
  },
  {
    id: 'streak_3',
    titleKey: 'ach_streak_3_title',
    descKey: 'ach_streak_3_desc',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    category: 'streak',
  },
  {
    id: 'streak_7',
    titleKey: 'ach_streak_7_title',
    descKey: 'ach_streak_7_desc',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    category: 'streak',
  },
  {
    id: 'streak_14',
    titleKey: 'ach_streak_14_title',
    descKey: 'ach_streak_14_desc',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 14,
    category: 'streak',
  },
  {
    id: 'perfect_day',
    titleKey: 'ach_perfect_day_title',
    descKey: 'ach_perfect_day_desc',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'milestone',
  },
  {
    id: 'weekly_goal',
    titleKey: 'ach_weekly_goal_title',
    descKey: 'ach_weekly_goal_desc',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'milestone',
  },
  {
    id: 'completions_30',
    titleKey: 'ach_completions_30_title',
    descKey: 'ach_completions_30_desc',
    icon: '💪',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    category: 'consistency',
  },
  {
    id: 'habit_master_5',
    titleKey: 'ach_habit_master_title',
    descKey: 'ach_habit_master_desc',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'starter',
  },
];

/**
 * Re-evaluates all achievements and returns updated list + newly unlocked achievement if any
 */
export function evaluateAchievements(
  currentAchievements: Achievement[],
  habits: Habit[],
  completions: HabitCompletion[]
): {
  updatedAchievements: Achievement[];
  newlyUnlocked: Achievement[];
} {
  const today = getTodayString();
  const totalCompletions = completions.length;

  // Max streak among all habits
  let maxBestStreak = 0;
  let maxCurrentStreak = 0;
  let anyWeeklyGoalMet = false;

  habits.forEach((habit) => {
    const stats = calculateHabitStreak(habit.id, completions);
    if (stats.bestStreak > maxBestStreak) maxBestStreak = stats.bestStreak;
    if (stats.currentStreak > maxCurrentStreak) maxCurrentStreak = stats.currentStreak;
    if (stats.weeklyCompletions >= habit.targetPerWeek && habit.targetPerWeek > 0) {
      anyWeeklyGoalMet = true;
    }
  });

  const streakForCheck = Math.max(maxBestStreak, maxCurrentStreak);

  // Check if today was a perfect day (all active habits completed)
  const todayCompletions = new Set(
    completions.filter((c) => c.date === today).map((c) => c.habitId)
  );
  const isPerfectDay =
    habits.length > 0 && habits.every((h) => todayCompletions.has(h.id));

  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = currentAchievements.map((ach) => {
    let currentProgress = ach.progress;
    let shouldUnlock = ach.unlocked;

    switch (ach.id) {
      case 'first_step':
        currentProgress = Math.min(1, totalCompletions);
        shouldUnlock = totalCompletions >= 1;
        break;
      case 'streak_3':
        currentProgress = Math.min(3, streakForCheck);
        shouldUnlock = streakForCheck >= 3;
        break;
      case 'streak_7':
        currentProgress = Math.min(7, streakForCheck);
        shouldUnlock = streakForCheck >= 7;
        break;
      case 'streak_14':
        currentProgress = Math.min(14, streakForCheck);
        shouldUnlock = streakForCheck >= 14;
        break;
      case 'completions_30':
        currentProgress = Math.min(30, totalCompletions);
        shouldUnlock = totalCompletions >= 30;
        break;
      case 'perfect_day':
        if (isPerfectDay) {
          currentProgress = 1;
          shouldUnlock = true;
        }
        break;
      case 'weekly_goal':
        if (anyWeeklyGoalMet) {
          currentProgress = 1;
          shouldUnlock = true;
        }
        break;
      case 'habit_master_5':
        currentProgress = Math.min(5, habits.length);
        shouldUnlock = habits.length >= 5;
        break;
      default:
        break;
    }

    if (!ach.unlocked && shouldUnlock) {
      const unlockedItem: Achievement = {
        ...ach,
        unlocked: true,
        progress: ach.maxProgress,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return {
      ...ach,
      progress: Math.max(ach.progress, currentProgress),
      unlocked: shouldUnlock || ach.unlocked,
    };
  });

  return { updatedAchievements, newlyUnlocked };
}
