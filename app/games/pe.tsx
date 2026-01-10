import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const ROUTINES = [
  {
    name: 'Morning Stretch',
    moves: ['🙆 Arms Up', '🤸 Touch Toes', '🏃 Jump', '👏 Clap'],
  },
  {
    name: 'Dance Party',
    moves: ['💃 Spin', '🕺 Wave Arms', '🦘 Jump', '👋 Wave'],
  },
];

export default function PEGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRoutine, setCurrentRoutine] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const totalRoutines = 2;
  const routine = ROUTINES[currentRoutine];

  const startGame = () => {
    setShowIntro(false);
  };

  const handleMoveDone = () => {
    if (currentMove + 1 >= routine.moves.length) {
      // Routine complete
      setScore(score + 1);

      if (currentRoutine + 1 >= totalRoutines) {
        setShowResults(true);
      } else {
        setCurrentRoutine(currentRoutine + 1);
        setCurrentMove(0);
      }
    } else {
      setCurrentMove(currentMove + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('pe');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🏃 P.E. Time! 🏃</Text>
          <Text style={styles.introText}>Follow the movement routine!</Text>
          <Text style={styles.introText}>Do each move and tap when done!</Text>
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
          <Text style={styles.resultsTitle}>Great Exercise!</Text>
          <Text style={styles.resultsScore}>You completed {score} routines!</Text>
          <Text style={styles.resultsEmoji}>🏃✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete P.E. ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{routine.name}</Text>
        <Text style={styles.progress}>Routine {currentRoutine + 1} of {totalRoutines}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.movesListContainer}>
          <Text style={styles.movesListTitle}>Full Routine:</Text>
          {routine.moves.map((move, idx) => (
            <Text
              key={idx}
              style={[
                styles.moveListItem,
                idx === currentMove && styles.currentMoveListItem
              ]}>
              {idx === currentMove ? '→ ' : ''}{move}
            </Text>
          ))}
        </View>

        <View style={styles.currentMoveContainer}>
          <Text style={styles.currentMoveLabel}>Do This Move:</Text>
          <Text style={styles.currentMoveText}>{routine.moves[currentMove]}</Text>
        </View>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleMoveDone}>
          <Text style={styles.doneButtonText}>I Did It! ✓</Text>
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
    backgroundColor: '#81ECEC',
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
  movesListContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    width: '100%',
  },
  movesListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  moveListItem: {
    fontSize: 18,
    color: '#666',
    marginVertical: 5,
  },
  currentMoveListItem: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#81ECEC',
  },
  currentMoveContainer: {
    backgroundColor: '#81ECEC',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  currentMoveLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  currentMoveText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  doneButtonText: {
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
    color: '#81ECEC',
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
