import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Rect, Path, Line, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const svgSize = Math.min(width, height) * 0.9;

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
      {/* School SVG Icon */}
      <Pressable onPress={handleDoorPress}>
        <Svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 1024 1024"
          style={styles.svg}>
          {/* Background circle */}
          <Circle cx="512" cy="512" r="512" fill="#4A90E2" />

          {/* Ground */}
          <Rect x="0" y="700" width="1024" height="324" fill="#7CB342" />

          {/* School building main structure */}
          <Rect x="200" y="400" width="624" height="400" fill="#E74C3C" rx="10" />

          {/* Roof */}
          <Path d="M 150 400 L 512 200 L 874 400 Z" fill="#C0392B" />

          {/* Bell tower base */}
          <Rect x="462" y="200" width="100" height="100" fill="#E74C3C" rx="5" />

          {/* Bell tower roof */}
          <Path d="M 442 200 L 512 150 L 582 200 Z" fill="#C0392B" />

          {/* Bell */}
          <Circle cx="512" cy="180" r="15" fill="#F1C40F" stroke="#000" strokeWidth="3" />

          {/* Flag pole */}
          <Rect x="508" y="100" width="8" height="50" fill="#34495E" />

          {/* Flag */}
          <Path d="M 516 110 L 576 125 L 516 140 Z" fill="#F39C12" />

          {/* Main door */}
          <Rect x="437" y="600" width="150" height="200" fill="#8B4513" rx="10" />
          <Rect x="437" y="600" width="75" height="200" fill="#A0522D" rx="10" />
          <Circle cx="560" cy="700" r="8" fill="#F1C40F" />

          {/* Windows row 1 */}
          <Rect x="250" y="450" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />
          <Rect x="370" y="450" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />
          <Rect x="574" y="450" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />
          <Rect x="694" y="450" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />

          {/* Windows row 2 */}
          <Rect x="250" y="570" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />
          <Rect x="370" y="570" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />
          <Rect x="574" y="570" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />
          <Rect x="694" y="570" width="80" height="80" fill="#87CEEB" rx="5" stroke="#34495E" strokeWidth="4" />

          {/* Window panes Row 1 */}
          <Line x1="290" y1="450" x2="290" y2="530" stroke="#34495E" strokeWidth="3" />
          <Line x1="250" y1="490" x2="330" y2="490" stroke="#34495E" strokeWidth="3" />
          <Line x1="410" y1="450" x2="410" y2="530" stroke="#34495E" strokeWidth="3" />
          <Line x1="370" y1="490" x2="450" y2="490" stroke="#34495E" strokeWidth="3" />
          <Line x1="614" y1="450" x2="614" y2="530" stroke="#34495E" strokeWidth="3" />
          <Line x1="574" y1="490" x2="654" y2="490" stroke="#34495E" strokeWidth="3" />
          <Line x1="734" y1="450" x2="734" y2="530" stroke="#34495E" strokeWidth="3" />
          <Line x1="694" y1="490" x2="774" y2="490" stroke="#34495E" strokeWidth="3" />

          {/* Window panes Row 2 */}
          <Line x1="290" y1="570" x2="290" y2="650" stroke="#34495E" strokeWidth="3" />
          <Line x1="250" y1="610" x2="330" y2="610" stroke="#34495E" strokeWidth="3" />
          <Line x1="410" y1="570" x2="410" y2="650" stroke="#34495E" strokeWidth="3" />
          <Line x1="370" y1="610" x2="450" y2="610" stroke="#34495E" strokeWidth="3" />
          <Line x1="614" y1="570" x2="614" y2="650" stroke="#34495E" strokeWidth="3" />
          <Line x1="574" y1="610" x2="654" y2="610" stroke="#34495E" strokeWidth="3" />
          <Line x1="734" y1="570" x2="734" y2="650" stroke="#34495E" strokeWidth="3" />
          <Line x1="694" y1="610" x2="774" y2="610" stroke="#34495E" strokeWidth="3" />

          {/* Door steps */}
          <Rect x="400" y="780" width="224" height="20" fill="#95A5A6" />
          <Rect x="380" y="800" width="264" height="20" fill="#7F8C8D" />

          {/* Bushes left */}
          <Circle cx="160" cy="720" r="40" fill="#27AE60" />
          <Circle cx="190" cy="710" r="35" fill="#2ECC71" />
          <Circle cx="140" cy="710" r="35" fill="#2ECC71" />

          {/* Bushes right */}
          <Circle cx="864" cy="720" r="40" fill="#27AE60" />
          <Circle cx="894" cy="710" r="35" fill="#2ECC71" />
          <Circle cx="844" cy="710" r="35" fill="#2ECC71" />

          {/* Sun */}
          <Circle cx="850" cy="280" r="50" fill="#F1C40F" opacity="0.9" />

          {/* Clouds */}
          <Ellipse cx="200" cy="280" rx="50" ry="30" fill="white" opacity="0.8" />
          <Ellipse cx="230" cy="270" rx="40" ry="25" fill="white" opacity="0.8" />
          <Ellipse cx="170" cy="270" rx="40" ry="25" fill="white" opacity="0.8" />
        </Svg>
      </Pressable>

      {/* Welcome text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to School!</Text>
        <Text style={styles.subtitleText}>Tap the school to start learning</Text>
      </View>

      {/* Tap to enter button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDoorPress}
        style={styles.enterButton}>
        <Animated.View
          style={[
            styles.enterButtonInner,
            {
              transform: [{ scale: doorScale }],
            },
          ]}>
          <Text style={styles.enterButtonText}>TAP TO ENTER</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  svg: {
    marginTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 20,
    color: '#FFF',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  enterButton: {
    marginBottom: 20,
  },
  enterButtonInner: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  enterButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
