import React from 'react';
import { Home, Calendar, BarChart3, Trophy, Settings } from 'lucide-react';
import { ScreenTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { soundService } from '../services/soundService';

export interface BottomNavigationProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onAddHabit?: () => void;
}

interface NavTabItem {
  id: ScreenTab;
  labelKey: 'navHome' | 'navCalendar' | 'navStatistics' | 'navAchievements' | 'navSettings';
  icon: React.ReactElement;
}

const TABS: NavTabItem[] = [
  { id: 'home', labelKey: 'navHome', icon: <Home size={20} /> },
  { id: 'calendar', labelKey: 'navCalendar', icon: <Calendar size={20} /> },
  { id: 'statistics', labelKey: 'navStatistics', icon: <BarChart3 size={20} /> },
  { id: 'achievements', labelKey: 'navAchievements', icon: <Trophy size={20} /> },
  { id: 'settings', labelKey: 'navSettings', icon: <Settings size={20} /> },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { t } = useLanguage();
  const { palette } = useTheme();

  const handleTabClick = (tab: ScreenTab) => {
    soundService.playTap();
    onSelectTab(tab);
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800 shadow-lg pb-safe"
    >
      <div className="max-w-lg mx-auto px-3 py-2 flex items-center justify-around relative">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'font-bold'
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
              style={isActive ? { color: palette.primary } : undefined}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'scale-105 shadow-xs' : 'hover:scale-105'
                }`}
                style={isActive ? { backgroundColor: palette.primaryBg } : undefined}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] font-medium tracking-tight">
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
