import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Elevation } from '@/constants/Spacing';
import { NewTaskInput, TaskCategory, TaskDifficulty, TaskType } from '@/types/Task';
import { Calendar, Star, X, Plus } from 'lucide-react-native';
import DateTimePicker from '@/components/shared/DateTimePicker';

interface NewTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: NewTaskInput) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  visible, 
  onClose,
  onSave
}) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('daily');
  const [category, setCategory] = useState<TaskCategory>('learning');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [subTasks, setSubTasks] = useState<{ title: string }[]>([]);
  const [newSubTask, setNewSubTask] = useState('');
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('daily');
    setCategory('learning');
    setDifficulty('medium');
    setDueDate(undefined);
    setSubTasks([]);
    setNewSubTask('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your task');
      return;
    }
    
    const newTask: NewTaskInput = {
      title,
      description: description || undefined,
      type,
      category,
      difficulty,
      dueDate,
      subTasks: subTasks.length > 0 ? subTasks : undefined,
    };
    
    onSave(newTask);
    resetForm();
  };
  
  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, { title: newSubTask }]);
      setNewSubTask('');
    }
  };
  
  const handleRemoveSubTask = (index: number) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks.splice(index, 1);
    setSubTasks(updatedSubTasks);
  };
  
  const renderTypeButton = (label: string, value: TaskType) => {
    const isActive = type === value;
    return (
      <TouchableOpacity 
        style={[
          styles.typeButton, 
          { backgroundColor: isActive ? Colors.primary[600] : 'rgba(124, 58, 237, 0.1)' }
        ]}
        onPress={() => setType(value)}
      >
        <Text style={[
          styles.typeText,
          { color: isActive ? '#fff' : Colors.primary[600] }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderCategoryButton = (label: string, value: TaskCategory, color: string) => {
    const isActive = category === value;
    return (
      <TouchableOpacity 
        style={[
          styles.categoryButton, 
          { 
            backgroundColor: isActive ? color : `${color}30`,
            borderWidth: isActive ? 2 : 0,
            borderColor: color,
          }
        ]}
        onPress={() => setCategory(value)}
      >
        <Text style={[
          styles.categoryText,
          { color: isActive ? '#fff' : color }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderDifficultyButton = (label: string, value: TaskDifficulty, stars: number) => {
    const isActive = difficulty === value;
    return (
      <TouchableOpacity 
        style={[
          styles.difficultyButton, 
          { 
            backgroundColor: isActive ? Colors.accent[500] : 'rgba(245, 158, 11, 0.1)',
            borderWidth: isActive ? 2 : 0,
            borderColor: Colors.accent[500],
          }
        ]}
        onPress={() => setDifficulty(value)}
      >
        <Text style={[
          styles.difficultyText,
          { color: isActive ? '#fff' : Colors.accent[500] }
        ]}>
          {label} {Array(stars).fill('★').join('')}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={styles.modal}
    >
      <View style={[
        styles.container, 
        { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }
      ]}>
        <View style={styles.header}>
          <Text style={[
            Typography.h3, 
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
            New Task
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              Title
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
                  color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
                }
              ]}
              placeholder="Enter task title"
              placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              Description (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { 
                  backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
                  color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
                }
              ]}
              placeholder="Enter description"
              placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              Task Type
            </Text>
            <View style={styles.buttonGroup}>
              {renderTypeButton('Daily', 'daily')}
              {renderTypeButton('Habit', 'habit')}
              {renderTypeButton('One-time', 'one-time')}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              Category
            </Text>
            <View style={styles.categoryGroup}>
              {renderCategoryButton('Health', 'health', Colors.xp.health)}
              {renderCategoryButton('Work', 'work', Colors.xp.work)}
              {renderCategoryButton('Create', 'creativity', Colors.xp.creativity)}
              {renderCategoryButton('Social', 'social', Colors.xp.social)}
              {renderCategoryButton('Learn', 'learning', Colors.xp.learning)}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              Difficulty
            </Text>
            <View style={styles.buttonGroup}>
              {renderDifficultyButton('Easy', 'easy', 1)}
              {renderDifficultyButton('Medium', 'medium', 2)}
              {renderDifficultyButton('Hard', 'hard', 3)}
            </View>
          </View>
          
          {(type === 'one-time' || type === 'daily') && (
            <View style={styles.formGroup}>
              <Text style={[
                Typography.subtitle1,
                { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
              ]}>
                {type === 'one-time' ? 'Due Date' : 'Start Date'}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.dateButton,
                  { 
                    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
                  }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                <Text style={[
                  styles.dateText,
                  { color: dueDate ? (isDark ? Colors.text.dark.primary : Colors.text.light.primary) : (isDark ? Colors.neutral[500] : Colors.neutral[400]) }
                ]}>
                  {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select a date'}
                </Text>
              </TouchableOpacity>
              
              <DateTimePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onSelect={(date) => {
                  setDueDate(date.toISOString().split('T')[0]);
                  setShowDatePicker(false);
                }}
              />
            </View>
          )}
          
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              Subtasks (Optional)
            </Text>
            <View style={styles.subtasksContainer}>
              {subTasks.map((subTask, index) => (
                <View key={index} style={styles.subTaskItem}>
                  <Text style={[
                    Typography.body2,
                    { 
                      flex: 1,
                      color: isDark ? Colors.text.dark.primary : Colors.text.light.primary 
                    }
                  ]}>
                    • {subTask.title}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveSubTask(index)}>
                    <X size={16} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                  </TouchableOpacity>
                </View>
              ))}
              
              <View style={styles.addSubTaskRow}>
                <TextInput
                  style={[
                    styles.subTaskInput,
                    { 
                      backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
                      color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
                    }
                  ]}
                  placeholder="Add a subtask"
                  placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                  value={newSubTask}
                  onChangeText={setNewSubTask}
                />
                <TouchableOpacity 
                  style={[
                    styles.addSubTaskButton,
                    { backgroundColor: Colors.primary[600] }
                  ]}
                  onPress={handleAddSubTask}
                >
                  <Plus size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.cancelButton, { borderColor: isDark ? Colors.neutral[700] : Colors.neutral[300] }]}
            onPress={handleClose}
          >
            <Text style={{ 
              fontFamily: 'PixelifySans',
              color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: Colors.primary[600] }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              Save Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.md,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  input: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontFamily: 'Inter',
    marginTop: Spacing.xs,
  },
  textArea: {
    height: 100,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
  },
  typeText: {
    fontFamily: 'PixelifySans',
    fontSize: 14,
  },
  categoryGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontFamily: 'PixelifySans',
    fontSize: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
  },
  difficultyText: {
    fontFamily: 'PixelifySans',
    fontSize: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  dateText: {
    fontFamily: 'Inter',
    marginLeft: Spacing.sm,
  },
  subtasksContainer: {
    marginTop: Spacing.xs,
  },
  subTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addSubTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTaskInput: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    fontFamily: 'Inter',
    marginRight: Spacing.sm,
  },
  addSubTaskButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(124, 58, 237, 0.2)',
  },
  cancelButton: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  saveButton: {
    flex: 2,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  saveButtonText: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default NewTaskModal;