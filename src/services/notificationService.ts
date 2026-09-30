import { Habit } from '../types';

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  habitName?: string;
  icon?: string;
  timestamp: number;
}

type NotificationListener = (notification: InAppNotification) => void;

class NotificationService {
  private listeners: Set<NotificationListener> = new Set();
  private timer: number | null = null;
  private permissionState: NotificationPermission = 'default';
  private scheduledReminders: Map<string, string> = new Map(); // habitId -> HH:MM

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permissionState = Notification.permission;
    }
    this.startReminderChecker();
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async requestPermission(): Promise<{ granted: boolean; explanation?: string }> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return {
        granted: false,
        explanation: 'notifications_unsupported',
      };
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionState = permission;
      if (permission === 'granted') {
        return { granted: true };
      } else {
        return {
          granted: false,
          explanation: 'notifications_denied_help',
        };
      }
    } catch {
      return {
        granted: false,
        explanation: 'notifications_denied_help',
      };
    }
  }

  public getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public syncHabits(habits: Habit[]) {
    this.scheduledReminders.clear();
    habits.forEach((h) => {
      if (h.reminderEnabled && h.reminderTime) {
        this.scheduledReminders.set(h.id, h.reminderTime);
      }
    });
  }

  public scheduleHabitReminder(habit: Habit) {
    if (habit.reminderEnabled && habit.reminderTime) {
      this.scheduledReminders.set(habit.id, habit.reminderTime);
    } else {
      this.scheduledReminders.delete(habit.id);
    }
  }

  public cancelHabitReminder(habitId: string) {
    this.scheduledReminders.delete(habitId);
  }

  /**
   * Broadcast an in-app and/or system notification safely
   */
  public triggerNotification(title: string, body: string, habitName?: string, icon?: string) {
    const item: InAppNotification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      title,
      body,
      habitName,
      icon,
      timestamp: Date.now(),
    };

    // 1. In-app listeners (always works, graceful even if permission denied)
    this.listeners.forEach((listener) => {
      try {
        listener(item);
      } catch (err) {
        console.warn('Notification listener error:', err);
      }
    });

    // 2. System notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification dispatch error:', e);
      }
    }
  }

  private startReminderChecker() {
    if (typeof window === 'undefined') return;

    let lastFiredMinute = '';

    this.timer = window.setInterval(() => {
      const now = new Date();
      const currentMinute = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentMinute === lastFiredMinute) return;
      lastFiredMinute = currentMinute;

      // Check if any habit matches this time
      this.scheduledReminders.forEach((time, habitId) => {
        if (time === currentMinute) {
          // Trigger reminder
          this.triggerNotification(
            '⏰ تذكير بعادة | Habit Reminder',
            `حان الوقت لإنجاز عادتك اليومية! حافظ على سلسلتك! ✨`,
            habitId
          );
        }
      });
    }, 15000); // Check every 15s
  }
}

export const notificationService = new NotificationService();
