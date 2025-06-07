import { useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Equipment, EquipmentSlot } from '@/types/Equipment';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';

export function useEquipment() {
  const { user, updateUser } = useUser();
  const { showNotification } = useNotification();

  const equipItem = useCallback(async (equipment: Equipment) => {
    if (!user) return;

    try {
      // Check if user meets level requirement
      if (equipment.level > user.level) {
        showNotification('Level too low to equip this item', 'error');
        return;
      }

      // Get currently equipped item in the same slot
      const currentEquipped = user.equipment?.find(
        (item) => item.slot === equipment.slot && item.equipped
      );

      // Unequip current item if exists
      if (currentEquipped) {
        const updatedEquipment = user.equipment?.map((item) =>
          item.id === currentEquipped.id ? { ...item, equipped: false } : item
        );

        // Update user's attributes by removing current item's bonuses
        const updatedAttributes = { ...user.attributes };
        Object.entries(currentEquipped.attributes).forEach(([key, value]) => {
          if (value) {
            updatedAttributes[key as keyof typeof updatedAttributes] -= value;
          }
        });

        await updateUser({
          equipment: updatedEquipment,
          attributes: updatedAttributes,
        });
      }

      // Equip new item
      const updatedEquipment = user.equipment?.map((item) =>
        item.id === equipment.id ? { ...item, equipped: true } : item
      );

      // Update user's attributes by adding new item's bonuses
      const updatedAttributes = { ...user.attributes };
      Object.entries(equipment.attributes).forEach(([key, value]) => {
        if (value) {
          updatedAttributes[key as keyof typeof updatedAttributes] += value;
        }
      });

      await updateUser({
        equipment: updatedEquipment,
        attributes: updatedAttributes,
      });

      // Update database
      await supabase
        .from('user_equipment')
        .upsert({
          user_id: user.id,
          equipment_id: equipment.id,
          equipped: true,
        });

      // Show notification and trigger haptic feedback
      showNotification(`Equipped ${equipment.name}`, 'success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error equipping item:', error);
      showNotification('Failed to equip item', 'error');
    }
  }, [user, updateUser, showNotification]);

  const unequipItem = useCallback(async (equipment: Equipment) => {
    if (!user) return;

    try {
      // Update equipment state
      const updatedEquipment = user.equipment?.map((item) =>
        item.id === equipment.id ? { ...item, equipped: false } : item
      );

      // Update user's attributes by removing item's bonuses
      const updatedAttributes = { ...user.attributes };
      Object.entries(equipment.attributes).forEach(([key, value]) => {
        if (value) {
          updatedAttributes[key as keyof typeof updatedAttributes] -= value;
        }
      });

      await updateUser({
        equipment: updatedEquipment,
        attributes: updatedAttributes,
      });

      // Update database
      await supabase
        .from('user_equipment')
        .upsert({
          user_id: user.id,
          equipment_id: equipment.id,
          equipped: false,
        });

      // Show notification and trigger haptic feedback
      showNotification(`Unequipped ${equipment.name}`, 'info');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error unequipping item:', error);
      showNotification('Failed to unequip item', 'error');
    }
  }, [user, updateUser, showNotification]);

  const getEquippedItems = useCallback(() => {
    if (!user?.equipment) return {};
    
    return user.equipment.reduce((acc, item) => {
      if (item.equipped) {
        acc[item.slot] = item;
      }
      return acc;
    }, {} as Record<EquipmentSlot, Equipment>);
  }, [user]);

  return {
    equipItem,
    unequipItem,
    getEquippedItems,
  };
} 