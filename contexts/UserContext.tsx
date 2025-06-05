import React, { createContext, useContext, useEffect, useState } from 'react';
import { TaskCategory } from '@/types/Task';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

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
}

interface UserContextProps {
  user: User;
  addXP: (amount: number, category?: TaskCategory) => void;
  updateUser: (data: Partial<User>) => void;
  resetProgress: () => void;
}

const initialUser: User = {
  name: 'Adventurer',
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
  }
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
  }
};

// Use SecureStore for native platforms, localStorage for web
const secureStore = Platform.OS === 'web' ? secureStoreWeb : SecureStore;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(initialUser);
  
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
          await secureStore.setItem('dailyxp_user', JSON.stringify(initialUser));
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
      const lastActiveDate = new Date(user.lastActive).toISOString().split('T')[0];
      
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
        setUser(newUser);
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
  
  // Add XP and level up if necessary
  const addXP = (amount: number, category: TaskCategory = 'learning') => {
    setUser(prevUser => {
      let newCurrentXP = prevUser.currentXP + amount;
      let newLevel = prevUser.level;
      let newXpToNextLevel = prevUser.xpToNextLevel;
      
      // Check for level up
      while (newCurrentXP >= newXpToNextLevel) {
        newCurrentXP -= newXpToNextLevel;
        newLevel += 1;
        newXpToNextLevel = calculateXPForLevel(newLevel);
      }
      
      // Update category XP
      const newCategoryXP = { ...prevUser.categoryXP };
      newCategoryXP[category] = (newCategoryXP[category] || 0) + amount;
      
      return {
        ...prevUser,
        currentXP: newCurrentXP,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
        totalXP: prevUser.totalXP + amount,
        lastActive: new Date().toISOString(),
        categoryXP: newCategoryXP
      };
    });
  };
  
  // Update user profile
  const updateUser = (data: Partial<User>) => {
    setUser(prevUser => ({
      ...prevUser,
      ...data
    }));
  };
  
  // Reset all progress
  const resetProgress = () => {
    setUser(initialUser);
  };
  
  return (
    <UserContext.Provider value={{ user, addXP, updateUser, resetProgress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);