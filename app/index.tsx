import { Redirect } from 'expo-router';

// Redirect to the tabs navigation
export default function Index() {
  return <Redirect href="/(tabs)" />;
}