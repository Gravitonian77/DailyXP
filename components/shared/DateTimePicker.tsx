import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { Calendar as CalendarIcon, X } from 'lucide-react-native';

interface DateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate?: Date;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  visible,
  onClose,
  onSelect,
  initialDate
}) => {
  const { isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Create array of days
    const days: (number | null)[] = Array(firstDayOfWeek).fill(null); // Fill in blank days
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };
  
  const handleSelectDay = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };
  
  const handleConfirm = () => {
    onSelect(selectedDate);
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };
  
  const isSelectedDay = (day: number) => {
    return (
      day === selectedDate.getDate()
    );
  };
  
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });
  
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
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
            Select Date
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={[
              styles.navButton,
              { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
            ]}>
              ◄
            </Text>
          </TouchableOpacity>
          
          <Text style={[
            Typography.h4,
            { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
          ]}>
            {monthName} {selectedDate.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={[
              styles.navButton,
              { color: isDark ? Colors.text.dark.primary : Colors.text.light.primary }
            ]}>
              ►
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekDayHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text 
              key={index}
              style={[
                styles.weekDay,
                { color: isDark ? Colors.text.dark.secondary : Colors.text.light.secondary }
              ]}
            >
              {day}
            </Text>
          ))}
        </View>
        
        <View style={styles.calendar}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                isSelectedDay(day || 0) && {
                  backgroundColor: Colors.primary[600],
                },
                isToday(day || 0) && !isSelectedDay(day || 0) && {
                  backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[200],
                }
              ]}
              disabled={day === null}
              onPress={() => day !== null && handleSelectDay(day)}
            >
              {day !== null && (
                <Text style={[
                  styles.dayText,
                  {
                    color: isSelectedDay(day) 
                      ? '#fff' 
                      : isDark ? Colors.text.dark.primary : Colors.text.light.primary
                  }
                ]}>
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.cancelButton, { borderColor: isDark ? Colors.neutral[700] : Colors.neutral[300] }]}
            onPress={onClose}
          >
            <Text style={{ 
              fontFamily: 'PixelifySans',
              color: isDark ? Colors.text.dark.primary : Colors.text.light.primary,
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.confirmButton, { backgroundColor: Colors.primary[600] }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: Spacing.md,
  },
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  navButton: {
    fontSize: 18,
    padding: 8,
  },
  weekDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  weekDay: {
    width: 36,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: Spacing.xs,
  },
  dayText: {
    fontFamily: 'Inter',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: Spacing.md,
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
  confirmButton: {
    flex: 2,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  confirmButtonText: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default DateTimePicker;