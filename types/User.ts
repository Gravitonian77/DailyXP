import { Achievement } from './Achievement';
import { Badge } from './Badge';
import { Equipment } from './Equipment';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  streakDays: number;
  lastActive: string;
  title?: string;
  class?: string;
  attributes: {
    strength: number;
    intelligence: number;
    charisma: number;
    dexterity: number;
    wisdom: number;
    vitality: number;
  };
  achievements?: Achievement[];
  badges?: Badge[];
  equipment?: Equipment[];
  createdAt: string;
  updatedAt: string;
} 