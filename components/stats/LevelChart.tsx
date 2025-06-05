import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface LevelChartProps {
  currentXP: number;
  xpToNextLevel: number;
  height: number;
  isDark: boolean;
}

const LevelChart: React.FC<LevelChartProps> = ({ 
  currentXP, 
  xpToNextLevel, 
  height,
  isDark
}) => {
  const progress = useSharedValue(0);
  
  useEffect(() => {
    progress.value = withTiming(currentXP / xpToNextLevel, { duration: 1000 });
  }, [currentXP, xpToNextLevel]);
  
  // Chart dimensions and calculations
  const chartPadding = 20;
  const barHeight = 30;
  const chartWidth = '100%';
  
  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  
  // Calculate milestone positions (25%, 50%, 75%, 100%)
  const milestones = [0.25, 0.5, 0.75, 1];
  
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartContainer}>
        <View style={styles.xpValues}>
          <Text style={[
            Typography.subtitle2,
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
            {currentXP} XP
          </Text>
          <Text style={[
            Typography.subtitle2,
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
            {xpToNextLevel} XP
          </Text>
        </View>
        
        <View style={[
          styles.progressBarContainer,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]}>
          <Animated.View 
            style={[
              styles.progressBar,
              { backgroundColor: Colors.primary[600] },
              animatedProgressStyle
            ]}
          />
          
          {/* Milestone markers */}
          {milestones.map((milestone, index) => (
            <View 
              key={index}
              style={[
                styles.milestoneMark,
                { left: `${milestone * 100}%` }
              ]}
            />
          ))}
        </View>
        
        <View style={styles.milestoneLabels}>
          {milestones.map((milestone, index) => (
            <Text 
              key={index}
              style={[
                styles.milestoneText,
                { 
                  left: `${milestone * 100}%`, 
                  color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary 
                }
              ]}
            >
              {milestone * 100}%
            </Text>
          ))}
        </View>
        
        <View style={styles.currentPercentage}>
          <Text style={[
            Typography.h3,
            { 
              color: Colors.primary[600] 
            }
          ]}>
            {Math.round((currentXP / xpToNextLevel) * 100)}%
          </Text>
          <Text style={[
            Typography.body2,
            { 
              color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary 
            }
          ]}>
            to Next Level
          </Text>
        </View>
        
        <View style={styles.xpRemainingContainer}>
          <Text style={[
            Typography.caption,
            { 
              color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary 
            }
          ]}>
            {xpToNextLevel - currentXP} XP remaining
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  xpValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 20,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  milestoneMark: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  milestoneLabels: {
    position: 'relative',
    height: 20,
  },
  milestoneText: {
    position: 'absolute',
    top: 0,
    fontSize: 10,
    fontFamily: 'Inter',
    transform: [{ translateX: -12 }],
  },
  currentPercentage: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  xpRemainingContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
});

export default LevelChart;