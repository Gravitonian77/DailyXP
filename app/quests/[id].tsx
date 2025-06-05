import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuests } from '@/hooks/useQuests';
import { useUser } from '@/contexts/UserContext';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { Quest, QuestStep } from '@/types/Quest';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CheckCircle2, Circle, Trophy, Calendar, AlarmClock } from 'lucide-react-native';
import { Platform } from 'react-native';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';
import { format, isAfter } from 'date-fns';

export default function QuestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { quests, completeQuestStep, getQuest } = useQuests();
  const { addXP } = useUser();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [completedStep, setCompletedStep] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundQuest = getQuest(id);
      if (foundQuest) {
        setQuest(foundQuest);
      }
    }
  }, [id, quests]);
  
  const handleStepComplete = (stepId: string) => {
    if (!quest) return;
    
    // Find the step to get its XP value
    const step = quest.steps.find(s => s.id === stepId);
    if (!step) return;
    
    // Mark step as completed
    completeQuestStep(quest.id, stepId);
    
    // Add the XP for completing this step
    addXP(step.xpValue, quest.category);
    
    // Show completion animation
    setCompletedStep(stepId);
    setTimeout(() => {
      setCompletedStep(null);
    }, 2000);
  };
  
  if (!quest) {
    return (
      <View style={[
        styles.container, 
        { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] }
      ]}>
        <Text style={[
          Typography.body1,
          { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
        ]}>
          Quest not found
        </Text>
      </View>
    );
  }
  
  const getDifficultyColors = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return [Colors.primary[400], Colors.primary[600]];
      case 'medium': return [Colors.secondary[400], Colors.secondary[600]];
      case 'hard': return [Colors.accent[400], Colors.accent[600]];
      case 'legendary': return [Colors.special.legendary, '#c2410c'];
      default: return [Colors.primary[400], Colors.primary[600]];
    }
  };
  
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
  
  const isStepCompleted = (step: QuestStep) => step.completed;
  const difficultyColors = getDifficultyColors(quest.difficulty);
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] }
    ]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <LinearGradient
        colors={difficultyColors}
        style={styles.header}
      >
        <Animated.View 
          entering={FadeIn.delay(100).duration(400)}
          style={styles.headerControls}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.questInfo}
        >
          <Text style={styles.questTitle}>{quest.title}</Text>
          
          <View style={styles.questMeta}>
            <View style={[
              styles.categoryTag, 
              { backgroundColor: `${getCategoryColor(quest.category)}40` }
            ]}>
              <Text style={[styles.categoryText, { color: '#fff' }]}>
                {quest.category}
              </Text>
            </View>
            
            <View style={styles.xpTag}>
              <Trophy size={14} color="#fff" />
              <Text style={styles.xpText}>
                {quest.xpReward} XP
              </Text>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInUp.delay(300).duration(400)}
          style={styles.progressSection}
        >
          <View style={styles.progressBarContainer}>
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
        </Animated.View>
      </LinearGradient>
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInUp.delay(400).duration(400)}
          style={[
            styles.descriptionContainer,
            { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }
          ]}
        >
          <Text style={[
            Typography.h4,
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
            Description
          </Text>
          <Text style={[
            Typography.body1,
            { 
              color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary,
              marginTop: Spacing.xs,
            }
          ]}>
            {quest.description}
          </Text>
          
          {quest.endDate && (
            <View style={styles.deadlineContainer}>
              <Calendar size={18} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
              <Text style={[
                Typography.caption,
                { 
                  color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary,
                  marginLeft: Spacing.xs,
                }
              ]}>
                Due by {format(new Date(quest.endDate), 'MMMM d, yyyy')}
              </Text>
            </View>
          )}
        </Animated.View>
        
        <Animated.View 
          entering={FadeInUp.delay(500).duration(400)}
          style={styles.stepsContainer}
        >
          <Text style={[
            Typography.h4,
            { 
              color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
              marginBottom: Spacing.md,
            }
          ]}>
            Quest Steps
          </Text>
          
          {quest.steps.map((step, index) => (
            <Animated.View 
              key={step.id}
              entering={FadeInUp.delay(500 + (index * 100)).duration(400)}
              layout={Layout.springify()}
              style={[
                styles.stepItem,
                { 
                  backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
                  opacity: step.completed ? 0.8 : 1,
                },
                step.id === completedStep && styles.completedStepHighlight,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.stepCheckbox,
                  {
                    backgroundColor: step.completed 
                      ? Colors.success[500]
                      : 'transparent',
                    borderColor: step.completed 
                      ? Colors.success[500]
                      : isDark ? Colors.neutral[700] : Colors.neutral[300],
                  }
                ]}
                onPress={() => !step.completed && handleStepComplete(step.id)}
                disabled={step.completed}
              >
                {step.completed ? (
                  <CheckCircle2 size={20} color="#fff" />
                ) : (
                  <Circle size={20} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                )}
              </TouchableOpacity>
              
              <View style={styles.stepContent}>
                <Text style={[
                  Typography.subtitle1,
                  {
                    color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
                    textDecorationLine: step.completed ? 'line-through' : 'none',
                  }
                ]}>
                  {step.title}
                </Text>
                
                {step.description ? (
                  <Text style={[
                    Typography.caption,
                    {
                      color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary,
                      textDecorationLine: step.completed ? 'line-through' : 'none',
                    }
                  ]}>
                    {step.description}
                  </Text>
                ) : null}
                
                <View style={styles.stepMeta}>
                  <Text style={styles.stepXP}>
                    +{step.xpValue} XP
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
        
        {quest.completed ? (
          <Animated.View 
            entering={FadeInUp.delay(600).duration(400)}
            style={[
              styles.completionCard,
              { backgroundColor: Colors.success[500] }
            ]}
          >
            <Trophy size={24} color="#fff" />
            <Text style={styles.completionTitle}>Quest Completed!</Text>
            <Text style={styles.completionText}>
              You've earned {quest.xpReward} XP for completing this quest.
            </Text>
          </Animated.View>
        ) : (
          <View style={{ height: 100 }} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerControls: {
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questInfo: {
    marginBottom: Spacing.md,
  },
  questTitle: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  xpTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
  },
  progressSection: {
    marginTop: Spacing.sm,
  },
  progressBarContainer: {
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
    color: '#fff',
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
    paddingTop: Spacing.xl,
  },
  descriptionContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  stepsContainer: {
    marginBottom: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Elevation.sm,
  },
  stepCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  stepXP: {
    fontFamily: 'PixelifySans',
    fontSize: 12,
    color: Colors.primary[600],
  },
  completedStepHighlight: {
    borderWidth: 2,
    borderColor: Colors.success[500],
  },
  completionCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  completionTitle: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 20,
    color: '#fff',
    marginTop: Spacing.sm,
  },
  completionText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});