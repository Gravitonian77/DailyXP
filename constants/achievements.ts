import { Achievement, Badge, EquipmentItem } from '@/types/user';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    name: 'First Steps',
    description: 'Complete your first task',
    icon: '🩸',
    condition: (user) => user.totalTasksCompleted >= 1,
    unlocked: false,
  },
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🏆',
    condition: (user) => user.streakDays >= 7,
    unlocked: false,
  },
  {
    id: 'xp_grinder',
    name: 'XP Grinder',
    description: 'Reach level 10',
    icon: '💎',
    condition: (user) => user.level >= 10,
    unlocked: false,
  },
  {
    id: 'mind_master',
    name: 'Mind Master',
    description: 'Reach 15 Intelligence',
    icon: '🧠',
    condition: (user) => user.attributes.intelligence >= 15,
    unlocked: false,
  },
  {
    id: 'iron_body',
    name: 'Iron Body',
    description: 'Reach 20 Strength',
    icon: '💪',
    condition: (user) => user.attributes.strength >= 20,
    unlocked: false,
  },
  {
    id: 'ritual_keeper',
    name: 'Ritual Keeper',
    description: 'Complete at least 1 task every day for 30 days',
    icon: '📅',
    condition: (user) => user.streakDays >= 30,
    unlocked: false,
  },
  {
    id: 'jack_of_all',
    name: 'Jack of All Trades',
    description: 'Reach 10 in all attributes',
    icon: '🃏',
    condition: (user) => Object.values(user.attributes).every(val => val >= 10),
    unlocked: false,
  },
  {
    id: 'no_rest',
    name: 'No Rest for the Focused',
    description: 'Complete 100 tasks',
    icon: '🔥',
    condition: (user) => user.totalTasksCompleted >= 100,
    unlocked: false,
  },
  {
    id: 'quest_clearer',
    name: 'Quest Clearer',
    description: 'Finish 10 quests',
    icon: '🎯',
    condition: (user) => user.completedQuests && user.completedQuests.length >= 10,
    unlocked: false,
  },
  {
    id: 'zen_mode',
    name: 'Zen Mode',
    description: 'Meditate 7 days in a row',
    icon: '🧘',
    condition: (user) => checkMeditationStreak(user, 7),
    unlocked: false,
  },
];

export const BADGES: Badge[] = [
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    icon: '🌟',
    description: "Joined during the app's first release",
    unlockedAt: new Date(), // Set when unlocked
    // Add a condition property for evaluation
    condition: (user) => user.createdAt && new Date(user.createdAt) < new Date('2024-07-01'),
  } as any, // Type workaround for extra property
  {
    id: 'night_runner',
    name: 'Night Runner',
    icon: '🌙',
    description: 'Completed tasks after 10 PM for 5 days',
    unlockedAt: new Date(),
    condition: (user) => checkNightRunner(user),
  } as any,
  {
    id: 'discipline_king',
    name: 'Discipline King',
    icon: '👑',
    description: '30-day streak badge',
    unlockedAt: new Date(),
    condition: (user) => user.streakDays >= 30,
  } as any,
  {
    id: 'brainiac',
    name: 'Brainiac',
    icon: '🧠',
    description: 'Reached 25 Intelligence',
    unlockedAt: new Date(),
    condition: (user) => user.attributes.intelligence >= 25,
  } as any,
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    icon: '🚀',
    description: '7 days of completing 5+ tasks per day',
    unlockedAt: new Date(),
    condition: (user) => checkUnstoppable(user),
  } as any,
];

export const EQUIPMENT: EquipmentItem[] = [
  {
    id: 'headband_focus',
    name: 'Headband of Focus',
    slot: 'head',
    icon: '🎽',
    description: '+10% XP from reading tasks',
    bonus: { type: 'xp_boost', value: 0.1, targetCategory: 'reading' },
    isEquipped: false,
    condition: (user) => user.attributes.intelligence >= 10,
  } as any,
  {
    id: 'boots_speed',
    name: 'Swiftstep Boots',
    slot: 'feet',
    icon: '👟',
    description: 'Gain +1 Dexterity from every 5 tasks completed',
    bonus: { type: 'attribute_gain', value: 1, targetAttribute: 'dexterity' },
    isEquipped: false,
    condition: (user) => user.totalTasksCompleted >= 25,
  } as any,
  {
    id: 'gloves_grit',
    name: 'Gloves of Grit',
    slot: 'hands',
    icon: '🧤',
    description: 'Prevents streak loss once every 14 days',
    bonus: { type: 'streak_protection', value: 14 },
    isEquipped: false,
    condition: (user) => user.streakDays >= 14,
  } as any,
  {
    id: 'cloak_knowledge',
    name: 'Cloak of Knowledge',
    slot: 'body',
    icon: '🧥',
    description: '+2 Intelligence if user completes 3+ tasks per day',
    bonus: { type: 'attribute_gain', value: 2, targetAttribute: 'intelligence' },
    isEquipped: false,
    condition: (user) => checkTasksPerDay(user, 3),
  } as any,
  {
    id: 'ring_discipline',
    name: 'Ring of Discipline',
    slot: 'hands',
    icon: '💍',
    description: 'Grants bonus XP if task completed before 8 AM',
    bonus: { type: 'xp_boost', value: 0.2, timeCondition: { beforeHour: 8 } },
    isEquipped: false,
    condition: (user) => checkEarlyBird(user),
  } as any,
];

// Helper functions
function checkMeditationStreak(user: any, days: number): boolean {
  if (!Array.isArray(user.meditationHistory)) return false;

  const dates = user.meditationHistory
    .map((d: any) => new Date(d))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  let streak = 1;
  for (let i = dates.length - 1; i > 0 && streak < days; i--) {
    const diff = dates[i].getTime() - dates[i - 1].getTime();
    if (diff <= 86400000 + 1000 && diff >= 0) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak >= days;
}

function checkNightRunner(user: any): boolean {
  const history = Array.isArray(user.taskHistory) ? user.taskHistory : [];
  const nights = new Set<string>();

  history.forEach((t: any) => {
    if (!t.completedDate) return;
    const date = new Date(t.completedDate);
    if (date.getHours() >= 22) {
      nights.add(date.toISOString().split('T')[0]);
    }
  });

  return nights.size >= 5;
}

function checkUnstoppable(user: any): boolean {
  const history = Array.isArray(user.taskHistory) ? user.taskHistory : [];
  const counts: Record<string, number> = {};

  history.forEach((t: any) => {
    if (!t.completedDate) return;
    const day = new Date(t.completedDate).toISOString().split('T')[0];
    counts[day] = (counts[day] || 0) + 1;
  });

  const sortedDays = Object.keys(counts).sort();
  let streak = 0;

  for (let i = 0; i < sortedDays.length; i++) {
    const day = sortedDays[i];
    const prevDay = i > 0 ? new Date(sortedDays[i - 1]) : null;
    const currDay = new Date(day);

    if (counts[day] >= 5 && (!prevDay || currDay.getTime() - prevDay.getTime() === 86400000)) {
      streak += 1;
      if (streak >= 7) return true;
    } else {
      streak = counts[day] >= 5 ? 1 : 0;
    }
  }

  return false;
}

function checkTasksPerDay(user: any, min: number): boolean {
  const history = Array.isArray(user.taskHistory) ? user.taskHistory : [];
  const today = new Date().toISOString().split('T')[0];

  const count = history.filter((t: any) => {
    if (!t.completedDate) return false;
    return t.completedDate.startsWith(today);
  }).length;

  return count >= min;
}

function checkEarlyBird(user: any): boolean {
  const history = Array.isArray(user.taskHistory) ? user.taskHistory : [];
  return history.some((t: any) => {
    if (!t.completedDate) return false;
    const d = new Date(t.completedDate);
    return d.getHours() < 8;
  });
}
