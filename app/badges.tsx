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

export default function BadgesScreen() {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your Badges</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {user.badges?.length ? (
          user.badges.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No badges earned yet.</Text>
        )}
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
  badgeCard: {
    width: 120,
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  badgeIcon: { fontSize: 36, marginBottom: 8 },
  badgeName: { ...Typography.subtitle2, marginBottom: 4 },
  badgeDesc: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.text.light.tertiary,
  },
  empty: {
    ...Typography.body2,
    color: Colors.text.light.tertiary,
    marginTop: 32,
  },
});
