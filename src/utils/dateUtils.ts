import { Language } from '../types';

/**
 * Format a Date object as YYYY-MM-DD in local time
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD into a local Date object safely
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // midday to avoid DST edges
}

/**
 * Returns today in YYYY-MM-DD
 */
export function getTodayString(): string {
  return formatLocalDate(new Date());
}

/**
 * Returns yesterday in YYYY-MM-DD
 */
export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

/**
 * Shift a date by days
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatLocalDate(d);
}

/**
 * Get difference in days between two YYYY-MM-DD strings (dateA - dateB)
 */
export function getDaysDiff(dateA: string, dateB: string): number {
  const da = parseLocalDate(dateA);
  const db = parseLocalDate(dateB);
  const diffTime = da.getTime() - db.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get the dates for the current week (7 days, starts on Saturday or Monday based on locale or standard)
 * In Arabic culture Saturday is typically the start of week, in English Monday.
 */
export function getCurrentWeekDates(baseDate: Date = new Date(), startOnSaturday: boolean = false): string[] {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const currentDay = d.getDay(); // 0 is Sunday, 1 is Monday, 6 is Saturday
  
  let diffToStart: number;
  if (startOnSaturday) {
    // Saturday = 6. If day is 6 -> diff 0. If day is 0 (Sunday) -> diff 1. If day is 1 (Monday) -> diff 2.
    diffToStart = (currentDay + 1) % 7;
  } else {
    // Monday = 1. If Sunday (0) -> 6 days back. If Monday (1) -> 0.
    diffToStart = currentDay === 0 ? 6 : currentDay - 1;
  }

  const startDay = new Date(d);
  startDay.setDate(d.getDate() - diffToStart);

  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(startDay);
    nextDay.setDate(startDay.getDate() + i);
    week.push(formatLocalDate(nextDay));
  }
  return week;
}

/**
 * Format date for display in header/cards
 */
export function formatDisplayDate(dateStr: string, lang: Language): string {
  const date = parseLocalDate(dateStr);
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format short month & year
 */
export function formatMonthYear(year: number, month: number, lang: Language): string {
  const date = new Date(year, month, 1);
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format time for display (e.g. "08:00" -> "8:00 AM" or "٨:٠٠ ص")
 */
export function formatDisplayTime(timeStr: string, lang: Language): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date(2026, 0, 1, h, m);
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Get friendly greeting based on local time
 */
export function getGreeting(lang: Language, userName?: string): string {
  const hour = new Date().getHours();
  let timeGreeting = '';

  if (hour >= 4 && hour < 12) {
    timeGreeting = lang === 'ar' ? 'صباح الخير' : 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = lang === 'ar' ? 'مساء الخير' : 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeGreeting = lang === 'ar' ? 'مساء النور' : 'Good evening';
  } else {
    timeGreeting = lang === 'ar' ? 'ليلة هادئة' : 'Restful night';
  }

  if (userName && userName.trim()) {
    return `${timeGreeting}, ${userName.trim()}`;
  }
  return timeGreeting;
}
