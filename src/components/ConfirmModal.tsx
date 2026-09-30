import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-xl border border-stone-200/80 dark:border-stone-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 ltr:right-4 rtl:left-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            {title}
          </h3>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {cancelText || t('cancelBtn')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl text-white text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {confirmText || (isDestructive ? t('deleteHabitBtn') : t('saveHabitBtn'))}
          </button>
        </div>
      </div>
    </div>
  );
};
