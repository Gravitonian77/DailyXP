import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { useUser } from '@/contexts/UserContext';
import { useTasks } from '@/hooks/useTasks';
import { useQuests } from '@/hooks/useQuests';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, Calendar, Circle, Target, TrendingUp } from 'lucide-react-native';
import StatsCard from '@/components/stats/StatsCard';
import CategoryBreakdown from '@/components/stats/CategoryBreakdown';
import { useState } from 'react';
import CompletionChart from '@/components/stats/CompletionChart';
import LevelChart from '@/components/stats/LevelChart';
import { formatDistance } from 'date-fns';

const CHART_HEIGHT = 200;

export default function StatsScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useUser();
  const { tasks } = useTasks();
  const { quests } = useQuests();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate stats
  const tasksCompleted = tasks.filter(task => task.completed).length;
  const tasksTotal = tasks.length;
  const questsCompleted = quests.filter(quest => quest.completed).length;
  const questsTotal = quests.length;
  
  const completionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
  
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
  
  const renderTimeButton = (label: string, value: 'week' | 'month' | 'year') => (
    <TouchableOpacity
      style={[
        styles.timeButton,
        timeRange === value && { backgroundColor: isDark ? Colors.primary[700] : Colors.primary[600] }
      ]}
      onPress={() => setTimeRange(value)}
    >
      <Text style={[
        styles.timeButtonText,
        timeRange === value && { color: '#fff' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] }]}>
      <LinearGradient
        colors={[Colors.accent[500], Colors.accent[700]]}
        style={styles.header}
      >
        <Animated.View 
          entering={FadeIn.delay(100).duration(400)}
          style={styles.headerContent}
        >
          <Text style={[Typography.h2, styles.headerTitle]}>
            Your Stats
          </Text>
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
            textColor={isDark ? Colors.text.dark.primary : Colors.text.light.primary}
          />
          
          <StatsCard
            title="XP Gained"
            value={`+${getXpForPeriod()}`}
            icon={<TrendingUp size={20} color={Colors.primary[500]} />}
            backgroundColor={isDark ? Colors.neutral[900] : Colors.neutral[50]}
            textColor={isDark ? Colors.text.dark.primary : Colors.text.light.primary}
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
            textColor={isDark ? Colors.text.dark.primary : Colors.text.light.primary}
          />
          
          <StatsCard
            title="Next Level"
            value={calculateTimeToNextLevel()}
            icon={<Calendar size={20} color={Colors.primary[500]} />}
            backgroundColor={isDark ? Colors.neutral[900] : Colors.neutral[50]}
            textColor={isDark ? Colors.text.dark.primary : Colors.text.light.primary}
          />
        </Animated.View>
        
        {/* Completion Rate Chart */}
        <Animated.View 
          entering={FadeInUp.delay(500).duration(400)}
          style={[
            styles.chartContainer,
            { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }
          ]}
        >
          <Text style={[
            Typography.h4, 
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
            Completion Rate
          </Text>
          <CompletionChart 
            completionRate={completionRate} 
            height={CHART_HEIGHT}
            isDark={isDark}
          />
        </Animated.View>
        
        {/* Level Progress Chart */}
        <Animated.View 
          entering={FadeInUp.delay(600).duration(400)}
          style={[
            styles.chartContainer,
            { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }
          ]}
        >
          <Text style={[
            Typography.h4, 
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
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
            { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }
          ]}
        >
          <Text style={[
            Typography.h4, 
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
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
    </View>
  );
}

import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckCircle2 } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    flexDirection: 'column',
  },
  headerTitle: {
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter',
    fontSize: 14,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: Spacing.md,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  chartContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
});