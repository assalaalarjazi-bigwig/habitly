import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Calendar as CalIcon } from 'lucide-react';
import { Habit, HabitCompletion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import {
  formatLocalDate,
  parseLocalDate,
  getTodayString,
  formatDisplayDate,
  formatMonthYear,
} from '../utils/dateUtils';
import { HabitIcon } from '../components/HabitIcon';
import { getHabitDisplayName } from '../storage/storageService';

interface CalendarScreenProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onToggleCompleteForDate: (habit: Habit, dateStr: string) => void;
  onEditHabit: (habit: Habit) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  habits,
  completions,
  onToggleCompleteForDate,
  onEditHabit,
}) => {
  const { t, isRTL, language } = useLanguage();
  const { palette } = useTheme();

  const todayStr = getTodayString();
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth());

  // Weekday names
  const weekDaysAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDays = isRTL ? weekDaysAr : weekDaysEn;

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Build calendar grid days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Completions map: dateStr -> Set of habitIds
  const dateCompletionsMap = new Map<string, Set<string>>();
  completions.forEach((c) => {
    if (!dateCompletionsMap.has(c.date)) {
      dateCompletionsMap.set(c.date, new Set());
    }
    dateCompletionsMap.get(c.date)!.add(c.habitId);
  });

  // Selected date statistics
  const selectedCompletions = dateCompletionsMap.get(selectedDateStr) || new Set();
  const totalHabits = habits.length;
  const completedHabitsOnSelected = habits.filter((h) => selectedCompletions.has(h.id));
  const incompleteHabitsOnSelected = habits.filter((h) => !selectedCompletions.has(h.id));
  const selectedDayPercent =
    totalHabits > 0 ? Math.round((completedHabitsOnSelected.length / totalHabits) * 100) : 0;

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Header & Month Navigation */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {t('calendarTitle')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 capitalize">
            {formatMonthYear(currentYear, currentMonth, language)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-1 shadow-xs">
          <button
            onClick={isRTL ? handleNextMonth : handlePrevMonth}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={t('prevMonth')}
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            onClick={handleGoToToday}
            className="px-2.5 py-1 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            {t('todayBtn')}
          </button>
          <button
            onClick={isRTL ? handlePrevMonth : handleNextMonth}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={t('nextMonth')}
          >
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map((dayName, idx) => (
            <span
              key={idx}
              className="text-[11px] font-bold text-stone-400 dark:text-stone-500 py-1"
            >
              {dayName}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-11" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisDate = new Date(currentYear, currentMonth, dayNum);
            const dateStr = formatLocalDate(thisDate);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;

            const dayDoneCount = dateCompletionsMap.get(dateStr)?.size || 0;
            const hasActivity = dayDoneCount > 0;
            const isPerfect = totalHabits > 0 && dayDoneCount >= totalHabits;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`relative h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-stone-900 dark:ring-white bg-stone-100 dark:bg-stone-800 font-bold scale-105 z-10'
                    : isToday
                    ? 'border-2 border-stone-300 dark:border-stone-600 bg-stone-50/50 dark:bg-stone-800/40'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <span
                  className={`text-xs ${
                    isSelected
                      ? 'text-stone-900 dark:text-stone-100 font-bold'
                      : isToday
                      ? 'text-stone-900 dark:text-stone-100 font-semibold'
                      : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Activity Indicator: subtle dot or ring */}
                <div className="h-2 flex items-center justify-center mt-0.5">
                  {isPerfect ? (
                    <span
                      className="w-1.5 h-1.5 rounded-full ring-2 ring-emerald-300 dark:ring-emerald-700"
                      style={{ backgroundColor: palette.primary }}
                    />
                  ) : hasActivity ? (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                    />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Section */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
              {t('selectedDaySummary')}
            </span>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {formatDisplayDate(selectedDateStr, language)}
            </h3>
          </div>

          <div className="text-right">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full inline-block"
              style={{
                backgroundColor: palette.primaryBg,
                color: palette.primary,
              }}
            >
              {selectedDayPercent}% {t('dailyCompletionRate')}
            </span>
          </div>
        </div>

        {totalHabits === 0 ? (
          <p className="text-xs text-stone-400 py-3 text-center">
            {t('noHabitsOnDay')}
          </p>
        ) : (
          <div className="space-y-4">
            {/* Completed habits */}
            {completedHabitsOnSelected.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>{t('habitsCompletedOnDay')} ({completedHabitsOnSelected.length})</span>
                </h4>
                <div className="space-y-2">
                  {completedHabitsOnSelected.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                        >
                          <HabitIcon name={habit.icon} size={14} />
                        </div>
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                          {getHabitDisplayName(habit, language)}
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleCompleteForDate(habit, selectedDateStr)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        {t('undoComplete')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Incomplete habits */}
            {incompleteHabitsOnSelected.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                  <Circle size={13} />
                  <span>{t('habitsIncompleteOnDay')} ({incompleteHabitsOnSelected.length})</span>
                </h4>
                <div className="space-y-2">
                  {incompleteHabitsOnSelected.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                        >
                          <HabitIcon name={habit.icon} size={14} />
                        </div>
                        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          {getHabitDisplayName(habit, language)}
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleCompleteForDate(habit, selectedDateStr)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 transition-colors cursor-pointer"
                      >
                        {t('markComplete')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
