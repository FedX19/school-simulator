import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const SONGS = [
  {
    name: 'Twinkle Twinkle',
    pattern: ['⭐', '⭐', '🌟', '🌟', '✨', '✨', '⭐'],
  },
  {
    name: 'Happy Birthday',
    pattern: ['🎂', '🎂', '🎈', '🎂', '🎉', '🎊'],
  },
];

export default function MusicGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentSong, setCurrentSong] = useState(0);
  const [tappedPattern, setTappedPattern] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const totalSongs = 2;
  const song = SONGS[currentSong];

  const startGame = () => {
    setShowIntro(false);
  };

  const handleDrumTap = () => {
    const newPattern = [...tappedPattern, '🥁'];
    setTappedPattern(newPattern);

    // Check if pattern is complete
    if (newPattern.length >= song.pattern.length) {
      // Simple success for kindergarten
      setScore(score + 1);

      if (currentSong + 1 >= totalSongs) {
        setTimeout(() => setShowResults(true), 500);
      } else {
        setTimeout(() => {
          setCurrentSong(currentSong + 1);
          setTappedPattern([]);
        }, 500);
      }
    }
  };

  const handleComplete = async () => {
    await completeSubject('music');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🎵 Drum Rhythm 🎵</Text>
          <Text style={styles.introText}>Tap the drum to the beat!</Text>
          <Text style={styles.introText}>Follow the rhythm pattern!</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showResults) {
    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Great Rhythm!</Text>
          <Text style={styles.resultsScore}>You played {score} songs!</Text>
          <Text style={styles.resultsEmoji}>🎵✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Music ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{song.name}</Text>
        <Text style={styles.progress}>Song {currentSong + 1} of {totalSongs}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.patternContainer}>
          <Text style={styles.patternLabel}>Pattern:</Text>
          <View style={styles.pattern}>
            {song.pattern.map((emoji, idx) => (
              <Text key={idx} style={styles.patternEmoji}>{emoji}</Text>
            ))}
          </View>
        </View>

        <View style={styles.tappedContainer}>
          <Text style={styles.tappedLabel}>Your Taps:</Text>
          <View style={styles.tapped}>
            {tappedPattern.map((emoji, idx) => (
              <Text key={idx} style={styles.tappedEmoji}>{emoji}</Text>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.drumButton}
          onPress={handleDrumTap}>
          <Text style={styles.drumEmoji}>🥁</Text>
          <Text style={styles.drumText}>TAP!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
  },
  header: {
    backgroundColor: '#FDCB6E',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progress: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 5,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  patternContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  patternLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  patternEmoji: {
    fontSize: 36,
  },
  tappedContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    minHeight: 100,
  },
  tappedLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tapped: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  tappedEmoji: {
    fontSize: 36,
  },
  drumButton: {
    backgroundColor: '#FDCB6E',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  drumEmoji: {
    fontSize: 60,
  },
  drumText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 5,
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  introTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FDCB6E',
    marginBottom: 20,
  },
  introText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 30,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  resultsScore: {
    fontSize: 28,
    color: '#333',
    marginBottom: 20,
  },
  resultsEmoji: {
    fontSize: 60,
    marginBottom: 30,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
