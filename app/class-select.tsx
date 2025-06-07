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

export default function ClassSelectScreen() {
  const { user, updateUser } = useUser();
  const handleSelect = (cls: any) => {
    updateUser({ class: cls });
    router.back();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Choose Your Class</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {CLASSES.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            style={[
              styles.classCard,
              user.class?.id === cls.id && styles.selected,
            ]}
            onPress={() => handleSelect(cls)}
          >
            <Text style={styles.classIcon}>{cls.icon}</Text>
            <Text style={styles.className}>{cls.name}</Text>
            <Text style={styles.classDesc}>{cls.description}</Text>
            <Text style={styles.classBonus}>{cls.passiveBonus}</Text>
            {user.class?.id === cls.id && (
              <Text style={styles.selectedText}>Selected</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50], padding: 16 },
  backButton: { marginBottom: 12 },
  backText: { color: Colors.primary[600], fontSize: 16 },
  title: { ...Typography.h2, marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
  },
  classCard: {
    width: 160,
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  classIcon: { fontSize: 36, marginBottom: 8 },
  className: { ...Typography.subtitle2, marginBottom: 2 },
  classDesc: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.text.light.tertiary,
    marginBottom: 4,
  },
  classBonus: {
    ...Typography.caption,
    color: Colors.success[700],
    marginBottom: 4,
  },
  selectedText: {
    color: Colors.primary[600],
    fontWeight: 'bold',
    marginTop: 4,
  },
});
