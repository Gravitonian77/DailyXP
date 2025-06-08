import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';

interface Preferences {
  notificationsEnabled: boolean;
  dailyReminders: boolean;
  reminderTime: string; // ISO time string HH:MM
  streakAlerts: boolean;
  achievementAlerts: boolean;
}

interface PrefContextType extends Preferences {
  setNotificationsEnabled: (v: boolean) => void;
  setDailyReminders: (v: boolean) => void;
  setReminderTime: (time: string) => void;
  setStreakAlerts: (v: boolean) => void;
  setAchievementAlerts: (v: boolean) => void;
}

const PrefContext = createContext<PrefContextType | undefined>(undefined);

const PREFS_KEY = 'dailyxp_notification_prefs';
const REMINDER_ID_KEY = 'dailyxp_daily_reminder_id';

const secureStoreWeb = {
  getItem: async (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: async (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  deleteItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

const store = Platform.OS === 'web' ? secureStoreWeb : SecureStore;

export function NotificationPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>({
    notificationsEnabled: false,
    dailyReminders: false,
    reminderTime: '09:00',
    streakAlerts: false,
    achievementAlerts: false,
  });
  const [reminderId, setReminderId] = useState<string | null>(null);

  // Load saved preferences
  useEffect(() => {
    (async () => {
      const saved = await store.getItem(PREFS_KEY);
      if (saved) {
        setPrefs(JSON.parse(saved));
      }
      const id = await store.getItem(REMINDER_ID_KEY);
      if (id) setReminderId(id);
    })();
  }, []);

  const savePrefs = useCallback(async (updated: Preferences) => {
    setPrefs(updated);
    await store.setItem(PREFS_KEY, JSON.stringify(updated));
  }, []);

  const cancelReminder = useCallback(async () => {
    if (reminderId) {
      await Notifications.cancelScheduledNotificationAsync(reminderId);
      await store.deleteItem(REMINDER_ID_KEY);
      setReminderId(null);
    }
  }, [reminderId]);

  const scheduleReminder = useCallback(
    async (time: string) => {
      await cancelReminder();
      const [hour, minute] = time.split(':').map((t) => parseInt(t, 10));
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Reminder',
          body: "Don't forget to complete your tasks today!",
        },
        trigger: { hour, minute, repeats: true },
      });
      await store.setItem(REMINDER_ID_KEY, id);
      setReminderId(id);
    },
    [cancelReminder]
  );

  // React to preference changes
  useEffect(() => {
    (async () => {
      if (prefs.notificationsEnabled && prefs.dailyReminders) {
        await scheduleReminder(prefs.reminderTime);
      } else {
        await cancelReminder();
      }
    })();
  }, [prefs.notificationsEnabled, prefs.dailyReminders, prefs.reminderTime, scheduleReminder, cancelReminder]);

  const setNotificationsEnabled = async (v: boolean) => {
    if (v) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
    } else {
      await cancelReminder();
    }
    savePrefs({ ...prefs, notificationsEnabled: v });
  };

  const setDailyReminders = (v: boolean) => savePrefs({ ...prefs, dailyReminders: v });
  const setReminderTime = (time: string) => savePrefs({ ...prefs, reminderTime: time });
  const setStreakAlerts = (v: boolean) => savePrefs({ ...prefs, streakAlerts: v });
  const setAchievementAlerts = (v: boolean) => savePrefs({ ...prefs, achievementAlerts: v });

  return (
    <PrefContext.Provider
      value={{
        ...prefs,
        setNotificationsEnabled,
        setDailyReminders,
        setReminderTime,
        setStreakAlerts,
        setAchievementAlerts,
      }}
    >
      {children}
    </PrefContext.Provider>
  );
}

export function useNotificationPreferences() {
  const ctx = useContext(PrefContext);
  if (!ctx) throw new Error('useNotificationPreferences must be used within provider');
  return ctx;
}
