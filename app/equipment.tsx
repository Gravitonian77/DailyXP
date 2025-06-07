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

export default function EquipmentScreen() {
  const { user, updateUser } = useUser();
  const handleEquip = (id: string) => {
    const updated = user.equipment.map((item) =>
      item.id === id
        ? { ...item, isEquipped: !item.isEquipped }
        : item.slot === user.equipment.find((e) => e.id === id)?.slot &&
          item.isEquipped
        ? { ...item, isEquipped: false }
        : item
    );
    updateUser({ equipment: updated });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your Equipment</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {user.equipment?.length ? (
          user.equipment.map((item) => (
            <View
              key={item.id}
              style={[styles.equipCard, item.isEquipped && styles.equipped]}
            >
              <Text style={styles.equipIcon}>{item.icon}</Text>
              <Text style={styles.equipName}>{item.name}</Text>
              <Text style={styles.equipSlot}>{item.slot.toUpperCase()}</Text>
              <Text style={styles.equipDesc}>{item.description}</Text>
              <TouchableOpacity
                style={styles.equipBtn}
                onPress={() => handleEquip(item.id)}
              >
                <Text style={styles.equipBtnText}>
                  {item.isEquipped ? 'Unequip' : 'Equip'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No equipment unlocked yet.</Text>
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
  equipCard: {
    width: 140,
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  equipped: {
    borderColor: Colors.success[500],
    backgroundColor: Colors.success[50],
  },
  equipIcon: { fontSize: 36, marginBottom: 8 },
  equipName: { ...Typography.subtitle2, marginBottom: 2 },
  equipSlot: {
    ...Typography.caption,
    color: Colors.text.light.tertiary,
    marginBottom: 4,
  },
  equipDesc: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.text.light.tertiary,
    marginBottom: 8,
  },
  equipBtn: {
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  equipBtnText: { color: '#fff', fontWeight: 'bold' },
  empty: {
    ...Typography.body2,
    color: Colors.text.light.tertiary,
    marginTop: 32,
  },
});
