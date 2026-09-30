/**
 * Habitly - Beautiful, simple, offline-first habit tracker
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Habit,
  HabitCompletion,
  Achievement,
  AppSettings,
  ScreenTab,
} from './types';
import { storageService, DEFAULT_SETTINGS } from './storage/storageService';
import { notificationService, InAppNotification } from './services/notificationService';
import { soundService } from './services/soundService';
import { evaluateAchievements } from './utils/achievementEvaluator';
import { getTodayString } from './utils/dateUtils';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { BottomNavigation } from './components/BottomNavigation';
import { HabitModal } from './components/HabitModal';
import { NotificationToast } from './components/NotificationToast';
import { DeviceFrame } from './components/DeviceFrame';
import { HomeScreen } from './screens/HomeScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { SplashScreen } from './components/SplashScreen';

const MainApp: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { palette } = useTheme();

  // Initial luxury splash screen state
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Core App State (All local & offline)
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [habits, setHabits] = useState<Habit[]>(() => storageService.getHabits());
  const [completions, setCompletions] = useState<HabitCompletion[]>(() => storageService.getCompletions());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());

  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeNotifications, setActiveNotifications] = useState<InAppNotification[]>([]);

  // Initialize sounds and notifications sync
  useEffect(() => {
    soundService.setEnabled(settings.soundEnabled);
    notificationService.syncHabits(habits);

    const unsubscribe = notificationService.subscribe((item) => {
      setActiveNotifications((prev) => [item, ...prev]);
    });

    return () => unsubscribe();
  }, [settings.soundEnabled, habits]);

  // Dismiss notification toast
  const handleDismissNotification = useCallback((id: string) => {
    setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Check achievements after state change
  const runAchievementCheck = useCallback(
    (currentHabits: Habit[], currentCompletions: HabitCompletion[]) => {
      const { updatedAchievements, newlyUnlocked } = evaluateAchievements(
        achievements,
        currentHabits,
        currentCompletions
      );

      if (newlyUnlocked.length > 0) {
        setAchievements(updatedAchievements);
        storageService.saveAchievements(updatedAchievements);

        newlyUnlocked.forEach((ach) => {
          soundService.playAchievement();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
          notificationService.triggerNotification(
            `🏆 وسام جديد مفتوح: ${t(ach.titleKey as any)}!`,
            t(ach.descKey as any),
            undefined,
            ach.icon
          );
        });
      }
    },
    [achievements, t]
  );

  // Toggle habit completion (for today)
  const handleToggleComplete = (habit: Habit) => {
    const today = getTodayString();
    const { completions: updated, completed } = storageService.toggleCompletion(habit.id, today);
    setCompletions(updated);

    if (completed) {
      soundService.playComplete();
      // Check if all habits completed today
      const todayDoneCount = updated.filter((c) => c.date === today).length;
      if (todayDoneCount >= habits.length && habits.length > 0) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } else {
      soundService.playUndo();
    }

    runAchievementCheck(habits, updated);
  };

  // Toggle habit completion for a specific calendar date
  const handleToggleCompleteForDate = (habit: Habit, dateStr: string) => {
    const { completions: updated, completed } = storageService.toggleCompletion(habit.id, dateStr);
    setCompletions(updated);

    if (completed) {
      soundService.playComplete();
    } else {
      soundService.playUndo();
    }

    runAchievementCheck(habits, updated);
  };

  // Habit Creation & Editing
  const handleOpenAddHabit = () => {
    soundService.playTap();
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleOpenEditHabit = (habit: Habit) => {
    soundService.playTap();
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = (data: Partial<Habit>) => {
    if (editingHabit) {
      // Update
      const updatedItem: Habit = {
        ...editingHabit,
        ...data,
      } as Habit;
      const updatedList = storageService.updateHabit(updatedItem);
      setHabits(updatedList);
      notificationService.scheduleHabitReminder(updatedItem);
    } else {
      // Create new
      const newHabit: Habit = {
        id: `h_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: data.name || 'Habit',
        icon: data.icon || 'book',
        color: data.color || palette.primary,
        targetPerWeek: data.targetPerWeek || 7,
        reminderEnabled: Boolean(data.reminderEnabled),
        reminderTime: data.reminderTime || '',
        createdAt: new Date().toISOString(),
      };
      const updatedList = storageService.addHabit(newHabit);
      setHabits(updatedList);
      notificationService.scheduleHabitReminder(newHabit);
      runAchievementCheck(updatedList, completions);
    }
  };

  const handleDeleteHabit = (id: string) => {
    const { habits: updatedHabits, completions: updatedCompletions } = storageService.deleteHabit(id);
    setHabits(updatedHabits);
    setCompletions(updatedCompletions);
    notificationService.cancelHabitReminder(id);
    setIsHabitModalOpen(false);
    runAchievementCheck(updatedHabits, updatedCompletions);
  };

  // Settings & Data Actions
  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const handleLoadSampleData = () => {
    const result = storageService.loadSampleData();
    setHabits(result.habits);
    setCompletions(result.completions);
    runAchievementCheck(result.habits, result.completions);
  };

  const handleResetAllData = () => {
    storageService.resetAllData();
    setHabits([]);
    setCompletions([]);
    setAchievements(storageService.getAchievements());
    setCurrentTab('home');
  };

  // Onboarding completion
  const handleFinishOnboarding = (userName: string, loadSamples: boolean) => {
    const updatedSettings: AppSettings = {
      ...settings,
      userName,
      hasOnboarded: true,
    };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);

    if (loadSamples) {
      handleLoadSampleData();
    }
  };

  // Initial Splash Loading Screen
  if (isInitialLoading) {
    return <SplashScreen onFinish={() => setIsInitialLoading(false)} minDuration={850} />;
  }

  // Render Onboarding if first launch
  if (!settings.hasOnboarded) {
    return <OnboardingScreen onFinish={handleFinishOnboarding} />;
  }

  return (
    <DeviceFrame>
      <div className="flex-1 w-full flex flex-col justify-start relative select-none">
        {/* Toast notifications */}
        <NotificationToast
          notifications={activeNotifications}
          onDismiss={handleDismissNotification}
        />

        {/* Tab Screens */}
        <main className="flex-1 w-full">
          {currentTab === 'home' && (
            <HomeScreen
              habits={habits}
              completions={completions}
              achievements={achievements}
              userName={settings.userName}
              onToggleComplete={handleToggleComplete}
              onAddHabit={handleOpenAddHabit}
              onEditHabit={handleOpenEditHabit}
              onGoToAchievements={() => setCurrentTab('achievements')}
              onGoToCalendar={() => setCurrentTab('calendar')}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarScreen
              habits={habits}
              completions={completions}
              onToggleCompleteForDate={handleToggleCompleteForDate}
              onEditHabit={handleOpenEditHabit}
            />
          )}

          {currentTab === 'statistics' && (
            <StatisticsScreen
              habits={habits}
              completions={completions}
              onAddHabit={handleOpenAddHabit}
              onEditHabit={handleOpenEditHabit}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsScreen achievements={achievements} />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetAllData={handleResetAllData}
              onLoadSampleData={handleLoadSampleData}
            />
          )}
        </main>

        {/* Bottom Tab Navigation */}
        <BottomNavigation
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onAddHabit={handleOpenAddHabit}
        />

        {/* Habit Creation & Editing Modal */}
        <HabitModal
          isOpen={isHabitModalOpen}
          habitToEdit={editingHabit}
          onSave={handleSaveHabit}
          onDelete={handleDeleteHabit}
          onClose={() => setIsHabitModalOpen(false)}
        />
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
