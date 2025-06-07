import { Badge } from './Badge';
import { Equipment } from './Equipment';

export interface AchievementRewards {
  xp?: number;
  badge?: Badge;
  equipment?: Equipment;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'task' | 'quest' | 'social' | 'special';
  requirement: number;
  rewards?: AchievementRewards;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  hidden?: boolean;
  progress?: {
    current: number;
    total: number;
  };
} 