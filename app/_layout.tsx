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
        <Stack.Screen name="games/reading" options={{ title: 'Reading Game' }} />
        <Stack.Screen name="games/math" options={{ title: 'Math Game' }} />
        <Stack.Screen name="games/science" options={{ title: 'Science Game' }} />
        <Stack.Screen name="games/social-studies" options={{ title: 'Social Studies Game' }} />
        <Stack.Screen name="games/feelings" options={{ title: 'Feelings Game' }} />
        <Stack.Screen name="games/writing" options={{ title: 'Writing Game' }} />
        <Stack.Screen name="games/art" options={{ title: 'Art Game' }} />
        <Stack.Screen name="games/music" options={{ title: 'Music Game' }} />
        <Stack.Screen name="games/shapes" options={{ title: 'Shapes Game' }} />
        <Stack.Screen name="games/health" options={{ title: 'Health Game' }} />
        <Stack.Screen name="games/pe" options={{ title: 'P.E. Game' }} />
        <Stack.Screen name="games/life-skills" options={{ title: 'Life Skills Game' }} />
        <Stack.Screen name="games/study-hall" options={{ title: 'Study Hall Game' }} />
      </Stack>
      <StatusBar style="dark" />
    </ProgressProvider>
  );
}
