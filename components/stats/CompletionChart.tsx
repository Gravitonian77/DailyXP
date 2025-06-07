import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface CompletionChartProps {
  completionRate: number;
  height: number;
  isDark: boolean;
}

const CompletionChart: React.FC<CompletionChartProps> = ({
  completionRate,
  height,
  isDark,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(completionRate / 100, { duration: 1000 });
  }, [completionRate]);

  const circleRadius = height / 2 - 10;
  const circumference = 2 * Math.PI * circleRadius;

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  // Determine color based on completion rate
  const getCompletionColor = () => {
    if (completionRate >= 75) return Colors.success[500];
    if (completionRate >= 50) return Colors.primary[500];
    if (completionRate >= 25) return Colors.warning[500];
    return Colors.error[500];
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.chartContainer}>
        <Svg height={height} width="100%" viewBox={`0 0 ${height} ${height}`}>
          {/* Background circle */}
          <Circle
            cx={height / 2}
            cy={height / 2}
            r={circleRadius}
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
            strokeWidth={10}
            fill="transparent"
          />

          {/* Progress circle */}
          <Animated.View style={animatedCircleStyle}>
            <Circle
              cx={height / 2}
              cy={height / 2}
              r={circleRadius}
              stroke={getCompletionColor()}
              strokeWidth={10}
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
              origin={`${height / 2}, ${height / 2}`}
              rotation="-90"
            />
          </Animated.View>
        </Svg>
        {/* Only render the completion value inside the circle for mobile */}
        {/* {Platform.OS !== 'web' && (
          <View
            style={[styles.centeredValue, { top: height / 2, left: '50%' }]}
          >
            <Text
              style={[
                Typography.h2,
                {
                  color: isDark
                    ? Colors.text.dark.primary
                    : Colors.text.light.primary,
                  textAlign: 'center',
                },
              ]}
            >
              {Math.round(completionRate)}%
            </Text>
          </View>
        )} */}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: Colors.success[500] },
            ]}
          />
          <Text
            style={[
              Typography.caption,
              {
                color: isDark
                  ? Colors.text.dark.secondary
                  : Colors.text.light.secondary,
              },
            ]}
          >
            Excellent (75-100%)
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: Colors.primary[500] },
            ]}
          />
          <Text
            style={[
              Typography.caption,
              {
                color: isDark
                  ? Colors.text.dark.secondary
                  : Colors.text.light.secondary,
              },
            ]}
          >
            Good (50-74%)
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: Colors.warning[500] },
            ]}
          />
          <Text
            style={[
              Typography.caption,
              {
                color: isDark
                  ? Colors.text.dark.secondary
                  : Colors.text.light.secondary,
              },
            ]}
          >
            Average (25-49%)
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: Colors.error[500] }]}
          />
          <Text
            style={[
              Typography.caption,
              {
                color: isDark
                  ? Colors.text.dark.secondary
                  : Colors.text.light.secondary,
              },
            ]}
          >
            Needs Improvement (0-24%)
          </Text>
        </View>
      </View>
    </View>
  );
};

// Simple SVG components for web compatibility
const Svg = (props: any) => (
  <View style={{ width: '100%', height: props.height }}>{props.children}</View>
);

const Circle = (props: any) => {
  const {
    cx,
    cy,
    r,
    stroke,
    strokeWidth,
    fill,
    strokeDasharray,
    strokeDashoffset,
    strokeLinecap,
  } = props;

  return (
    <View
      style={{
        position: 'absolute',
        width: r * 2,
        height: r * 2,
        left: cx - r,
        top: cy - r,
        borderRadius: r,
        borderWidth: strokeWidth,
        borderColor: stroke,
        backgroundColor: fill === 'transparent' ? 'transparent' : fill,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centeredValue: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }, { translateX: -0.5 }], // Center vertically, adjust as needed
    zIndex: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginBottom: Spacing.xs,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
});

export default CompletionChart;
