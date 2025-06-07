import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/lib/supabase';
import { Achievement } from '@/types/Achievement';
import * as Haptics from 'expo-haptics';

export function useAchievements() {
  const { user, updateUser } = useUser();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const checkAndUnlockAchievement = useCallback(async (achievement: Achievement) => {
    if (!user) return;

    setLoading(true);
    try {
      // Check if achievement is already unlocked
      const { data: existingAchievement } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_id', achievement.id)
        .single();

      if (existingAchievement) {
        setLoading(false);
        return;
      }

      // Unlock achievement
      const { error } = await supabase.from('user_achievements').insert({
        user_id: user.id,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Update user's achievements
      const updatedAchievements = [...(user.achievements || []), achievement];
      await updateUser({ achievements: updatedAchievements });

      // Show notification and trigger haptic feedback
      showNotification(`Achievement Unlocked: ${achievement.name}!`, 'success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // If achievement has rewards, grant them
      if (achievement.rewards) {
        if (achievement.rewards.xp) {
          await updateUser({
            currentXP: user.currentXP + achievement.rewards.xp,
          });
          showNotification(`+${achievement.rewards.xp} XP earned!`, 'info');
        }

        if (achievement.rewards.badge) {
          const updatedBadges = [...(user.badges || []), achievement.rewards.badge];
          await updateUser({ badges: updatedBadges });
          showNotification(`New Badge: ${achievement.rewards.badge.name}!`, 'success');
        }

        if (achievement.rewards.equipment) {
          const updatedEquipment = [...(user.equipment || []), achievement.rewards.equipment];
          await updateUser({ equipment: updatedEquipment });
          showNotification(`New Equipment: ${achievement.rewards.equipment.name}!`, 'success');
        }
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      showNotification('Failed to unlock achievement', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, updateUser, showNotification]);

  const checkAchievementProgress = useCallback(async (achievement: Achievement) => {
    if (!user) return;

    try {
      // Get current progress
      const { data: progress } = await supabase
        .from('achievement_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_id', achievement.id)
        .single();

      // If progress meets requirements, unlock achievement
      if (progress && progress.current_value >= achievement.requirement) {
        await checkAndUnlockAchievement(achievement);
      }
    } catch (error) {
      console.error('Error checking achievement progress:', error);
    }
  }, [user, checkAndUnlockAchievement]);

  return {
    checkAndUnlockAchievement,
    checkAchievementProgress,
    loading,
  };
} 