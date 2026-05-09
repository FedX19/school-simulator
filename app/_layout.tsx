import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ProgressProvider } from '@/contexts/progress-context';
import { SettingsProvider } from '@/contexts/settings-context';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#87CEEB' } }} />
        <StatusBar style="dark" />
      </ProgressProvider>
    </SettingsProvider>
  );
}
