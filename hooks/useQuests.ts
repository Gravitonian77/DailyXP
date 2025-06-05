import { useState, useEffect } from 'react';
import { Quest, NewQuestInput, QuestStep } from '@/types/Quest';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';

// Web localStorage implementation
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

// Initial sample quests
const sampleQuests: Quest[] = [
  {
    id: '1',
    title: 'Launch Personal Website',
    description: 'Create and launch your personal portfolio website',
    category: 'creativity',
    difficulty: 'hard',
    status: 'active',
    progress: 33,
    xpReward: 150,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
    steps: [
      {
        id: '1-1',
        title: 'Design mockups',
        description: 'Create design mockups for website',
        completed: true,
        xpValue: 30,
      },
      {
        id: '1-2',
        title: 'Build front-end',
        description: 'Implement the website frontend',
        completed: false,
        xpValue: 50,
      },
      {
        id: '1-3',
        title: 'Deploy to hosting',
        description: 'Deploy the website to a hosting service',
        completed: false,
        xpValue: 70,
      }
    ],
    completed: false,
  },
  {
    id: '2',
    title: 'Read 5 Books',
    description: 'Read 5 books in the next 2 months',
    category: 'learning',
    difficulty: 'medium',
    status: 'active',
    progress: 20,
    xpReward: 100,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 60).toISOString(), // 60 days from now
    steps: [
      {
        id: '2-1',
        title: 'Book 1',
        description: 'Read first book',
        completed: true,
        xpValue: 20,
      },
      {
        id: '2-2',
        title: 'Book 2',
        description: 'Read second book',
        completed: false,
        xpValue: 20,
      },
      {
        id: '2-3',
        title: 'Book 3',
        description: 'Read third book',
        completed: false,
        xpValue: 20,
      },
      {
        id: '2-4',
        title: 'Book 4',
        description: 'Read fourth book',
        completed: false,
        xpValue: 20,
      },
      {
        id: '2-5',
        title: 'Book 5',
        description: 'Read fifth book',
        completed: false,
        xpValue: 20,
      }
    ],
    completed: false,
  }
];

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load quests from storage on initial load
  useEffect(() => {
    const loadQuests = async () => {
      try {
        const questsData = await secureStore.getItem('dailyxp_quests');
        if (questsData) {
          setQuests(JSON.parse(questsData));
        } else {
          // First time, set sample quests
          setQuests(sampleQuests);
          await secureStore.setItem('dailyxp_quests', JSON.stringify(sampleQuests));
        }
      } catch (error) {
        console.error('Failed to load quests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuests();
  }, []);
  
  // Save quests whenever they change
  useEffect(() => {
    const saveQuests = async () => {
      if (!loading) {
        try {
          await secureStore.setItem('dailyxp_quests', JSON.stringify(quests));
        } catch (error) {
          console.error('Failed to save quests:', error);
        }
      }
    };
    
    saveQuests();
  }, [quests, loading]);
  
  // Calculate XP reward based on quest difficulty
  const calculateXpReward = (difficulty: 'easy' | 'medium' | 'hard' | 'legendary'): number => {
    switch (difficulty) {
      case 'easy': return 50;
      case 'medium': return 100;
      case 'hard': return 150;
      case 'legendary': return 300;
      default: return 50;
    }
  };
  
  // Calculate XP for each step based on the total XP reward
  const calculateStepXp = (totalXp: number, stepsCount: number): number => {
    return Math.round(totalXp / stepsCount);
  };
  
  // Add a new quest
  const addQuest = (questInput: NewQuestInput): Quest => {
    const xpReward = calculateXpReward(questInput.difficulty);
    const stepXp = calculateStepXp(xpReward, questInput.steps.length);
    
    const steps: QuestStep[] = questInput.steps.map((step) => ({
      id: uuid.v4() as string,
      title: step.title,
      description: step.description || '',
      completed: false,
      xpValue: stepXp,
    }));
    
    const newQuest: Quest = {
      id: uuid.v4() as string,
      title: questInput.title,
      description: questInput.description,
      category: questInput.category,
      difficulty: questInput.difficulty,
      status: 'active',
      progress: 0,
      xpReward,
      startDate: new Date().toISOString(),
      endDate: questInput.endDate,
      steps,
      completed: false,
    };
    
    setQuests((prevQuests) => [...prevQuests, newQuest]);
    return newQuest;
  };
  
  // Update a quest
  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    setQuests((prevQuests) => 
      prevQuests.map((quest) => 
        quest.id === questId ? { ...quest, ...updates } : quest
      )
    );
  };
  
  // Delete a quest
  const deleteQuest = (questId: string) => {
    setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== questId));
  };
  
  // Complete a quest step
  const completeQuestStep = (questId: string, stepId: string) => {
    setQuests((prevQuests) => 
      prevQuests.map((quest) => {
        if (quest.id === questId) {
          // Update the step to completed
          const updatedSteps = quest.steps.map((step) => 
            step.id === stepId ? { ...step, completed: true } : step
          );
          
          // Calculate new progress
          const completedSteps = updatedSteps.filter((step) => step.completed).length;
          const totalSteps = updatedSteps.length;
          const progress = Math.round((completedSteps / totalSteps) * 100);
          
          // Check if all steps are completed
          const allStepsCompleted = completedSteps === totalSteps;
          
          return {
            ...quest,
            steps: updatedSteps,
            progress,
            completed: allStepsCompleted,
            status: allStepsCompleted ? 'completed' : quest.status,
            endDate: allStepsCompleted ? new Date().toISOString() : quest.endDate,
          };
        }
        return quest;
      })
    );
  };
  
  // Get a specific quest by ID
  const getQuest = (questId: string) => {
    return quests.find((quest) => quest.id === questId);
  };
  
  return {
    quests,
    loading,
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuestStep,
    getQuest,
  };
};