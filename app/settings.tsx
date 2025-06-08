import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

export default function SettingsScreen() {
  const { isDark } = useTheme();
  const {
    notificationsEnabled,
    dailyReminders,
    streakAlerts,
    achievementAlerts,
    reminderTime,
    setNotificationsEnabled,
    setDailyReminders,
    setStreakAlerts,
    setAchievementAlerts,
    setReminderTime,
  } = useNotificationPreferences();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View
      style={[
        styles.settingItem,
        { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] },
      ]}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text
          style={[
            Typography.subtitle1,
            {
              color: isDark
                ? Colors.text.dark.primary
                : Colors.text.light.primary,
              marginBottom: 4,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            Typography.caption,
            {
              color: isDark
                ? Colors.text.dark.tertiary
                : Colors.text.light.tertiary,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.neutral[400], true: Colors.primary[500] }}
        thumbColor={value ? Colors.primary[600] : Colors.neutral[200]}
      />
    </View>
  );

  const handleNotificationToggle = async (value: boolean) => {
    if (isExpoGo) {
      alert(
        'Push notifications are not supported in Expo Go. Please use a development build.'
      );
      return;
    }
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    }
    setNotificationsEnabled(value);
  };

  // Add support/feedback handlers
  const handleContactSupport = () => {
    Linking.openURL('mailto:support@dailyxp.app?subject=Support Request');
  };
  const handleReportBug = () => {
    Linking.openURL('mailto:support@dailyxp.app?subject=Bug Report');
  };
  const handleSendFeedback = () => {
    Linking.openURL('mailto:support@dailyxp.app?subject=App Feedback');
  };

  const handleOpenLicenses = () => {
    // Replace with your actual licenses or GitHub URL
    Linking.openURL('https://github.com/your-repo-url');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft
            size={24}
            color={
              isDark ? Colors.text.dark.primary : Colors.text.light.primary
            }
          />
        </TouchableOpacity>
        <Text
          style={[
            Typography.h4,
            {
              color: isDark
                ? Colors.text.dark.primary
                : Colors.text.light.primary,
            },
          ]}
        >
          Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text
            style={[
              Typography.overline,
              styles.sectionTitle,
              {
                color: isDark
                  ? Colors.text.dark.tertiary
                  : Colors.text.light.tertiary,
              },
            ]}
          >
            NOTIFICATIONS
          </Text>

          {renderSettingItem(
            <Bell size={24} color={Colors.primary[500]} />,
            'Enable Notifications',
            'Receive notifications about your progress and achievements',
            notificationsEnabled,
            handleNotificationToggle
          )}

          {notificationsEnabled && (
            <>
              {renderSettingItem(
                <Bell size={24} color={Colors.primary[500]} />,
                'Daily Reminders',
                'Get reminded to complete your daily tasks',
                dailyReminders,
                setDailyReminders
              )}
              {dailyReminders && (
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={[
                    styles.settingItem,
                    { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] },
                  ]}
                >
                  <View style={styles.settingIcon} />
                  <View style={styles.settingContent}>
                    <Text
                      style={[
                        Typography.subtitle1,
                        {
                          color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
                          marginBottom: 4,
                        },
                      ]}
                    >
                      Reminder Time
                    </Text>
                    <Text
                      style={[
                        Typography.caption,
                        {
                          color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary,
                        },
                      ]}
                    >
                      {reminderTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {renderSettingItem(
                <Bell size={24} color={Colors.primary[500]} />,
                'Streak Alerts',
                'Get notified when your streak is at risk',
                streakAlerts,
                setStreakAlerts
              )}

              {renderSettingItem(
                <Bell size={24} color={Colors.primary[500]} />,
                'Achievement Alerts',
                'Get notified when you earn new achievements',
                achievementAlerts,
                setAchievementAlerts
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              Typography.overline,
              styles.sectionTitle,
              {
                color: isDark
                  ? Colors.text.dark.tertiary
                  : Colors.text.light.tertiary,
              },
            ]}
          >
            SUPPORT & FEEDBACK
          </Text>
          <TouchableOpacity
            onPress={handleContactSupport}
            style={styles.settingItem}
          >
            <View style={styles.settingIcon}>
              <Bell size={24} color={Colors.primary[500]} />
            </View>
            <View style={styles.settingContent}>
              <Text
                style={[
                  Typography.subtitle1,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                    marginBottom: 4,
                  },
                ]}
              >
                Contact Support
              </Text>
              <Text
                style={[
                  Typography.caption,
                  {
                    color: isDark
                      ? Colors.text.dark.tertiary
                      : Colors.text.light.tertiary,
                  },
                ]}
              >
                Email our support team for help
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReportBug}
            style={styles.settingItem}
          >
            <View style={styles.settingIcon}>
              <Bell size={24} color={Colors.primary[500]} />
            </View>
            <View style={styles.settingContent}>
              <Text
                style={[
                  Typography.subtitle1,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                    marginBottom: 4,
                  },
                ]}
              >
                Report a Bug
              </Text>
              <Text
                style={[
                  Typography.caption,
                  {
                    color: isDark
                      ? Colors.text.dark.tertiary
                      : Colors.text.light.tertiary,
                  },
                ]}
              >
                Let us know about any issues
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendFeedback}
            style={styles.settingItem}
          >
            <View style={styles.settingIcon}>
              <Bell size={24} color={Colors.primary[500]} />
            </View>
            <View style={styles.settingContent}>
              <Text
                style={[
                  Typography.subtitle1,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                    marginBottom: 4,
                  },
                ]}
              >
                Send Feedback
              </Text>
              <Text
                style={[
                  Typography.caption,
                  {
                    color: isDark
                      ? Colors.text.dark.tertiary
                      : Colors.text.light.tertiary,
                  },
                ]}
              >
                Share your thoughts about the app
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              Typography.overline,
              styles.sectionTitle,
              {
                color: isDark
                  ? Colors.text.dark.tertiary
                  : Colors.text.light.tertiary,
              },
            ]}
          >
            ABOUT
          </Text>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text
                style={[
                  Typography.subtitle1,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                    marginBottom: 4,
                  },
                ]}
              >
                App Version
              </Text>
              <Text
                style={[
                  Typography.caption,
                  {
                    color: isDark
                      ? Colors.text.dark.tertiary
                      : Colors.text.light.tertiary,
                  },
                ]}
              >
                {Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text
                style={[
                  Typography.subtitle1,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                    marginBottom: 4,
                  },
                ]}
              >
                Credits
              </Text>
              <Text
                style={[
                  Typography.caption,
                  {
                    color: isDark
                      ? Colors.text.dark.tertiary
                      : Colors.text.light.tertiary,
                  },
                ]}
              >
                Made with ❤️ by the DailyXP Team
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={new Date(`1970-01-01T${reminderTime}:00`)}
          onChange={(_, date) => {
            setShowTimePicker(false);
            if (date) {
              const h = date.getHours().toString().padStart(2, '0');
              const m = date.getMinutes().toString().padStart(2, '0');
              setReminderTime(`${h}:${m}`);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Elevation.sm,
  },
  settingIcon: {
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
});
