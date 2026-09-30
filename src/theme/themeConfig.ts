import { ColorTheme } from '../types';

export interface ThemePalette {
  id: ColorTheme;
  name: string;
  nameAr: string;
  primary: string; // e.g., #059669
  primaryHover: string;
  primaryBg: string; // light tinted background e.g. #ecfdf5
  primaryBgDark: string; // dark tinted background e.g. #064e3b33
  textOnPrimary: string;
  borderAccent: string;
  chipBg: string;
  chipText: string;
}

export const THEME_PALETTES: Record<ColorTheme, ThemePalette> = {
  default: {
    id: 'default',
    name: 'Emerald',
    nameAr: 'الزمردي الطبيعي',
    primary: '#10b981',
    primaryHover: '#059669',
    primaryBg: '#ecfdf5',
    primaryBgDark: '#064e3b26',
    textOnPrimary: '#ffffff',
    borderAccent: '#a7f3d0',
    chipBg: '#d1fae5',
    chipText: '#065f46',
  },
  green: {
    id: 'green',
    name: 'Sage',
    nameAr: 'الميرمية الهادئ',
    primary: '#16a34a',
    primaryHover: '#15803d',
    primaryBg: '#f0fdf4',
    primaryBgDark: '#14532d26',
    textOnPrimary: '#ffffff',
    borderAccent: '#bbf7d0',
    chipBg: '#dcfce7',
    chipText: '#166534',
  },
  blue: {
    id: 'blue',
    name: 'Ocean',
    nameAr: 'أزرق المحيط',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryBg: '#eff6ff',
    primaryBgDark: '#1e3a8a26',
    textOnPrimary: '#ffffff',
    borderAccent: '#bfdbfe',
    chipBg: '#dbeafe',
    chipText: '#1e40af',
  },
  purple: {
    id: 'purple',
    name: 'Lavender',
    nameAr: 'اللافندر الرقيق',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primaryBg: '#f5f3ff',
    primaryBgDark: '#4c1d9526',
    textOnPrimary: '#ffffff',
    borderAccent: '#ddd6fe',
    chipBg: '#ede9fe',
    chipText: '#5b21b6',
  },
  pink: {
    id: 'pink',
    name: 'Rose',
    nameAr: 'الورد الناعم',
    primary: '#f43f5e',
    primaryHover: '#e11d48',
    primaryBg: '#fff1f2',
    primaryBgDark: '#88133726',
    textOnPrimary: '#ffffff',
    borderAccent: '#fecdd3',
    chipBg: '#ffe4e6',
    chipText: '#9f1239',
  },
  orange: {
    id: 'orange',
    name: 'Sunset',
    nameAr: 'غروب دافئ',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryBg: '#fff7ed',
    primaryBgDark: '#7c2d1226',
    textOnPrimary: '#ffffff',
    borderAccent: '#fed7aa',
    chipBg: '#ffedd5',
    chipText: '#9a3412',
  },
};
