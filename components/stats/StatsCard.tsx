import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  backgroundColor: string;
  textColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  backgroundColor,
  textColor,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, Elevation.sm]}>
      <View style={styles.header}>
        {icon}
        <Text style={[Typography.caption, { color: textColor, opacity: 0.7 }]}>
          {title}
        </Text>
      </View>
      <Text style={[Typography.h4, { color: textColor }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 160,
    padding: Platform.OS === 'web' ? Spacing.lg : Spacing.md,
    borderRadius: BorderRadius.md,
    marginHorizontal: Platform.OS === 'web' ? 8 : 4,
    marginBottom: Platform.OS === 'web' ? 0 : Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? Spacing.sm : Spacing.md,
  },
  icon: {
    marginRight: Spacing.xs,
  },
});

export default StatsCard;
