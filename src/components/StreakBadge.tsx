import React from 'react';
import { Flame } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface StreakBadgeProps {
  count: number;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ count, isActive = true, size = 'sm' }) => {
  const { t, isRTL } = useLanguage();

  if (count <= 0) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 18,
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium transition-colors ${sizeClasses[size]} ${
        isActive
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Flame
        size={iconSizes[size]}
        className={`${isActive ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-stone-400'}`}
      />
      <span>{count} {t('streakDays')}</span>
    </div>
  );
};
