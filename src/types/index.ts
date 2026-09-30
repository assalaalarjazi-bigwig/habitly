export type Language = 'ar' | 'en';
export type AppearanceMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'default' | 'green' | 'blue' | 'purple' | 'pink' | 'orange';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  targetPerWeek: number; // e.g., 5 or 7 days a week
  reminderEnabled: boolean;
  reminderTime: string; // "HH:MM" 24h format
  createdAt: string;
  category?: string;
  archived?: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD local format
  completedAt: string; // ISO
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completedToday: boolean;
  completedYesterday: boolean;
  weeklyCompletions: number;
}

export interface Achievement {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'starter' | 'streak' | 'consistency' | 'milestone';
}

export interface AppSettings {
  language: Language;
  appearance: AppearanceMode;
  colorTheme: ColorTheme;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  userName: string;
  hasOnboarded: boolean;
}

export type ScreenTab = 'home' | 'calendar' | 'statistics' | 'achievements' | 'settings';
