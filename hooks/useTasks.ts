import { useState, useEffect } from 'react';
import { Task, NewTaskInput } from '@/types/Task';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
import { supabase } from '@/lib/supabase';

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

// Initial sample tasks
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Workout',
    description: 'Complete a 30-minute morning workout routine',
    type: 'daily',
    category: 'health',
    difficulty: 'medium',
    xpValue: 20,
    completed: false,
    streakCount: 3,
    repeatDays: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    id: '2',
    title: 'Read 30 minutes',
    description: 'Read a book for at least 30 minutes',
    type: 'habit',
    category: 'learning',
    difficulty: 'easy',
    xpValue: 10,
    completed: false,
    streakCount: 5,
  },
  {
    id: '3',
    title: 'Complete project presentation',
    description: 'Finish slides for the client meeting',
    type: 'one-time',
    category: 'work',
    difficulty: 'hard',
    xpValue: 30,
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load tasks from storage on initial load
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id);

          if (!error && data) {
            setTasks(data as Task[]);
            await secureStore.setItem('dailyxp_tasks', JSON.stringify(data));
            return;
          }
        }

        const tasksData = await secureStore.getItem('dailyxp_tasks');
        if (tasksData) {
          setTasks(JSON.parse(tasksData));
        } else {
          setTasks(sampleTasks);
          await secureStore.setItem('dailyxp_tasks', JSON.stringify(sampleTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
        const tasksData = await secureStore.getItem('dailyxp_tasks');
        if (tasksData) {
          setTasks(JSON.parse(tasksData));
        } else {
          setTasks(sampleTasks);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);
  
  // Save tasks whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      if (!loading) {
        try {
          await secureStore.setItem('dailyxp_tasks', JSON.stringify(tasks));
        } catch (error) {
          console.error('Failed to save tasks:', error);
        }
      }
    };
    
    saveTasks();
  }, [tasks, loading]);
  
  // Calculate XP value based on task difficulty
  const calculateXpValue = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 10;
    }
  };
  
  // Add a new task
  const addTask = (taskInput: NewTaskInput): Task => {
    const xpValue = calculateXpValue(taskInput.difficulty);
    
    const newTask: Task = {
      id: uuid.v4() as string,
      title: taskInput.title,
      description: taskInput.description || '',
      type: taskInput.type,
      category: taskInput.category,
      difficulty: taskInput.difficulty,
      xpValue,
      completed: false,
      dueDate: taskInput.dueDate,
      repeatDays: taskInput.repeatDays,
      remindTime: taskInput.remindTime,
      tags: taskInput.tags,
      streakCount: 0,
      subTasks: taskInput.subTasks?.map(subTask => ({
        id: uuid.v4() as string,
        title: subTask.title,
        completed: false
      }))
    };
    
    setTasks((prevTasks) => [...prevTasks, newTask]);

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('tasks')
            .insert({ ...newTask, user_id: user.id });
        }
      } catch (error) {
        console.error('Failed to save task to Supabase:', error);
      }
    })();

    return newTask;
  };
  
  // Update a task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    let updatedTask: Task | null = null;
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          updatedTask = { ...task, ...updates };
          return updatedTask;
        }
        return task;
      })
    );

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && updatedTask) {
          await supabase
            .from('tasks')
            .update(updatedTask)
            .eq('id', taskId)
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Failed to update task in Supabase:', error);
      }
    })();
  };
  
  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Failed to delete task from Supabase:', error);
      }
    })();
  };
  
  // Mark a task as complete
  const completeTask = (taskId: string) => {
    let newTask: Task | null = null;
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          newTask = {
            ...task,
            completed: true,
            completedDate: new Date().toISOString(),
          };

          if (task.type === 'habit' || task.type === 'daily') {
            newTask.streakCount = (task.streakCount || 0) + 1;
          }

          return newTask;
        }
        return task;
      })
    );

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && newTask) {
          await supabase
            .from('tasks')
            .update(newTask)
            .eq('id', taskId)
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Failed to mark task complete in Supabase:', error);
      }
    })();
  };
  
  // Reset task completion for daily/habit tasks
  const resetDailyTasks = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    let updated: Task[] = [];
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        // Only reset daily tasks
        if (task.type === 'daily') {
          // Check if the task should repeat today
          const shouldRepeatToday = task.repeatDays?.includes(today) ?? true;

          if (shouldRepeatToday) {
            const res = { ...task, completed: false };
            updated.push(res);
            return res;
          }
        }

        // For habits, always reset
        if (task.type === 'habit') {
          const res = { ...task, completed: false };
          updated.push(res);
          return res;
        }

        return task;
      })
    );

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && updated.length) {
          const updates = updated.map((t) =>
            supabase
              .from('tasks')
              .update({ completed: false })
              .eq('id', t.id)
              .eq('user_id', user.id)
          );
          await Promise.all(updates);
        }
      } catch (error) {
        console.error('Failed to reset tasks in Supabase:', error);
      }
    })();
  };
  
  // Complete a subtask
  const completeSubTask = (taskId: string, subTaskId: string) => {
    let updatedTask: Task | null = null;
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId && task.subTasks) {
          const updatedSubTasks = task.subTasks.map((subTask) =>
            subTask.id === subTaskId ? { ...subTask, completed: true } : subTask
          );

          const allSubTasksCompleted = updatedSubTasks.every(
            (subTask) => subTask.completed
          );

          updatedTask = {
            ...task,
            subTasks: updatedSubTasks,
            completed: allSubTasksCompleted,
          };
          return updatedTask;
        }
        return task;
      })
    );

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && updatedTask) {
          await supabase
            .from('tasks')
            .update({ subTasks: updatedTask.subTasks, completed: updatedTask.completed })
            .eq('id', taskId)
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Failed to update subtask in Supabase:', error);
      }
    })();
  };
  
  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    resetDailyTasks,
    completeSubTask
  };
};