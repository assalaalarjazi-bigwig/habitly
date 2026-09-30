import React, { useState, useEffect } from 'react';
import { X, Bell, Trash2 } from 'lucide-react';
import { Habit } from '../types';
import { HABIT_ICON_OPTIONS, HabitIcon } from './HabitIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

interface HabitModalProps {
  isOpen: boolean;
  habitToEdit?: Habit | null;
  onSave: (habitData: Partial<Habit>) => void;
  onDelete?: (habitId: string) => void;
  onClose: () => void;
}

const COLOR_PRESETS = [
  '#10b981', // Emerald
  '#16a34a', // Green
  '#0284c7', // Sky
  '#2563eb', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316', // Orange
  '#eab308', // Amber
  '#64748b', // Slate
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  habitToEdit,
  onSave,
  onDelete,
  onClose,
}) => {
  const { t, isRTL } = useLanguage();
  const { palette } = useTheme();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('book');
  const [color, setColor] = useState('#10b981');
  const [targetPerWeek, setTargetPerWeek] = useState(7);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setIcon(habitToEdit.icon || 'book');
      setColor(habitToEdit.color || palette.primary);
      setTargetPerWeek(habitToEdit.targetPerWeek || 7);
      setReminderEnabled(Boolean(habitToEdit.reminderEnabled));
      setReminderTime(habitToEdit.reminderTime || '20:00');
    } else {
      setName('');
      setIcon('book');
      setColor(palette.primary);
      setTargetPerWeek(7);
      setReminderEnabled(false);
      setReminderTime('20:00');
    }
    setError('');
  }, [habitToEdit, isOpen, palette]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isRTL ? 'يرجى إدخال اسم العادة' : 'Please enter a habit name');
      return;
    }

    onSave({
      name: name.trim(),
      icon,
      color,
      targetPerWeek,
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-xs"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <HabitIcon name={icon} size={18} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {habitToEdit ? t('editHabitTitle') : t('createHabitTitle')}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Habit Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              {t('habitNameLabel')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('habitNamePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all"
              autoFocus
            />
            {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              {t('habitIconLabel')}
            </label>
            <div className="grid grid-cols-7 gap-2">
              {HABIT_ICON_OPTIONS.map((item) => {
                const isSelected = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-stone-900 dark:ring-white bg-stone-100 dark:bg-stone-800 scale-105'
                        : 'border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-300'
                    }`}
                    style={isSelected ? { color } : undefined}
                    title={isRTL ? item.labelAr : item.label}
                  >
                    <HabitIcon name={item.id} size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              {t('habitColorLabel')}
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_PRESETS.map((c) => {
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-full transition-transform active:scale-90 cursor-pointer flex items-center justify-center"
                    style={{
                      backgroundColor: c,
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: isSelected ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Weekly Goal Target */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                {t('weeklyGoalLabel')}
              </label>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {t('daysPerWeek', { days: targetPerWeek })}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = targetPerWeek === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTargetPerWeek(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xs'
                        : 'border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Reminder section */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-stone-500" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('reminderEnableLabel')}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {reminderEnabled && (
              <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 animate-in fade-in duration-150">
                <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                  {t('reminderTimeLabel')}
                </span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-bold"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2.5">
            {habitToEdit && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(habitToEdit.id)}
                className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title={t('deleteHabitBtn')}
              >
                <Trash2 size={18} />
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-white text-sm font-semibold shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: color }}
            >
              {habitToEdit ? t('updateHabitBtn') : t('saveHabitBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
