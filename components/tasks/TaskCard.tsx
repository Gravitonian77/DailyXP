import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { Task } from '@/types/Task';
import { Check, CalendarDays } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const { isDark } = useTheme();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return Colors.xp.health;
      case 'work':
        return Colors.xp.work;
      case 'creativity':
        return Colors.xp.creativity;
      case 'social':
        return Colors.xp.social;
      case 'learning':
        return Colors.xp.learning;
      default:
        return Colors.xp.base;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '★';
      case 'medium':
        return '★★';
      case 'hard':
        return '★★★';
      default:
        return '★';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
          opacity: task.completed ? 0.7 : 1,
        },
        Elevation.sm,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          {
            borderColor: task.completed
              ? getCategoryColor(task.category)
              : isDark
              ? Colors.neutral[700]
              : Colors.neutral[300],
            backgroundColor: task.completed
              ? getCategoryColor(task.category)
              : 'transparent',
          },
        ]}
        onPress={onComplete}
        disabled={task.completed}
      >
        {task.completed ? <Check size={16} color="#fff" /> : null}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            Typography.subtitle1,
            styles.title,
            task.completed && styles.completedText,
            {
              color: isDark
                ? Colors.text.dark.primary
                : Colors.text.light.primary,
              lineHeight: 20,
            },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text
            style={[
              Typography.caption,
              {
                color: isDark
                  ? Colors.text.dark.tertiary
                  : Colors.text.light.tertiary,
                lineHeight: 16,
                marginBottom: 4,
              },
              task.completed && styles.completedText,
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {task.description}
          </Text>
        ) : null}

        <View style={styles.metaContainer}>
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: `${getCategoryColor(task.category)}30` },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(task.category) },
              ]}
            >
              {task.category}
            </Text>
          </View>

          {task.type === 'habit' && (
            <View style={styles.streakTag}>
              <Text style={styles.streakText}>🔥 {task.streakCount || 0}</Text>
            </View>
          )}

          {task.dueDate && (
            <View style={styles.dueTag}>
              <CalendarDays
                size={12}
                color={isDark ? Colors.neutral[400] : Colors.neutral[500]}
              />
              <Text style={styles.dueText}>
                {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.xpTag}>
            <Text style={styles.xpText}>+{task.xpValue} XP</Text>
          </View>

          <Text style={[styles.difficultyText, { color: Colors.accent[500] }]}>
            {getDifficultyLabel(task.difficulty)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  categoryTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  dueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  dueText: {
    fontSize: 10,
    fontFamily: 'Inter',
    opacity: 0.7,
    marginLeft: 2,
  },
  xpTag: {
    marginRight: Spacing.xs,
  },
  xpText: {
    fontSize: 10,
    fontFamily: 'PixelifySans',
    color: Colors.primary[600],
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Inter',
  },
  streakTag: {
    marginRight: Spacing.xs,
  },
  streakText: {
    fontSize: 10,
    fontFamily: 'Inter',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});

export default TaskCard;
