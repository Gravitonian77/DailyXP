export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type TaskType = 'daily' | 'habit' | 'one-time';
export type TaskCategory = 'health' | 'work' | 'creativity' | 'social' | 'learning';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  xpValue: number;
  completed: boolean;
  dueDate?: string;
  completedDate?: string;
  streakCount?: number;
  repeatDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  remindTime?: string;
  tags?: string[];
  subTasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface NewTaskInput {
  title: string;
  description?: string;
  type: TaskType;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  dueDate?: string;
  repeatDays?: number[];
  remindTime?: string;
  tags?: string[];
  subTasks?: {
    title: string;
  }[];
}