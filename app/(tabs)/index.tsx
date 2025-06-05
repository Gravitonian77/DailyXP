import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { useUser } from '@/contexts/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks } from '@/hooks/useTasks';
import { useQuests } from '@/hooks/useQuests';
import TaskCard from '@/components/tasks/TaskCard';
import DailyQuest from '@/components/quests/DailyQuest';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { user, addXP } = useUser();
  const { tasks, completeTask } = useTasks();
  const { quests } = useQuests();
  const [greeting, setGreeting] = useState('');

  // Set appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Filter daily tasks and most recent quests
  const dailyTasks = tasks
    .filter(
      (task) =>
        !task.completed &&
        (task.type === 'daily' ||
          task.dueDate === new Date().toISOString().split('T')[0])
    )
    .slice(0, 3);

  const activeQuests = quests.filter((quest) => !quest.completed).slice(0, 2);

  // Calculate streak days
  const streakDays = user.streakDays || 0;

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    // Add XP based on task difficulty
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const xpValue =
        task.difficulty === 'easy'
          ? 10
          : task.difficulty === 'medium'
          ? 20
          : 30;
      addXP(xpValue, task.category);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50],
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top header with user info */}
        <LinearGradient
          colors={[Colors.primary[600], Colors.primary[800]]}
          style={styles.header}
        >
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.headerContent}
          >
            <View style={{ flex: 1 }}>
              <Text style={[Typography.h4, styles.greeting]}>{greeting},</Text>
              <Text
                style={[
                  Typography.h2,
                  styles.userName,
                  { flexShrink: 1, lineHeight: 28 },
                ]}
                numberOfLines={2}
              >
                {user.name}
              </Text>
              <View style={styles.levelContainer}>
                <Text style={styles.levelText}>Level {user.level}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={styles.avatarContainer}
            >
              <Image
                source={{
                  uri:
                    user.avatarUrl ||
                    'https://images.pexels.com/photos/7607440/pexels-photo-7607440.jpeg',
                }}
                style={styles.avatar}
              />
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{user.level}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        {/* XP Progress */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={[
            styles.xpCard,
            {
              backgroundColor: isDark
                ? Colors.neutral[900]
                : Colors.neutral[50],
              ...Elevation.md,
            },
          ]}
        >
          <View style={styles.xpHeader}>
            <Text
              style={[
                Typography.h4,
                {
                  color: isDark
                    ? Colors.text.dark.primary
                    : Colors.text.light.primary,
                  flex: 1,
                },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
            >
              Experience
            </Text>
            <View style={styles.xpValue}>
              <Text
                style={[
                  styles.xpValueText,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {user.currentXP}/{user.xpToNextLevel} XP
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${(user.currentXP / user.xpToNextLevel) * 100}%`,
                  backgroundColor: Colors.primary[500],
                },
              ]}
            />
          </View>

          <View style={styles.streakContainer}>
            <View style={styles.streakInfo}>
              <Text
                style={[
                  Typography.subtitle2,
                  styles.streakText,
                  {
                    color: isDark
                      ? Colors.text.dark.secondary
                      : Colors.text.light.secondary,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                🔥 {streakDays} day streak!
              </Text>
            </View>
            <View style={styles.lastActiveInfo}>
              <Text
                style={[
                  Typography.caption,
                  styles.lastActiveText,
                  {
                    color: isDark
                      ? Colors.text.dark.tertiary
                      : Colors.text.light.tertiary,
                  },
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.7}
              >
                Last activity:{' '}
                {formatDistanceToNow(new Date(user.lastActive), {
                  addSuffix: true,
                })}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Daily Tasks Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                Typography.h3,
                {
                  color: isDark
                    ? Colors.text.dark.primary
                    : Colors.text.light.primary,
                  flex: 1,
                },
              ]}
            >
              Daily Tasks
            </Text>
            <TouchableOpacity onPress={() => router.push('/tasks')}>
              <Text
                style={[
                  Typography.button,
                  {
                    color: Colors.primary[600],
                    fontSize: 14,
                  },
                ]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {dailyTasks.length > 0 ? (
            dailyTasks.map((task, index) => (
              <Animated.View
                key={task.id}
                entering={FadeInRight.delay(100 * index).duration(400)}
              >
                <TaskCard
                  task={task}
                  onComplete={() => handleCompleteTask(task.id)}
                />
              </Animated.View>
            ))
          ) : (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: isDark
                    ? Colors.neutral[900]
                    : Colors.neutral[100],
                },
              ]}
            >
              <Text
                style={[
                  Typography.body2,
                  {
                    color: isDark
                      ? Colors.text.dark.secondary
                      : Colors.text.light.secondary,
                  },
                ]}
              >
                No tasks for today! Add new tasks to earn XP.
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/tasks')}
              >
                <Text style={styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Active Quests Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                Typography.h3,
                {
                  color: isDark
                    ? Colors.text.dark.primary
                    : Colors.text.light.primary,
                  flex: 1,
                },
              ]}
            >
              Active Quests
            </Text>
            <TouchableOpacity onPress={() => router.push('/quests')}>
              <Text
                style={[
                  Typography.button,
                  {
                    color: Colors.primary[600],
                    fontSize: 14,
                  },
                ]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {activeQuests.length > 0 ? (
            activeQuests.map((quest, index) => (
              <Animated.View
                key={quest.id}
                entering={FadeInRight.delay(100 * index).duration(400)}
              >
                <DailyQuest quest={quest} />
              </Animated.View>
            ))
          ) : (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: isDark
                    ? Colors.neutral[900]
                    : Colors.neutral[100],
                },
              ]}
            >
              <Text
                style={[
                  Typography.body2,
                  {
                    color: isDark
                      ? Colors.text.dark.secondary
                      : Colors.text.light.secondary,
                  },
                ]}
              >
                No active quests! Start a new quest to level up faster.
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/quests')}
              >
                <Text style={styles.addButtonText}>Start Quest</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingTop: Spacing.xs,
  },
  header: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    marginHorizontal: -Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: Spacing.sm,
    flexShrink: 1,
  },
  userName: {
    color: '#fff',
    marginBottom: Spacing.lg,
  },
  levelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#fff',
    fontFamily: 'PixelifySans',
    fontSize: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.accent[500],
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelBadgeText: {
    color: '#fff',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 12,
  },
  xpCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    minHeight: 24, // Ensures consistent height
  },
  xpValue: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.full,
    minWidth: 80, // Minimum width to prevent squishing
    maxWidth: 120, // Maximum width to prevent taking too much space
  },
  xpValueText: {
    fontSize: 14,
    fontFamily: 'PixelifySans-Bold',
    textAlign: 'center',
  },
  progressContainer: {
    height: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
    //marginBottom: Spacing.xs,
  },
  streakContainer: {
    flexDirection: 'column', // Changed to column for better mobile layout
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  streakInfo: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastActiveInfo: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  lastActiveText: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  emptyState: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'PixelifySans',
    fontSize: 14,
  },
});
