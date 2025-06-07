export interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streakDays: number;
  lastActive: string;
} 