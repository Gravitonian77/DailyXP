import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const COLORS = {
  success: Colors.success[500],
  error: Colors.error[500],
  warning: Colors.warning[500],
  info: Colors.info[500],
};

export default function Toast({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const { isDark } = useTheme();
  const translateY = new Animated.Value(100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback based on type
      switch (type) {
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const Icon = ICONS[type];
  const color = COLORS[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
        },
      ]}
    >
      <View style={styles.content}>
        <Icon size={24} color={color} />
        <Text
          style={[
            Typography.body1,
            styles.message,
            {
              color: isDark
                ? Colors.text.dark.primary
                : Colors.text.light.primary,
            },
          ]}
        >
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
        <Text
          style={[
            Typography.button,
            {
              color: isDark
                ? Colors.text.dark.secondary
                : Colors.text.light.secondary,
            },
          ]}
        >
          Dismiss
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Elevation.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  message: {
    flex: 1,
  },
  closeButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-end',
  },
});
