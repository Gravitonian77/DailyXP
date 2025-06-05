import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

interface CategoryXP {
  health: number;
  work: number;
  creativity: number;
  social: number;
  learning: number;
}

interface CategoryBreakdownProps {
  categoryXP: CategoryXP;
  height: number;
  isDark: boolean;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ 
  categoryXP, 
  height,
  isDark
}) => {
  // Calculate the total XP
  const totalXP = Object.values(categoryXP).reduce((sum, val) => sum + val, 0);
  
  // Calculate the percentage for each category
  const getPercentage = (value: number) => {
    if (totalXP === 0) return 0;
    return (value / totalXP) * 100;
  };
  
  // Get color for each category
  const getCategoryColor = (category: keyof CategoryXP) => {
    return Colors.xp[category];
  };
  
  // Generate the category items
  const renderCategoryItem = (
    category: keyof CategoryXP,
    label: string,
    index: number
  ) => {
    const percentage = getPercentage(categoryXP[category]);
    const color = getCategoryColor(category);
    
    return (
      <View key={category} style={styles.categoryItem}>
        <View style={styles.labelContainer}>
          <View style={[styles.colorIndicator, { backgroundColor: color }]} />
          <Text style={[
            Typography.body2, 
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
            {label}
          </Text>
        </View>
        <View style={styles.barContainer}>
          <View 
            style={[
              styles.barBackground,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}
          >
            <View 
              style={[
                styles.barFill,
                { 
                  width: `${percentage}%`,
                  backgroundColor: color,
                }
              ]}
            />
          </View>
        </View>
        <Text style={[
          Typography.subtitle2,
          { minWidth: 70, textAlign: 'right', color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
        ]}>
          {categoryXP[category]} XP
        </Text>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { height }]}>
      {totalXP === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[
            Typography.body1,
            { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
          ]}>
            No XP data yet. Complete tasks to see your category breakdown.
          </Text>
        </View>
      ) : (
        <>
          {renderCategoryItem('health', 'Health', 0)}
          {renderCategoryItem('work', 'Work', 1)}
          {renderCategoryItem('creativity', 'Creativity', 2)}
          {renderCategoryItem('social', 'Social', 3)}
          {renderCategoryItem('learning', 'Learning', 4)}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs,
  },
  barContainer: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  barBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
});

export default CategoryBreakdown;