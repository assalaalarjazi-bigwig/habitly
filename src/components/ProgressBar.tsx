import React from 'react';
import { useTheme } from '../theme/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  height = 'md',
  showLabel = false,
  className = '',
}) => {
  const { palette } = useTheme();
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const barColor = color || palette.primary;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-stone-100 dark:bg-stone-800/80 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
};
