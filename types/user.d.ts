export interface UserAttributes {
  strength: number;
  intelligence: number;
  charisma: number;
  dexterity: number;
  wisdom: number;
  vitality: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (user: User) => boolean;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: Date;
}

export interface EquipmentItem {
  id: string;
  name: string;
  slot: 'head' | 'body' | 'hands' | 'feet';
  icon: string;
  description: string;
  bonus?: {
    type: 'xp_boost' | 'streak_protection' | 'attribute_gain';
    value: number;
    targetCategory?: string;
    targetAttribute?: string;
    timeCondition?: { beforeHour?: number; afterHour?: number };
  };
  isEquipped: boolean;
}

export interface UserClass {
  id: 'warrior' | 'mage' | 'rogue' | 'paladin' | 'bard';
  name: string;
  description: string;
  passiveBonus: string;
}

export interface User {
  attributes: UserAttributes;
  achievements: Achievement[];
  badges: Badge[];
  equipment: EquipmentItem[];
  class?: UserClass;
  totalTasksCompleted: number;
  streakDays: number;
  level: number;
  completedQuests: string[];
  createdAt?: string;
} 