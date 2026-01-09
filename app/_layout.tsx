import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ProgressProvider } from '@/contexts/progress-context';

export default function RootLayout() {
  return (
    <ProgressProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#87CEEB' },
        }}>
        <Stack.Screen name="index" options={{ title: 'School Entrance' }} />
        <Stack.Screen name="locker" options={{ title: 'Your Locker' }} />
        <Stack.Screen name="games/math" options={{ title: 'Math Game' }} />
        <Stack.Screen name="games/reading" options={{ title: 'Reading Game' }} />
        <Stack.Screen name="games/science" options={{ title: 'Science Game' }} />
      </Stack>
      <StatusBar style="dark" />
    </ProgressProvider>
  );
}
