import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { useUser } from '@/contexts/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import {
  Settings,
  Moon,
  Sun,
  Shield,
  Shirt,
  Award,
  Palette,
  LogOut,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, resetProgress } = useUser();

  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuContent}>
        <Text
          style={[
            Typography.subtitle1,
            {
              color: isDark
                ? Colors.text.dark.primary
                : Colors.text.light.primary,
              marginBottom: 15,
              flexShrink: 1, // ✅ allow shrinking to fit
              flexWrap: 'wrap', // ✅ allow multiple lines
            },
          ]}
        >
          {title}
        </Text>

        <Text
          numberOfLines={2}
          style={[
            Typography.caption,
            {
              color: isDark
                ? Colors.text.dark.tertiary
                : Colors.text.light.tertiary,
              lineHeight: 15, // ensure no clipping
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Calculate the progress percentage for the level
  const levelProgress = (user.currentXP / user.xpToNextLevel) * 100;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] },
      ]}
    >
      <LinearGradient
        colors={[Colors.primary[600], Colors.primary[800]]}
        style={styles.header}
      >
        <Animated.View
          entering={FadeIn.delay(100).duration(400)}
          style={styles.headerControls}
        >
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.profileContent}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user.avatarUrl ||
                  'https://images.pexels.com/photos/7607440/pexels-photo-7607440.jpeg',
              }}
              style={styles.avatar}
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{user.level}</Text>
            </View>
          </View>

          <Text style={[Typography.h2, styles.userName]}>{user.name}</Text>

          <Text style={styles.userTitle}>
            {user.title || 'Novice Adventurer'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.totalXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.levelProgressContainer}>
            <View
              style={[styles.levelProgressBar, { width: `${levelProgress}%` }]}
            />
            <Text style={styles.levelProgressText}>
              {user.currentXP}/{user.xpToNextLevel} XP to Level {user.level + 1}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <Animated.View
        entering={FadeIn.delay(300).duration(400)}
        style={styles.menuContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.menuSection}>
            <Text
              style={[
                Typography.overline,
                styles.menuSectionTitle,
                {
                  color: isDark
                    ? Colors.text.dark.tertiary
                    : Colors.text.light.tertiary,
                },
              ]}
            >
              APPEARANCE
            </Text>

            {renderMenuItem(
              <Palette size={24} color={Colors.accent[500]} />,
              'Avatar Customization',
              "Change your character's appearance",
              () => router.push('/avatar')
            )}

            {renderMenuItem(
              isDark ? (
                <Sun size={24} color={Colors.accent[500]} />
              ) : (
                <Moon size={24} color={Colors.accent[500]} />
              ),
              isDark ? 'Light Mode' : 'Dark Mode',
              'Switch app theme',
              toggleTheme
            )}
          </View>

          <View style={styles.menuSection}>
            <Text
              style={[
                Typography.overline,
                styles.menuSectionTitle,
                {
                  color: isDark
                    ? Colors.text.dark.tertiary
                    : Colors.text.light.tertiary,
                },
              ]}
            >
              ACHIEVEMENTS
            </Text>

            {renderMenuItem(
              <Award size={24} color={Colors.secondary[500]} />,
              'Badges',
              `${user.badges?.length || 0} badges earned`,
              () => alert('Badges coming soon!')
            )}

            {renderMenuItem(
              <Shirt size={24} color={Colors.secondary[500]} />,
              'Equipment',
              `${user.equipment?.length || 0} items unlocked`,
              () => alert('Equipment coming soon!')
            )}

            {renderMenuItem(
              <Shield size={24} color={Colors.secondary[500]} />,
              'Class Specialization',
              user.class || 'No class selected',
              () => alert('Class selection coming soon!')
            )}
          </View>

          <View style={styles.menuSection}>
            <Text
              style={[
                Typography.overline,
                styles.menuSectionTitle,
                {
                  color: isDark
                    ? Colors.text.dark.tertiary
                    : Colors.text.light.tertiary,
                },
              ]}
            >
              ACCOUNT
            </Text>

            {renderMenuItem(
              <LogOut size={24} color={Colors.error[500]} />,
              'Reset Progress',
              'Clear all data and start over',
              () => {
                if (
                  confirm(
                    'Are you sure you want to reset all progress? This cannot be undone.'
                  )
                ) {
                  resetProgress();
                }
              }
            )}
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                Typography.caption,
                {
                  color: isDark
                    ? Colors.text.dark.tertiary
                    : Colors.text.light.tertiary,
                },
              ]}
            >
              DailyXP v1.0.0
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContent: {
    alignItems: 'center',
    marginTop: Spacing.md, // NEW: adds space below header
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.accent[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelBadgeText: {
    color: '#fff',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 27,
    marginTop: Spacing.sm, // NEW
    marginBottom: Spacing.md,
  },
  userTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'PixelifySans',
    fontSize: 14,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 20,
    color: '#fff',
  },
  statLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  levelProgressContainer: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  levelProgressBar: {
    height: '100%',
    backgroundColor: Colors.accent[500],
    borderRadius: BorderRadius.full,
  },
  levelProgressText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    marginTop: 0, // remove overlap
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50], // ensure contrast
    paddingTop: Spacing.md, // creates breathing room
  },
  menuSection: {
    padding: Spacing.md,
  },
  menuSectionTitle: {
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md, // ← vertical padding instead of padding: Spacing.md
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Elevation.sm,
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'column', // ← add this
    justifyContent: 'center',
  },
  footer: {
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
});
