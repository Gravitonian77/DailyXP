import { TaskCategory } from './Task';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type QuestStatus = 'active' | 'completed' | 'failed';

export interface QuestStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  xpValue: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  progress: number; // 0-100
  xpReward: number;
  itemReward?: string;
  startDate: string;
  endDate?: string;
  steps: QuestStep[];
  completed: boolean;
}

export interface NewQuestInput {
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: QuestDifficulty;
  endDate?: string;
  steps: {
    title: string;
    description?: string;
  }[];
}