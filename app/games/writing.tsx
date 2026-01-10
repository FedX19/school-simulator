import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

export default function WritingGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [round, setRound] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const totalRounds = 3;
  const name = "ALEX"; // Simplified for kindergarten

  const startGame = () => {
    setShowIntro(false);
  };

  const handleTrace = () => {
    if (round + 1 >= totalRounds) {
      setShowResults(true);
    } else {
      setRound(round + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('writing');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>✏️ Name Tracing ✏️</Text>
          <Text style={styles.introText}>Trace the name 3 times!</Text>
          <Text style={styles.introText}>Practice makes perfect!</Text>
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
          <Text style={styles.resultsTitle}>Great Writing!</Text>
          <Text style={styles.resultsScore}>You traced the name {totalRounds} times!</Text>
          <Text style={styles.resultsEmoji}>✏️✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Writing ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Trace the Name</Text>
        <Text style={styles.progress}>Trace {round + 1} of {totalRounds}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.helpText}>Tap when done tracing!</Text>
        </View>

        <TouchableOpacity
          style={styles.tracedButton}
          onPress={handleTrace}>
          <Text style={styles.tracedButtonText}>I Traced It! ✓</Text>
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
    backgroundColor: '#A29BFE',
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
    justifyContent: 'center',
    padding: 20,
  },
  nameContainer: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 3,
    borderColor: '#A29BFE',
    borderStyle: 'dashed',
  },
  nameText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#A29BFE',
    letterSpacing: 10,
    marginBottom: 20,
  },
  helpText: {
    fontSize: 18,
    color: '#666',
  },
  tracedButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tracedButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
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
    color: '#A29BFE',
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
    textAlign: 'center',
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
