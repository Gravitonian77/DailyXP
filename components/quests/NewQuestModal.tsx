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
import { NewQuestInput, QuestDifficulty } from '@/types/Quest';
import { TaskCategory } from '@/types/Task';
import { Calendar, Star, X, Plus, Trash2 } from 'lucide-react-native';
import DateTimePicker from '@/components/shared/DateTimePicker';

interface NewQuestModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (quest: NewQuestInput) => void;
}

const NewQuestModal: React.FC<NewQuestModalProps> = ({
  visible,
  onClose,
  onSave
}) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('learning');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('medium');
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [steps, setSteps] = useState<{ title: string, description?: string }[]>([]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('learning');
    setDifficulty('medium');
    setEndDate(undefined);
    setSteps([]);
    setNewStepTitle('');
    setNewStepDescription('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your quest');
      return;
    }
    
    if (steps.length === 0) {
      alert('Please add at least one step to your quest');
      return;
    }
    
    const newQuest: NewQuestInput = {
      title,
      description,
      category,
      difficulty,
      endDate,
      steps,
    };
    
    onSave(newQuest);
    resetForm();
  };
  
  const handleAddStep = () => {
    if (!newStepTitle.trim()) {
      alert('Please enter a title for the step');
      return;
    }
    
    const newStep = {
      title: newStepTitle,
      description: newStepDescription || undefined,
    };
    
    setSteps([...steps, newStep]);
    setNewStepTitle('');
    setNewStepDescription('');
  };
  
  const handleRemoveStep = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
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
  
  const renderDifficultyButton = (
    label: string, 
    value: QuestDifficulty, 
    stars: number
  ) => {
    const isActive = difficulty === value;
    let color;
    
    switch (value) {
      case 'easy':
        color = Colors.primary[500];
        break;
      case 'medium':
        color = Colors.secondary[500];
        break;
      case 'hard':
        color = Colors.accent[500];
        break;
      case 'legendary':
        color = Colors.special.legendary;
        break;
      default:
        color = Colors.primary[500];
    }
    
    return (
      <TouchableOpacity 
        style={[
          styles.difficultyButton, 
          { 
            backgroundColor: isActive ? color : `${color}30`,
            borderWidth: isActive ? 2 : 0,
            borderColor: color,
          }
        ]}
        onPress={() => setDifficulty(value)}
      >
        <Text style={[
          styles.difficultyText,
          { color: isActive ? '#fff' : color }
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
            New Quest
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
              Quest Title
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
                  color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
                }
              ]}
              placeholder="Enter quest title"
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
              Description
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
              placeholder="Enter quest description"
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
            <View style={styles.difficultyGroup}>
              {renderDifficultyButton('Easy', 'easy', 1)}
              {renderDifficultyButton('Medium', 'medium', 2)}
              {renderDifficultyButton('Hard', 'hard', 3)}
              {renderDifficultyButton('Legendary', 'legendary', 4)}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              End Date (Optional)
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
                { color: endDate ? (isDark ? Colors.text.dark.primary : Colors.text.light.primary) : (isDark ? Colors.neutral[500] : Colors.neutral[400]) }
              ]}>
                {endDate ? new Date(endDate).toLocaleDateString() : 'Select a date'}
              </Text>
            </TouchableOpacity>
            
            <DateTimePicker
              visible={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              onSelect={(date) => {
                setEndDate(date.toISOString());
                setShowDatePicker(false);
              }}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[
              Typography.subtitle1,
              { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
            ]}>
              Quest Steps
            </Text>
            <Text style={[
              Typography.caption,
              { 
                color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary,
                marginBottom: Spacing.sm,
              }
            ]}>
              Add steps to complete your quest
            </Text>
            
            {steps.length > 0 && (
              <View style={styles.stepsContainer}>
                {steps.map((step, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.stepItem,
                      { 
                        backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] 
                      }
                    ]}
                  >
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    
                    <View style={styles.stepContent}>
                      <Text style={[
                        Typography.subtitle2,
                        { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
                      ]}>
                        {step.title}
                      </Text>
                      
                      {step.description && (
                        <Text style={[
                          Typography.caption,
                          { color: isDark ? Colors.text.dark.tertiary : Colors.text.light.tertiary }
                        ]}>
                          {step.description}
                        </Text>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.removeStepButton}
                      onPress={() => handleRemoveStep(index)}
                    >
                      <Trash2 size={16} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            <View style={[
              styles.newStepContainer,
              { 
                backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100]
              }
            ]}>
              <TextInput
                style={[
                  styles.stepTitleInput,
                  { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
                ]}
                placeholder="Step title"
                placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                value={newStepTitle}
                onChangeText={setNewStepTitle}
              />
              
              <TextInput
                style={[
                  styles.stepDescriptionInput,
                  { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
                ]}
                placeholder="Step description (optional)"
                placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                value={newStepDescription}
                onChangeText={setNewStepDescription}
              />
              
              <TouchableOpacity 
                style={[
                  styles.addStepButton,
                  { backgroundColor: Colors.primary[600] }
                ]}
                onPress={handleAddStep}
              >
                <Text style={styles.addStepButtonText}>Add Step</Text>
              </TouchableOpacity>
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
            style={[
              styles.saveButton, 
              { 
                backgroundColor: title && steps.length > 0 ? Colors.primary[600] : Colors.neutral[400],
                opacity: title && steps.length > 0 ? 1 : 0.7,
              }
            ]}
            onPress={handleSave}
            disabled={!title || steps.length === 0}
          >
            <Text style={styles.saveButtonText}>
              Start Quest
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
  difficultyGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
    marginBottom: Spacing.xs,
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
  stepsContainer: {
    marginBottom: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  stepNumberText: {
    color: '#fff',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 12,
  },
  stepContent: {
    flex: 1,
  },
  removeStepButton: {
    padding: 4,
  },
  newStepContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  stepTitleInput: {
    fontFamily: 'Inter',
    marginBottom: Spacing.sm,
  },
  stepDescriptionInput: {
    fontFamily: 'Inter',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  addStepButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  addStepButtonText: {
    color: '#fff',
    fontFamily: 'PixelifySans',
    fontSize: 14,
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

export default NewQuestModal;