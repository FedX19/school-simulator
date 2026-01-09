import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SchoolEntrance() {
  const router = useRouter();
  const doorScale = useRef(new Animated.Value(1)).current;

  const handleDoorPress = () => {
    Animated.sequence([
      Animated.timing(doorScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(doorScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/locker');
    });
  };

  return (
    <View style={styles.container}>
      {/* Sky background */}
      <LinearGradient
        colors={['#87CEEB', '#E0F6FF']}
        style={styles.background}
      />

      {/* School building */}
      <View style={styles.school}>
        {/* Roof */}
        <View style={styles.roof}>
          <View style={styles.roofTriangle} />
        </View>

        {/* School name */}
        <View style={styles.nameContainer}>
          <Text style={styles.schoolName}>HAPPY SCHOOL</Text>
        </View>

        {/* Building body */}
        <View style={styles.building}>
          {/* Windows row 1 */}
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
          </View>

          {/* Door */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDoorPress}>
            <Animated.View
              style={[
                styles.door,
                {
                  transform: [{ scale: doorScale }],
                },
              ]}>
              <View style={styles.doorKnob} />
              <Text style={styles.doorText}>TAP TO ENTER</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Windows row 2 */}
          <View style={styles.windowRow}>
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
        </View>
      </View>

      {/* Ground */}
      <View style={styles.ground} />

      {/* Welcome text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to School!</Text>
        <Text style={styles.subtitleText}>Tap the door to start learning</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.7,
  },
  school: {
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  roof: {
    width: width * 0.7,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roofTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: width * 0.35,
    borderRightWidth: width * 0.35,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B4513',
  },
  nameContainer: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: -5,
    zIndex: 1,
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
  },
  building: {
    width: width * 0.7,
    backgroundColor: '#DC143C',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  window: {
    width: 60,
    height: 60,
    backgroundColor: '#87CEEB',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  door: {
    width: 100,
    height: 140,
    backgroundColor: '#8B4513',
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#654321',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  doorKnob: {
    width: 12,
    height: 12,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    position: 'absolute',
    right: 15,
    top: '50%',
  },
  doorText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
    backgroundColor: '#228B22',
  },
  welcomeContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitleText: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
