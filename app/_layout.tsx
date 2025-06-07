import React, { useEffect } from 'react';
import { Stack, Redirect, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PixelifySans_400Regular,
  PixelifySans_500Medium,
  PixelifySans_600SemiBold,
  PixelifySans_700Bold,
} from '@expo-google-fonts/pixelify-sans';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { state } = useAuth();
  const pathname = usePathname();

  // Only redirect if not already on an auth route
  const isAuthRoute = pathname.startsWith('/auth');

  if (!state.user && !state.isLoading && !isAuthRoute) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'web' ? 'none' : 'default',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="quests/[id]"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="avatar" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      <Stack.Screen name="auth" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PixelifySans-Regular': PixelifySans_400Regular,
    'PixelifySans-Medium': PixelifySans_500Medium,
    'PixelifySans-SemiBold': PixelifySans_600SemiBold,
    'PixelifySans-Bold': PixelifySans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }

    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <UserProvider>
              <NotificationProvider>
                <RootLayoutNav />
                <StatusBar style="auto" />
              </NotificationProvider>
            </UserProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
