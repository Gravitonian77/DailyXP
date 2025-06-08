import React, { createContext, useContext, useEffect, useState } from 'react';
import { TaskCategory } from '@/types/Task';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { Achievement, Badge, EquipmentItem, UserClass } from '@/types/user';
import { ACHIEVEMENTS, BADGES, EQUIPMENT } from '@/constants/achievements';
import { useNotification } from '@/contexts/NotificationContext';

interface User {
  name: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  streakDays: number;
  lastActive: string;
  avatarUrl?: string;
  title?: string;
  badges?: string[];
  equipment?: string[];
  class?: string;
  categoryXP: {
    health: number;
    work: number;
    creativity: number;
    social: number;
    learning: number;
  };
  attributes: Record<string, number>;
  achievements: Achievement[];
}

interface UserContextProps {
  user: User;
  addXP: (amount: number, category: TaskCategory) => void;
  updateUser: (updates: Partial<User>) => void;
  resetProgress: () => void;
}

const ATTRIBUTE_LIST = [
  'strength',
  'intelligence',
  'charisma',
  'dexterity',
  'wisdom',
  'vitality',
] as const;
type Attribute = (typeof ATTRIBUTE_LIST)[number];

const CATEGORY_TO_ATTRIBUTE: Record<string, Attribute> = {
  health: 'strength', // fitness, exercise, etc.
  work: 'wisdom', // work, productivity
  creativity: 'dexterity',
  social: 'charisma',
  learning: 'intelligence',
  // Add more mappings as needed
};

const initialUser: User = {
  name: '', // This will be set from the user's profile
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  totalXP: 0,
  streakDays: 0,
  lastActive: new Date().toISOString(),
  categoryXP: {
    health: 0,
    work: 0,
    creativity: 0,
    social: 0,
    learning: 0,
  },
  attributes: {
    strength: 0,
    intelligence: 0,
    charisma: 0,
    dexterity: 0,
    wisdom: 0,
    vitality: 0,
  },
  achievements: [],
  badges: [],
  equipment: [],
  class: undefined,
};

const UserContext = createContext<UserContextProps>({
  user: initialUser,
  addXP: () => {},
  updateUser: () => {},
  resetProgress: () => {},
});

// Helper function for web localStorage
const secureStoreWeb = {
  getItem: async (key: string) => {
    const value = localStorage.getItem(key);
    return value;
  },
  setItem: async (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  deleteItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

// Use SecureStore for native platforms, localStorage for web
const secureStore = Platform.OS === 'web' ? secureStoreWeb : SecureStore;

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(initialUser);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        setUser((prevUser) => ({
          ...prevUser,
          name: profile.name || prevUser.name,
        }));
      }
    };

    fetchUserProfile();
  }, []);

  // Calculate the XP needed for a given level
  const calculateXPForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  // Load user data from storage on initial load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await secureStore.getItem('dailyxp_user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // First time user, save initial state
          await secureStore.setItem(
            'dailyxp_user',
            JSON.stringify(initialUser)
          );
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Update streak days
  useEffect(() => {
    const updateStreak = async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastActiveDate = new Date(user.lastActive)
        .toISOString()
        .split('T')[0];

      let newUser = { ...user };

      if (today !== lastActiveDate) {
        // Check if last active was yesterday (maintain streak) or earlier (reset streak)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActiveDate === yesterdayStr) {
          // Increment streak
          newUser.streakDays += 1;
        } else if (lastActiveDate < yesterdayStr) {
          // Reset streak
          newUser.streakDays = 1;
        }

        newUser.lastActive = today;
        updateUser(newUser);
        await secureStore.setItem('dailyxp_user', JSON.stringify(newUser));
      }
    };

    updateStreak();
  }, []);

  // Save user data whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        await secureStore.setItem('dailyxp_user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    };

    saveUserData();
  }, [user]);

  const { showNotification } = useNotification();

  const addXP = (amount: number, category: TaskCategory) => {
    setUser((prevUser) => {
      let newCurrentXP = prevUser.currentXP + amount;
      let newLevel = prevUser.level;
      let newXpToNextLevel = prevUser.xpToNextLevel;

      // Level up if XP threshold is reached
      while (newCurrentXP >= newXpToNextLevel) {
        newCurrentXP -= newXpToNextLevel;
        newLevel += 1;
        newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5); // Increase XP needed for next level
      }

      // Attribute logic
      const attrKey = CATEGORY_TO_ATTRIBUTE[category] as Attribute;
      const attrGain = Math.floor(amount / 10);
      const newAttributes = { ...prevUser.attributes };
      if (attrKey && attrGain > 0) {
        newAttributes[attrKey] = (newAttributes[attrKey] || 0) + attrGain;
      }

      const updatedUser = {
        ...prevUser,
        currentXP: newCurrentXP,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
        totalXP: prevUser.totalXP + amount,
        categoryXP: {
          ...prevUser.categoryXP,
          [category]: prevUser.categoryXP[category] + amount,
        },
        attributes: newAttributes,
      } as User;

      const { newBadges } = evaluateBadges(updatedUser);
      if (newBadges.length) {
        updatedUser.badges = [...(prevUser.badges || []), ...newBadges];
        newBadges.forEach((b) =>
          showNotification(`New Badge Unlocked: ${b.name}!`, 'success')
        );
      }

      return updatedUser;
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...updates } as User;

      const { newBadges } = evaluateBadges(updatedUser);
      if (newBadges.length) {
        updatedUser.badges = [...(prevUser.badges || []), ...newBadges];
        newBadges.forEach((b) =>
          showNotification(`New Badge Unlocked: ${b.name}!`, 'success')
        );
      }

      return updatedUser;
    });
  };

  const resetProgress = () => {
    setUser(initialUser);
  };

  return (
    <UserContext.Provider value={{ user, addXP, updateUser, resetProgress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Replace the evaluateAchievements function with:
function evaluateBadges(user: User) {
  const newBadges: Badge[] = [];
  for (const badge of BADGES as Badge[]) {
    const hasCondition = typeof (badge as any).condition === 'function';
    if (
      !(user.badges ?? []).some((b: any) =>
        b.id ? b.id === badge.id : b === badge.id
      ) &&
      hasCondition &&
      (badge as any).condition(user)
    ) {
      newBadges.push({ ...badge, unlockedAt: new Date() });
    }
  }
  return { newBadges };
}

// Call evaluateBadges after XP, attribute, streak, or task updates and update user state accordingly.
