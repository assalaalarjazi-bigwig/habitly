import { AppSettings, Habit, HabitCompletion, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../utils/achievementEvaluator';
import { getTodayString, addDays } from '../utils/dateUtils';

const STORAGE_KEYS = {
  HABITS: 'habitly_habits_v1',
  COMPLETIONS: 'habitly_completions_v1',
  SETTINGS: 'habitly_settings_v1',
  ACHIEVEMENTS: 'habitly_achievements_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar', // Arabic is the default as required in spec section 15
  appearance: 'system',
  colorTheme: 'default',
  notificationsEnabled: true,
  soundEnabled: true,
  userName: 'صديق habitly',
  hasOnboarded: false,
};

export const SAMPLE_HABITS: Habit[] = [
  {
    id: 'habit_read',
    name: 'قراءة كتاب',
    icon: 'book',
    color: '#10b981', // Emerald
    targetPerWeek: 5,
    reminderEnabled: true,
    reminderTime: '20:00',
    createdAt: new Date().toISOString(),
    category: 'learning',
  },
  {
    id: 'habit_water',
    name: 'شرب 2 لتر ماء',
    icon: 'droplet',
    color: '#0284c7', // Sky
    targetPerWeek: 7,
    reminderEnabled: true,
    reminderTime: '10:00',
    createdAt: new Date().toISOString(),
    category: 'health',
  },
  {
    id: 'habit_exercise',
    name: 'تمارين رياضية خفيفة',
    icon: 'dumbbell',
    color: '#f59e0b', // Amber
    targetPerWeek: 4,
    reminderEnabled: true,
    reminderTime: '18:00',
    createdAt: new Date().toISOString(),
    category: 'fitness',
  },
  {
    id: 'habit_sleep',
    name: 'نوم مبكر قبل 11 مساءً',
    icon: 'moon',
    color: '#8b5cf6', // Purple
    targetPerWeek: 6,
    reminderEnabled: true,
    reminderTime: '22:30',
    createdAt: new Date().toISOString(),
    category: 'wellness',
  },
];

export function getHabitDisplayName(habit: Habit, lang: 'ar' | 'en'): string {
  if (habit.id === 'habit_read') return lang === 'ar' ? 'قراءة كتاب' : 'Read a book';
  if (habit.id === 'habit_water') return lang === 'ar' ? 'شرب 2 لتر ماء' : 'Drink 2L water';
  if (habit.id === 'habit_exercise') return lang === 'ar' ? 'تمارين رياضية خفيفة' : 'Light workout';
  if (habit.id === 'habit_sleep') return lang === 'ar' ? 'نوم مبكر قبل 11 مساءً' : 'Sleep before 11 PM';
  return habit.name;
}

export const storageService = {
  // --- Habits ---
  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load habits from local storage:', e);
      return [];
    }
  },

  saveHabits(habits: Habit[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to local storage:', e);
    }
  },

  addHabit(habit: Habit): Habit[] {
    const list = this.getHabits();
    const updated = [habit, ...list];
    this.saveHabits(updated);
    return updated;
  },

  updateHabit(habit: Habit): Habit[] {
    const list = this.getHabits();
    const updated = list.map((h) => (h.id === habit.id ? habit : h));
    this.saveHabits(updated);
    return updated;
  },

  deleteHabit(id: string): { habits: Habit[]; completions: HabitCompletion[] } {
    const habits = this.getHabits().filter((h) => h.id !== id);
    this.saveHabits(habits);

    // Also remove completions for deleted habit
    const completions = this.getCompletions().filter((c) => c.habitId !== id);
    this.saveCompletions(completions);

    return { habits, completions };
  },

  // --- Completions ---
  getCompletions(): HabitCompletion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load completions:', e);
      return [];
    }
  },

  saveCompletions(completions: HabitCompletion[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
    } catch (e) {
      console.error('Failed to save completions:', e);
    }
  },

  toggleCompletion(habitId: string, date: string): { completions: HabitCompletion[]; completed: boolean } {
    const completions = this.getCompletions();
    const index = completions.findIndex((c) => c.habitId === habitId && c.date === date);

    if (index >= 0) {
      // Undo completion
      const updated = completions.filter((_, i) => i !== index);
      this.saveCompletions(updated);
      return { completions: updated, completed: false };
    } else {
      // Mark as completed
      const newCompletion: HabitCompletion = {
        id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        habitId,
        date,
        completedAt: new Date().toISOString(),
      };
      const updated = [...completions, newCompletion];
      this.saveCompletions(updated);
      return { completions: updated, completed: true };
    }
  },

  // --- Settings ---
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      console.error('Failed to load settings:', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  // --- Achievements ---
  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!data) return INITIAL_ACHIEVEMENTS;
      const parsed: Achievement[] = JSON.parse(data);
      // Merge with initial in case new achievements were added to app
      const existingMap = new Map(parsed.map((a) => [a.id, a]));
      return INITIAL_ACHIEVEMENTS.map((initial) => existingMap.get(initial.id) || initial);
    } catch (e) {
      console.error('Failed to load achievements:', e);
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save achievements:', e);
    }
  },

  // --- Sample Data Seeder ---
  loadSampleData(): { habits: Habit[]; completions: HabitCompletion[] } {
    const today = getTodayString();
    const sampleCompletions: HabitCompletion[] = [];

    // Seed recent 4 days of history so streaks & statistics are immediately visible and satisfying
    SAMPLE_HABITS.forEach((h, habitIdx) => {
      // Habit 0 has 4-day streak, habit 1 has 3-day streak, habit 2 has 2-day streak
      const daysToComplete = habitIdx === 0 ? 4 : habitIdx === 1 ? 3 : 2;
      for (let i = 0; i < daysToComplete; i++) {
        const d = addDays(today, -i);
        sampleCompletions.push({
          id: `comp_sample_${h.id}_${d}`,
          habitId: h.id,
          date: d,
          completedAt: new Date().toISOString(),
        });
      }
    });

    this.saveHabits(SAMPLE_HABITS);
    this.saveCompletions(sampleCompletions);
    return { habits: SAMPLE_HABITS, completions: sampleCompletions };
  },

  // --- Reset All Data ---
  resetAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HABITS);
      localStorage.removeItem(STORAGE_KEYS.COMPLETIONS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      // Keep language & appearance preference or reset settings with default
      const curr = this.getSettings();
      this.saveSettings({
        ...DEFAULT_SETTINGS,
        language: curr.language,
        appearance: curr.appearance,
        colorTheme: curr.colorTheme,
        hasOnboarded: true,
      });
    } catch (e) {
      console.error('Failed to reset data:', e);
    }
  },
};
