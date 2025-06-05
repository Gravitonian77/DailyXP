import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { Quest } from '@/types/Quest';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface DailyQuestProps {
  quest: Quest;
}

const DailyQuest: React.FC<DailyQuestProps> = ({ quest }) => {
  const { isDark } = useTheme();
  
  const getDifficultyColors = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return [Colors.primary[400], Colors.primary[600]];
      case 'medium': return [Colors.secondary[400], Colors.secondary[600]];
      case 'hard': return [Colors.accent[400], Colors.accent[600]];
      case 'legendary': return [Colors.special.legendary, '#c2410c'];
      default: return [Colors.primary[400], Colors.primary[600]];
    }
  };
  
  const handlePress = () => {
    router.push(`/quests/${quest.id}`);
  };
  
  const difficultyColors = getDifficultyColors(quest.difficulty);
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient
        colors={difficultyColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {quest.title}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${quest.progress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {quest.progress}% Complete
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.stepsText}>
              {quest.steps.filter(step => step.completed).length}/{quest.steps.length} steps
            </Text>
            <Text style={styles.xpText}>
              +{quest.xpReward} XP
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Elevation.md,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: Spacing.sm,
  },
  progressContainer: {
    marginBottom: Spacing.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.full,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  xpText: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 14,
    color: '#fff',
  },
});

export default DailyQuest;