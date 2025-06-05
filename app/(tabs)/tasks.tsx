import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from '@/components/tasks/TaskCard';
import { useUser } from '@/contexts/UserContext';
import { TaskCategory } from '@/types/Task';
import { PlusCircle, CheckCircle2, Circle, CalendarDays } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NewTaskModal from '@/components/tasks/NewTaskModal';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';

export default function TasksScreen() {
  const { theme, isDark } = useTheme();
  const { tasks, completeTask, addTask } = useTasks();
  const { user, addXP } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'daily' | 'habit' | 'one-time'>('all');
  const [search, setSearch] = useState('');
  
  // Filter tasks based on the selected filter and search term
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'daily' && task.type === 'daily') ||
      (filter === 'habit' && task.type === 'habit') ||
      (filter === 'one-time' && task.type === 'one-time');
    
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Sort tasks: incomplete first, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by due date (if available)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    return 0;
  });
  
  // Group tasks by completion status
  const incompleteTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);
  
  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    
    // Add XP based on task difficulty
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const xpValue = task.difficulty === 'easy' ? 10 : 
                     task.difficulty === 'medium' ? 20 : 30;
      addXP(xpValue, task.category);
    }
  };
  
  const renderFilterButton = (filterName: string, filterValue: 'all' | 'daily' | 'habit' | 'one-time') => {
    const isActive = filter === filterValue;
    return (
      <TouchableOpacity 
        style={[
          styles.filterButton, 
          isActive && { 
            backgroundColor: isDark ? Colors.primary[700] : Colors.primary[500],
          }
        ]} 
        onPress={() => setFilter(filterValue)}
      >
        <Text 
          style={[
            styles.filterText, 
            isActive && { color: '#fff' }
          ]}
        >
          {filterName}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.neutral[950] : Colors.neutral[50] }]}>
      <Animated.View 
        entering={FadeIn.delay(100).duration(400)}
        style={styles.header}
      >
        <Text style={[Typography.h2, { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }]}>
          Tasks
        </Text>
        <TouchableOpacity 
          style={[
            styles.addButton, 
            { backgroundColor: Colors.primary[600] }
          ]}
          onPress={() => setModalVisible(true)}
        >
          <PlusCircle size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View 
        entering={FadeIn.delay(200).duration(400)}
        style={styles.searchContainer}
      >
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[100],
              color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
            }
          ]}
          placeholder="Search tasks..."
          placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
          value={search}
          onChangeText={setSearch}
        />
      </Animated.View>
      
      <Animated.View 
        entering={FadeIn.delay(300).duration(400)}
        style={styles.filtersContainer}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {renderFilterButton('All', 'all')}
          {renderFilterButton('Daily', 'daily')}
          {renderFilterButton('Habits', 'habit')}
          {renderFilterButton('One-time', 'one-time')}
        </ScrollView>
      </Animated.View>
      
      <Animated.View 
        entering={FadeIn.delay(400).duration(400)}
        style={styles.taskListContainer}
      >
        <FlatList
          data={incompleteTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInUp.delay(index * 100).duration(400)}
              layout={Layout.springify()}
            >
              <TaskCard 
                task={item} 
                onComplete={() => handleCompleteTask(item.id)}
              />
            </Animated.View>
          )}
          ListHeaderComponent={() => 
            incompleteTasks.length > 0 ? (
              <Text style={[
                Typography.subtitle1, 
                styles.listHeader,
                { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
              ]}>
                Active Tasks ({incompleteTasks.length})
              </Text>
            ) : null
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[
                Typography.body1, 
                { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
              ]}>
                No tasks found. Add your first task!
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <>
              {completedTasks.length > 0 && (
                <>
                  <Text style={[
                    Typography.subtitle1, 
                    styles.listHeader,
                    { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
                  ]}>
                    Completed ({completedTasks.length})
                  </Text>
                  
                  {completedTasks.map((task, index) => (
                    <Animated.View 
                      key={task.id}
                      entering={FadeInUp.delay(index * 50).duration(400)}
                      layout={Layout.springify()}
                    >
                      <TaskCard 
                        task={task} 
                        onComplete={() => {}}
                      />
                    </Animated.View>
                  ))}
                </>
              )}
              <View style={{ height: 100 }} />
            </>
          )}
        />
      </Animated.View>
      
      <NewTaskModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onSave={(taskData) => {
          addTask(taskData);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.md,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.sm,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchInput: {
    height: 44,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontFamily: 'Inter',
  },
  filtersContainer: {
    marginBottom: Spacing.md,
  },
  filtersScroll: {
    paddingHorizontal: Spacing.md,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  filterText: {
    fontFamily: 'PixelifySans',
    color: Colors.primary[600],
    fontSize: 14,
  },
  taskListContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  listHeader: {
    marginBottom: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
  },
});