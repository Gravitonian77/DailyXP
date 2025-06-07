import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { state } = useAuth();

  // If user is already authenticated, redirect to main app
  if (state.user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
