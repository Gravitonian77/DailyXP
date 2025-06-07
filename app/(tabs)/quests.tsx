import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { useQuests } from '@/hooks/useQuests';
import QuestCard from '@/components/quests/QuestCard';
import { PlusCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import NewQuestModal from '@/components/quests/NewQuestModal';
import { router } from 'expo-router';
import { Quest } from '@/types/Quest';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

export default function QuestsScreen() {
  const { theme, isDark } = useTheme();
  const { quests, addQuest } = useQuests();
  const [modalVisible, setModalVisible] = useState(false);

  // Filter active and completed quests
  const activeQuests = quests.filter((quest) => !quest.completed);
  const completedQuests = quests.filter((quest) => quest.completed);

  const handleQuestPress = (quest: Quest) => {
    router.push(`/quests/${quest.id}`);
  };

  const renderQuestList = (questsToRender: Quest[], title: string) => (
    <>
      {questsToRender.length > 0 && (
        <View>
          <Text
            style={[
              Typography.h4,
              styles.sectionTitle,
              {
                color: isDark
                  ? Colors.text.dark.primary
                  : Colors.text.light.primary,
              },
            ]}
          >
            {title}
          </Text>

          {questsToRender.map((quest, index) => (
            <Animated.View
              key={quest.id}
              entering={FadeInRight.delay(index * 100).duration(400)}
              layout={Layout.springify()}
            >
              <QuestCard
                quest={quest}
                onPress={() => handleQuestPress(quest)}
              />
            </Animated.View>
          ))}
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] },
      ]}
      edges={['top']}
    >
      <LinearGradient
        colors={[Colors.secondary[700], Colors.secondary[900]]}
        style={styles.header}
      >
        <Animated.View
          entering={FadeIn.delay(100).duration(400)}
          style={styles.headerContent}
        >
          <View>
            <Text style={[Typography.h2, styles.headerTitle]}>Your Quests</Text>
            <Text style={styles.headerSubtitle}>
              Complete quests to earn XP and rewards
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <PlusCircle size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <Animated.View
        entering={FadeIn.delay(300).duration(400)}
        style={styles.questsList}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeQuests.length === 0 && completedQuests.length === 0 ? (
            <View style={styles.emptyState}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
                }}
                style={styles.emptyImage}
              />
              <Text
                style={[
                  Typography.h3,
                  {
                    color: isDark
                      ? Colors.text.dark.primary
                      : Colors.text.light.primary,
                    marginTop: Spacing.md,
                  },
                ]}
              >
                No Quests Yet
              </Text>
              <Text
                style={[
                  Typography.body1,
                  {
                    color: isDark
                      ? Colors.text.dark.secondary
                      : Colors.text.light.secondary,
                    textAlign: 'center',
                    marginTop: Spacing.sm,
                    marginBottom: Spacing.md,
                  },
                ]}
              >
                Start your first quest to earn XP and level up your character.
              </Text>
              <TouchableOpacity
                style={[
                  styles.startButton,
                  { backgroundColor: Colors.secondary[600] },
                ]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.startButtonText}>Start a Quest</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {renderQuestList(activeQuests, 'Active Quests')}

              {completedQuests.length > 0 && (
                <View style={styles.sectionDivider} />
              )}

              {renderQuestList(completedQuests, 'Completed Quests')}
            </>
          )}
        </ScrollView>
      </Animated.View>

      <NewQuestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(questData) => {
          addQuest(questData);
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 32 : 16,
  },
  headerTitle: {
    color: '#fff',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter',
    fontSize: 14,
    marginBottom: Platform.OS === 'web' ? 16 : 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questsList: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? Spacing.xl : Spacing.md,
    paddingBottom: Platform.OS === 'web' ? 120 : 80,
  },
  sectionTitle: {
    marginBottom: Platform.OS === 'web' ? Spacing.md : Spacing.sm,
    marginTop: Platform.OS === 'web' ? Spacing.xl : Spacing.md,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.neutral[700],
    marginVertical: Platform.OS === 'web' ? Spacing.lg : Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  emptyImage: {
    width: 180,
    height: 120,
    borderRadius: 16,
    marginBottom: 24,
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  startButtonText: {
    color: '#fff',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 16,
  },
});
