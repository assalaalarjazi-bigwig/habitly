import React from 'react';
import { useTheme } from '../theme/ThemeContext';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  const { palette } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform hover:scale-105 shadow-sm"
        style={{
          backgroundColor: palette.primaryBg,
          color: palette.primary,
        }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xs mb-6 leading-relaxed">
        {subtitle}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
          style={{
            backgroundColor: palette.primary,
            color: palette.textOnPrimary,
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
