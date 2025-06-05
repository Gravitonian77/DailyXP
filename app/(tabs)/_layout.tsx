import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, View } from 'react-native';
import { 
  Home, 
  ListTodo, 
  BarChart, 
  User,
  Trophy
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Determine tab bar style based on platform and theme
  const tabBarStyle = Platform.select({
    ios: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80 + insets.bottom,
      paddingBottom: insets.bottom,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      backgroundColor: 'transparent',
    },
    default: {
      height: 60 + insets.bottom,
      paddingBottom: insets.bottom,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
    }
  });
  
  // Tab bar background component for iOS
  const TabBarBackground = () => {
    if (Platform.OS !== 'ios') return null;
    
    return (
      <BlurView 
        style={StyleSheet.absoluteFill}
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
      />
    );
  };
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabBarStyle,
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: isDark ? Colors.neutral[400] : Colors.neutral[500],
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontFamily: 'PixelifySans',
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 6,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 0 : 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <ListTodo size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <BarChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}