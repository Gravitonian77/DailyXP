import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { useUser } from '@/contexts/UserContext';
import { useTasks } from '@/hooks/useTasks';
import { useQuests } from '@/hooks/useQuests';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BarChart,
  Calendar,
  Circle,
  Target,
  TrendingUp,
  CheckCircle2,
  Dumbbell,
  BookOpen,
  Users,
  Feather,
  Brain,
  Heart,
} from 'lucide-react-native';
import StatsCard from '@/components/stats/StatsCard';
import CategoryBreakdown from '@/components/stats/CategoryBreakdown';
import { useState } from 'react';
import CompletionChart from '@/components/stats/CompletionChart';
import LevelChart from '@/components/stats/LevelChart';
import { formatDistance } from 'date-fns';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHART_HEIGHT = 200;

const ATTRIBUTE_ICONS = {
  strength: <Dumbbell size={24} color={Colors.primary[500]} />,
  intelligence: <BookOpen size={24} color={Colors.accent[500]} />,
  charisma: <Users size={24} color={Colors.secondary[500]} />,
  dexterity: <Feather size={24} color={Colors.primary[400]} />,
  wisdom: <Brain size={24} color={Colors.accent[700]} />,
  vitality: <Heart size={24} color={Colors.secondary[700]} />,
};

const defaultAttributes = {
  strength: 0,
  intelligence: 0,
  charisma: 0,
  dexterity: 0,
  wisdom: 0,
  vitality: 0,
};

export default function StatsScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useUser();
  const { tasks } = useTasks();
  const { quests } = useQuests();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Calculate stats
  const tasksCompleted = tasks.filter((task) => task.completed).length;
  const tasksTotal = tasks.length;
  const questsCompleted = quests.filter((quest) => quest.completed).length;
  const questsTotal = quests.length;

  const completionRate =
    tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

  // Calculate XP gained in the selected time range
  const getXpForPeriod = () => {
    // For demo purposes, using a random value based on level
    return user.level * 100 + Math.floor(Math.random() * 200);
  };

  // Calculate time to next level
  const calculateTimeToNextLevel = () => {
    const xpNeeded = user.xpToNextLevel - user.currentXP;
    const xpPerDay = 75; // Assuming average XP per day
    const daysToNextLevel = Math.ceil(xpNeeded / xpPerDay);

    // For demo purposes, we're using a fixed date in the future
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToNextLevel);

    return formatDistance(new Date(), targetDate, { addSuffix: true });
  };

  const renderTimeButton = (
    label: string,
    value: 'week' | 'month' | 'year'
  ) => (
    <TouchableOpacity
      style={[
        styles.timeButton,
        timeRange === value && {
          backgroundColor: isDark ? Colors.primary[700] : Colors.primary[600],
        },
      ]}
      onPress={() => setTimeRange(value)}
    >
      <Text
        style={[
          styles.timeButtonText,
          timeRange === value && { color: '#fff' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] },
      ]}
      edges={['top']}
    >
      <LinearGradient
        colors={[Colors.accent[500], Colors.accent[700]]}
        style={styles.header}
      >
        <Animated.View
          entering={FadeIn.delay(100).duration(400)}
          style={styles.headerContent}
        >
          <Text style={[Typography.h2, styles.headerTitle]}>Your Stats</Text>
          <Text style={styles.headerSubtitle}>
            Track your progress and achievements
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Time range selector */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.timeRangeContainer}
        >
          {renderTimeButton('Week', 'week')}
          {renderTimeButton('Month', 'month')}
          {renderTimeButton('Year', 'year')}
        </Animated.View>

        {/* Summary cards */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={styles.summaryCards}
        >
          <StatsCard
            title="Tasks Completed"
            value={`${tasksCompleted}/${tasksTotal}`}
            icon={<CheckCircle2 size={20} color={Colors.secondary[500]} />}
            backgroundColor={isDark ? Colors.neutral[900] : Colors.neutral[50]}
            textColor={
              isDark ? Colors.text.dark.primary : Colors.text.light.primary
            }
          />

          <StatsCard
            title="XP Gained"
            value={`+${getXpForPeriod()}`}
            icon={<TrendingUp size={20} color={Colors.primary[500]} />}
            backgroundColor={isDark ? Colors.neutral[900] : Colors.neutral[50]}
            textColor={
              isDark ? Colors.text.dark.primary : Colors.text.light.primary
            }
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(400)}
          style={styles.summaryCards}
        >
          <StatsCard
            title="Quests"
            value={`${questsCompleted}/${questsTotal}`}
            icon={<Target size={20} color={Colors.accent[500]} />}
            backgroundColor={isDark ? Colors.neutral[900] : Colors.neutral[50]}
            textColor={
              isDark ? Colors.text.dark.primary : Colors.text.light.primary
            }
          />

          <StatsCard
            title="Next Level"
            value={calculateTimeToNextLevel()}
            icon={<Calendar size={20} color={Colors.primary[500]} />}
            backgroundColor={isDark ? Colors.neutral[900] : Colors.neutral[50]}
            textColor={
              isDark ? Colors.text.dark.primary : Colors.text.light.primary
            }
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(350).duration(400)}
          style={[
            styles.attributeSection,
            {
              backgroundColor: isDark
                ? Colors.neutral[900]
                : Colors.neutral[50],
            },
          ]}
        >
          <Text
            style={[
              Typography.h4,
              {
                color: isDark
                  ? Colors.text.dark.primary
                  : Colors.text.light.primary,
                marginBottom: 12,
              },
            ]}
          >
            Attributes
          </Text>
          <View style={styles.attributeRow}>
            {(
              Object.entries(user.attributes ?? defaultAttributes) as [
                keyof typeof ATTRIBUTE_ICONS,
                number
              ][]
            ).map(([key, value]) => (
              <View key={key} style={styles.attributeCard}>
                {ATTRIBUTE_ICONS[key] as React.ReactNode}
                <Text
                  style={[
                    (() => {
                      const { fontWeight, ...rest } = Typography.subtitle2;
                      return rest;
                    })(),
                    {
                      color: isDark
                        ? Colors.text.dark.primary
                        : Colors.text.light.primary,
                      marginTop: 4,
                    },
                    { fontWeight: Platform.OS === 'web' ? 'bold' : 700 },
                  ]}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Text
                  style={[
                    (() => {
                      const { fontWeight, ...rest } = Typography.h3;
                      return rest;
                    })(),
                    {
                      color: isDark
                        ? Colors.text.dark.primary
                        : Colors.text.light.primary,
                    },
                    { fontWeight: Platform.OS === 'web' ? 'bold' : 700 },
                  ]}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Completion Rate Chart */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(400)}
          style={[
            styles.chartContainer,
            {
              backgroundColor: isDark
                ? Colors.neutral[900]
                : Colors.neutral[50],
            },
          ]}
        >
          <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
            <Text
              style={[
                Typography.h4,
                {
                  color: isDark
                    ? Colors.text.dark.primary
                    : Colors.text.light.primary,
                  marginBottom: 0,
                },
              ]}
            >
              Completion Rate
            </Text>
            <Text
              style={[
                Typography.h2,
                {
                  color: isDark
                    ? Colors.text.dark.primary
                    : Colors.text.light.primary,
                  marginTop: 4,
                  marginBottom: 16,
                  textAlign: 'left',
                },
              ]}
            >
              {`${Math.round(completionRate)}%`}
            </Text>
          </View>

          <View
            style={{
              alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
              justifyContent: 'center',
              marginBottom: 12,
              minHeight: CHART_HEIGHT,
            }}
          >
            <CompletionChart
              completionRate={completionRate}
              height={CHART_HEIGHT}
              isDark={isDark}
            />
          </View>
          <View style={{ marginBottom: 12 }} />
        </Animated.View>

        {/* Level Progress Chart */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(400)}
          style={[
            styles.chartContainer,
            {
              backgroundColor: isDark
                ? Colors.neutral[900]
                : Colors.neutral[50],
            },
            { marginBottom: Platform.OS === 'web' ? Spacing.xl : Spacing.lg },
          ]}
        >
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
            Level Progress
          </Text>
          <LevelChart
            currentXP={user.currentXP}
            xpToNextLevel={user.xpToNextLevel}
            height={CHART_HEIGHT}
            isDark={isDark}
          />
        </Animated.View>

        {/* Category Breakdown */}
        <Animated.View
          entering={FadeInUp.delay(700).duration(400)}
          style={[
            styles.chartContainer,
            {
              backgroundColor: isDark
                ? Colors.neutral[900]
                : Colors.neutral[50],
            },
          ]}
        >
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
            XP by Category
          </Text>
          <CategoryBreakdown
            categoryXP={user.categoryXP}
            height={CHART_HEIGHT + 40}
            isDark={isDark}
          />
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'column',
    gap: Platform.OS === 'web' ? 16 : 8,
  },
  headerTitle: {
    color: '#fff',
    marginBottom: Platform.OS === 'web' ? Spacing.md : Spacing.sm,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter',
    fontSize: 14,
    marginBottom: Platform.OS === 'web' ? 16 : 8,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? Spacing.xl : Spacing.md,
    paddingBottom: Platform.OS === 'web' ? 120 : 80,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: Platform.OS === 'web' ? Spacing.lg : Spacing.md,
    gap: Platform.OS === 'web' ? 16 : 8,
  },
  timeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    marginRight: Spacing.sm,
  },
  timeButtonText: {
    fontFamily: 'PixelifySans',
    fontSize: 14,
    color: Colors.primary[600],
  },
  summaryCards: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: Platform.OS === 'web' ? Spacing.lg : Spacing.md,
    gap: Platform.OS === 'web' ? 24 : 12,
  },
  chartContainer: {
    padding: Platform.OS === 'web' ? Spacing.lg : Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Platform.OS === 'web' ? Spacing.xl : Spacing.md,
    ...Elevation.sm,
    minHeight: 260,
  },
  attributeSection: {
    padding: Platform.OS === 'web' ? Spacing.lg : Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Platform.OS === 'web' ? Spacing.xl : Spacing.md,
    ...Elevation.sm,
  },
  attributeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 24 : 12,
  },
  attributeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.06)',
    borderRadius: BorderRadius.md,
    padding: 12,
    minWidth: 90,
    marginBottom: 8,
  },
});
