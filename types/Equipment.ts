export type EquipmentSlot = 'head' | 'chest' | 'hands' | 'legs' | 'feet' | 'weapon' | 'accessory';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  icon: string;
  slot: EquipmentSlot;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  attributes: {
    strength?: number;
    intelligence?: number;
    charisma?: number;
    dexterity?: number;
    wisdom?: number;
    vitality?: number;
  };
  equipped?: boolean;
  obtainedAt?: string;
  source?: 'achievement' | 'quest' | 'shop' | 'event';
} 