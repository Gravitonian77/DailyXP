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
    flexBasis: '48%',
    flexGrow: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
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
