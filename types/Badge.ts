export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category?: 'achievement' | 'event' | 'special';
  unlockedAt?: Date | null;
  attributes?: {
    strength?: number;
    intelligence?: number;
    charisma?: number;
    dexterity?: number;
    wisdom?: number;
    vitality?: number;
  };
  condition?: (user: any) => boolean;
} 