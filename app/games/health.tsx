import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

interface FoodItem {
  emoji: string;
  name: string;
  healthy: boolean;
}

const FOODS: FoodItem[] = [
  { emoji: '🥗', name: 'Salad', healthy: true },
  { emoji: '🍎', name: 'Apple', healthy: true },
  { emoji: '🍕', name: 'Pizza', healthy: false },
  { emoji: '🥦', name: 'Broccoli', healthy: true },
  { emoji: '🍭', name: 'Candy', healthy: false },
  { emoji: '🥕', name: 'Carrot', healthy: true },
  { emoji: '🍔', name: 'Burger', healthy: false },
  { emoji: '🍌', name: 'Banana', healthy: true },
];

export default function HealthGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const totalRounds = 8;
  const currentFood = FOODS[currentRound];

  const startGame = () => {
    setShowIntro(false);
  };

  const handleAnswer = (isHealthy: boolean) => {
    if (isHealthy === currentFood.healthy) {
      setScore(score + 1);
    }

    if (currentRound + 1 >= totalRounds) {
      setShowResults(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('health');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🥗 Healthy Foods 🥗</Text>
          <Text style={styles.introText}>Is this food healthy or treat?</Text>
          <Text style={styles.introText}>Make good choices!</Text>
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
          <Text style={styles.resultsTitle}>Great Job!</Text>
          <Text style={styles.resultsScore}>You got {score} out of {totalRounds} correct!</Text>
          <Text style={styles.resultsEmoji}>🥗✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Health ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Is this healthy?</Text>
        <Text style={styles.progress}>Food {currentRound + 1} of {totalRounds}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.foodContainer}>
          <Text style={styles.foodEmoji}>{currentFood.emoji}</Text>
          <Text style={styles.foodName}>{currentFood.name}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.choiceButton, styles.healthyButton]}
            onPress={() => handleAnswer(true)}>
            <Text style={styles.choiceText}>Healthy Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.choiceButton, styles.treatButton]}
            onPress={() => handleAnswer(false)}>
            <Text style={styles.choiceText}>Sometimes Treat</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#55EFC4',
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
  foodContainer: {
    backgroundColor: '#FFF',
    padding: 50,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  foodEmoji: {
    fontSize: 100,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsContainer: {
    width: '100%',
    gap: 20,
  },
  choiceButton: {
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  healthyButton: {
    backgroundColor: '#55EFC4',
  },
  treatButton: {
    backgroundColor: '#FFA502',
  },
  choiceText: {
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
    color: '#55EFC4',
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
