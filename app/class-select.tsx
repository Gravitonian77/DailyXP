import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronLeft } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const CLASSES = [
  {
    id: 'warrior',
    name: 'Warrior',
    icon: '⚔️',
    description: 'Bonus Strength and streak protection.',
    passiveBonus: '+2 Strength, streak loss immunity once per week.',
  },
  {
    id: 'mage',
    name: 'Mage',
    icon: '🪄',
    description: 'Bonus Intelligence and XP from learning.',
    passiveBonus: '+2 Intelligence, +10% XP from learning tasks.',
  },
  {
    id: 'rogue',
    name: 'Rogue',
    icon: '🗡️',
    description: 'Bonus Dexterity and bonus for task streaks.',
    passiveBonus: '+2 Dexterity, +1 XP per task in streaks.',
  },
  {
    id: 'paladin',
    name: 'Paladin',
    icon: '🛡️',
    description: 'Bonus Vitality and daily quest bonus.',
    passiveBonus: '+2 Vitality, +5 XP for daily quest completion.',
  },
  {
    id: 'bard',
    name: 'Bard',
    icon: '🎸',
    description: 'Bonus Charisma and social XP.',
    passiveBonus: '+2 Charisma, +10% XP from social tasks.',
  },
];

const CARD_MARGIN = 8;
const CARD_GAP = 16;
const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.floor(
  (SCREEN_WIDTH - CARD_GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS
);

export default function ClassSelectScreen() {
  const { user, updateUser } = useUser();
  const { isDark } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handleSelect = (cls: any) => {
    updateUser({ class: cls });
    router.back();
  };
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
            onPressIn={() => (scale.value = withSpring(0.92))}
            onPressOut={() => (scale.value = withSpring(1))}
          >
            <ChevronLeft
              size={28}
              color={isDark ? Colors.primary[300] : Colors.primary[600]}
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
          Choose Your Class
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          ...styles.grid,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {CLASSES.map((cls) => {
          const selected =
            typeof user.class === 'string'
              ? user.class === cls.id
              : (user.class as any)?.id === cls.id;
          return (
            <TouchableOpacity
              key={cls.id}
              style={[
                styles.classCard,
                {
                  width: CARD_WIDTH,
                  backgroundColor: selected
                    ? isDark
                      ? Colors.primary[900]
                      : Colors.primary[50]
                    : isDark
                    ? Colors.neutral[900]
                    : Colors.neutral[100],
                  borderColor: selected ? Colors.primary[500] : 'transparent',
                  shadowColor: isDark ? '#000' : '#aaa',
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => handleSelect(cls)}
            >
              <Text
                style={[styles.classIcon, { opacity: selected ? 1 : 0.85 }]}
              >
                {cls.icon}
              </Text>
              <Text
                style={[
                  styles.className,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                  },
                ]}
              >
                {cls.name}
              </Text>
              <Text
                style={[
                  styles.classDesc,
                  {
                    color: isDark
                      ? Colors.text.dark.tertiary
                      : Colors.text.light.tertiary,
                  },
                ]}
              >
                {cls.description}
              </Text>
              <Text
                style={[
                  styles.classBonus,
                  { color: isDark ? Colors.success[400] : Colors.success[700] },
                ]}
              >
                {cls.passiveBonus}
              </Text>
              {selected && (
                <Text
                  style={[styles.selectedText, { color: Colors.primary[400] }]}
                >
                  Selected
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
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
    borderRadius: 999,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { ...Typography.h2, flex: 1, textAlign: 'left', marginBottom: 0 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    justifyContent: 'center',
  },
  classCard: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: CARD_GAP,
    borderWidth: 2,
    marginHorizontal: CARD_MARGIN,
  },
  classIcon: { fontSize: 40, marginBottom: 8 },
  className: { ...Typography.subtitle2, marginBottom: 2 },
  classDesc: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: 4,
  },
  classBonus: {
    ...Typography.caption,
    marginBottom: 4,
  },
  selectedText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
});
