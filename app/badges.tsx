import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { BADGES } from '@/constants/achievements';
import { Lock, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const CARD_MARGIN = 8;
const CARD_GAP = 16;
const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.floor(
  (SCREEN_WIDTH - CARD_GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS
);

export default function BadgesScreen() {
  const { user } = useUser();
  const { isDark } = useTheme();
  const unlockedIds = (user.badges ?? []).map((b: any) => (b.id ? b.id : b));
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] },
      ]}
    >
      <View style={styles.headerRow}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            onPressIn={() => {
              scale.value = withSpring(0.85, { damping: 10 });
            }}
            onPressOut={() => {
              scale.value = withSpring(1, { damping: 10 });
            }}
          >
            <ChevronLeft
              size={28}
              color={isDark ? Colors.text.dark.primary : Colors.primary[600]}
            />
          </TouchableOpacity>
        </Animated.View>
        <Text
          style={[
            styles.title,
            {
              color: isDark
                ? Colors.text.dark.primary
                : Colors.text.light.primary,
            },
          ]}
        >
          Your Badges
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: 80, paddingTop: 8 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridRow}>
          {BADGES.length ? (
            BADGES.map((badge, idx) => {
              const unlocked = unlockedIds.includes(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    {
                      backgroundColor: unlocked
                        ? isDark
                          ? Colors.neutral[900]
                          : Colors.neutral[100]
                        : isDark
                        ? Colors.neutral[800]
                        : Colors.neutral[200],
                      borderColor: unlocked
                        ? isDark
                          ? Colors.primary[600]
                          : Colors.primary[400]
                        : isDark
                        ? Colors.neutral[700]
                        : Colors.neutral[300],
                      shadowColor: isDark ? '#000' : '#aaa',
                      width: CARD_WIDTH,
                      margin: CARD_MARGIN,
                    },
                    !unlocked && { opacity: 0.5 },
                  ]}
                >
                  <Text
                    style={[styles.badgeIcon, { opacity: unlocked ? 1 : 0.7 }]}
                  >
                    {badge.icon}
                  </Text>
                  <Text
                    style={[
                      styles.badgeName,
                      {
                        color: isDark
                          ? Colors.text.dark.primary
                          : Colors.text.light.primary,
                      },
                    ]}
                  >
                    {badge.name}
                  </Text>
                  <Text
                    style={[
                      styles.badgeDesc,
                      {
                        color: isDark
                          ? Colors.text.dark.tertiary
                          : Colors.text.light.tertiary,
                      },
                    ]}
                  >
                    {badge.description}
                  </Text>
                  {!unlocked && (
                    <Lock
                      size={20}
                      color={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                      style={{ marginTop: 4 }}
                    />
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.empty}>No badges defined.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: 16 },
  title: { ...Typography.h2, marginBottom: 0, flex: 1 },
  grid: {
    // No flexDirection here, handled by gridRow
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badgeCard: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeIcon: { fontSize: 40, marginBottom: 8 },
  badgeName: { ...Typography.subtitle2, marginBottom: 4 },
  badgeDesc: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: 4,
  },
  empty: {
    ...Typography.body2,
    color: Colors.text.light.tertiary,
    marginTop: 32,
  },
});
