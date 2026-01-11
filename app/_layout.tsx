import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { ProgressProvider } from '@/contexts/progress-context';

// Universal Back to Locker button component
function LockerButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.lockerButton}
      onPress={() => router.push('/locker')}>
      <Text style={styles.lockerButtonText}>🚪 Locker</Text>
    </TouchableOpacity>
  );
}

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
        <Stack.Screen
          name="games/reading"
          options={{
            title: 'Reading',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#FF6B9D' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/math"
          options={{
            title: 'Math',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#FF6B6B' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/science"
          options={{
            title: 'Science',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#95E1D3' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/social-studies"
          options={{
            title: 'Social Studies',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#4ECDC4' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/feelings"
          options={{
            title: 'Feelings',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#FFA502' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/writing"
          options={{
            title: 'Writing',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#A29BFE' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/art"
          options={{
            title: 'Art',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#FD79A8' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/music"
          options={{
            title: 'Music',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#FDCB6E' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/shapes"
          options={{
            title: 'Shapes',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#74B9FF' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/health"
          options={{
            title: 'Health',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#55EFC4' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/pe"
          options={{
            title: 'P.E.',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#81ECEC' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/life-skills"
          options={{
            title: 'Life Skills',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#FAB1A0' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="games/study-hall"
          options={{
            title: 'Study Hall',
            headerShown: true,
            headerLeft: () => <LockerButton />,
            headerStyle: { backgroundColor: '#DFE6E9' },
            headerTintColor: '#333',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ProgressProvider>
  );
}

const styles = StyleSheet.create({
  lockerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  lockerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
