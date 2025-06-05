import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { Quest } from '@/types/Quest';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Clock, Check } from 'lucide-react-native';
import { format, isAfter } from 'date-fns';

interface QuestCardProps {
  quest: Quest;
  onPress: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onPress }) => {
  const { isDark } = useTheme();
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return Colors.xp.health;
      case 'work': return Colors.xp.work;
      case 'creativity': return Colors.xp.creativity;
      case 'social': return Colors.xp.social;
      case 'learning': return Colors.xp.learning;
      default: return Colors.xp.base;
    }
  };
  
  const getDifficultyColors = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return [Colors.primary[400], Colors.primary[600]];
      case 'medium': return [Colors.secondary[400], Colors.secondary[600]];
      case 'hard': return [Colors.accent[400], Colors.accent[600]];
      case 'legendary': return [Colors.special.legendary, '#c2410c'];
      default: return [Colors.primary[400], Colors.primary[600]];
    }
  };
  
  const getTimeStatus = () => {
    if (!quest.endDate) return null;
    
    const endDate = new Date(quest.endDate);
    const isOverdue = isAfter(new Date(), endDate) && !quest.completed;
    
    if (quest.completed) {
      return {
        label: 'Completed',
        color: Colors.success[500],
        icon: <Check size={14} color={Colors.success[500]} />
      };
    } else if (isOverdue) {
      return {
        label: 'Overdue',
        color: Colors.error[500],
        icon: <Clock size={14} color={Colors.error[500]} />
      };
    } else {
      return {
        label: `Due ${format(endDate, 'MMM d')}`,
        color: Colors.neutral[500],
        icon: <Clock size={14} color={Colors.neutral[500]} />
      };
    }
  };
  
  const timeStatus = getTimeStatus();
  const categoryColor = getCategoryColor(quest.category);
  const difficultyColors = getDifficultyColors(quest.difficulty);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
          opacity: quest.completed ? 0.8 : 1,
        },
        Elevation.md
      ]}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={difficultyColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.difficultyBadge}
        >
          <Trophy size={12} color="#fff" />
          <Text style={styles.difficultyText}>
            {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
          </Text>
        </LinearGradient>
        
        <View style={[styles.categoryTag, { backgroundColor: `${categoryColor}30` }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {quest.category}
          </Text>
        </View>
      </View>
      
      <Text style={[
        Typography.h4,
        { 
          color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
          marginBottom: Spacing.xs,
        }
      ]}>
        {quest.title}
      </Text>
      
      <Text style={[
        Typography.body2,
        { 
          color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary,
          marginBottom: Spacing.md,
        }
      ]}
      numberOfLines={2}
      >
        {quest.description}
      </Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar,
              {
                width: `${quest.progress}%`,
                backgroundColor: quest.completed ? Colors.success[500] : difficultyColors[0]
              }
            ]}
          />
        </View>
        <Text style={[
          Typography.caption,
          { color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary }
        ]}>
          {quest.progress}% Complete
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.stepsInfo}>
          <Text style={[
            Typography.caption,
            { color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary }
          ]}>
            {quest.steps.filter(step => step.completed).length}/{quest.steps.length} steps
          </Text>
        </View>
        
        <View style={styles.questMeta}>
          {timeStatus && (
            <View style={styles.timeStatus}>
              {timeStatus.icon}
              <Text style={[
                styles.timeStatusText,
                { color: timeStatus.color }
              ]}>
                {timeStatus.label}
              </Text>
            </View>
          )}
          
          <Text style={styles.xpReward}>
            +{quest.xpReward} XP
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  difficultyText: {
    color: '#fff',
    fontFamily: 'PixelifySans',
    fontSize: 12,
    marginLeft: 4,
  },
  categoryTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: Spacing.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: BorderRadius.full,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  timeStatusText: {
    fontFamily: 'Inter',
    fontSize: 12,
    marginLeft: 4,
  },
  xpReward: {
    fontFamily: 'PixelifySans',
    fontSize: 12,
    color: Colors.primary[600],
  },
});

export default QuestCard;