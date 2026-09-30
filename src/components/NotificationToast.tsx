import React, { useEffect } from 'react';
import { Sparkles, X, Bell } from 'lucide-react';
import { InAppNotification } from '../services/notificationService';
import { useLanguage } from '../i18n/LanguageContext';

interface NotificationToastProps {
  notifications: InAppNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
}) => {
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (notifications.length > 0) {
      const top = notifications[0];
      const timer = setTimeout(() => {
        onDismiss(top.id);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notifications, onDismiss]);

  if (notifications.length === 0) return null;

  const current = notifications[0];

  return (
    <div
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="pointer-events-auto max-w-sm w-full bg-stone-900/95 dark:bg-stone-800/95 text-white backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-stone-700/50 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          {current.icon ? (
            <span className="text-lg">{current.icon}</span>
          ) : current.title.includes('وسام') || current.title.includes('Achievement') ? (
            <Sparkles size={18} />
          ) : (
            <Bell size={18} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-amber-300 truncate">
            {current.title}
          </h4>
          <p className="text-xs text-stone-200 line-clamp-2 mt-0.5">
            {current.body}
          </p>
        </div>

        <button
          onClick={() => onDismiss(current.id)}
          className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
