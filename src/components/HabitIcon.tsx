import React from 'react';
import {
  BookOpen,
  Droplets,
  Dumbbell,
  Moon,
  Sun,
  Heart,
  Code,
  Zap,
  Coffee,
  Music,
  Smile,
  Target,
  Sparkles,
  Footprints,
  Flame,
  Check,
} from 'lucide-react';

interface HabitIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const HABIT_ICON_OPTIONS = [
  { id: 'book', label: 'Book', labelAr: 'قراءة', icon: BookOpen },
  { id: 'droplet', label: 'Water', labelAr: 'ماء', icon: Droplets },
  { id: 'dumbbell', label: 'Workout', labelAr: 'رياضة', icon: Dumbbell },
  { id: 'moon', label: 'Sleep', labelAr: 'نوم', icon: Moon },
  { id: 'sun', label: 'Morning', labelAr: 'صباح', icon: Sun },
  { id: 'heart', label: 'Health', labelAr: 'صحة', icon: Heart },
  { id: 'code', label: 'Code', labelAr: 'برمجة', icon: Code },
  { id: 'zap', label: 'Energy', labelAr: 'طاقة', icon: Zap },
  { id: 'footprints', label: 'Walking', labelAr: 'مشي', icon: Footprints },
  { id: 'sparkles', label: 'Mind', labelAr: 'تأمل', icon: Sparkles },
  { id: 'coffee', label: 'Nutrition', labelAr: 'تغذية', icon: Coffee },
  { id: 'music', label: 'Music', labelAr: 'موسيقى', icon: Music },
  { id: 'smile', label: 'Mood', labelAr: 'سعادة', icon: Smile },
  { id: 'target', label: 'Focus', labelAr: 'تركيز', icon: Target },
];

export const HabitIcon: React.FC<HabitIconProps> = ({ name, size = 20, className = '', style }) => {
  switch (name) {
    case 'book':
      return <BookOpen size={size} className={className} style={style} />;
    case 'droplet':
      return <Droplets size={size} className={className} style={style} />;
    case 'dumbbell':
      return <Dumbbell size={size} className={className} style={style} />;
    case 'moon':
      return <Moon size={size} className={className} style={style} />;
    case 'sun':
      return <Sun size={size} className={className} style={style} />;
    case 'heart':
      return <Heart size={size} className={className} style={style} />;
    case 'code':
      return <Code size={size} className={className} style={style} />;
    case 'zap':
      return <Zap size={size} className={className} style={style} />;
    case 'footprints':
      return <Footprints size={size} className={className} style={style} />;
    case 'sparkles':
      return <Sparkles size={size} className={className} style={style} />;
    case 'coffee':
      return <Coffee size={size} className={className} style={style} />;
    case 'music':
      return <Music size={size} className={className} style={style} />;
    case 'smile':
      return <Smile size={size} className={className} style={style} />;
    case 'target':
      return <Target size={size} className={className} style={style} />;
    case 'flame':
      return <Flame size={size} className={className} style={style} />;
    default:
      return <Check size={size} className={className} style={style} />;
  }
};
