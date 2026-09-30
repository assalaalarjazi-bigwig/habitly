import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-3 px-1 ${className}`}>
      <div>
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
