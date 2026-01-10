import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const { width } = Dimensions.get('window');

interface HelperPair {
  emoji: string;
  name: string;
  job: string;
  options: string[];
}

const HELPERS: HelperPair[] = [
  { emoji: '👨‍🏫', name: 'Teacher', job: 'Teaches students', options: ['Teaches students', 'Fixes teeth', 'Delivers mail', 'Grows food'] },
  { emoji: '👨‍⚕️', name: 'Doctor', job: 'Helps sick people', options: ['Helps sick people', 'Cooks food', 'Drives bus', 'Teaches students'] },
  { emoji: '👮', name: 'Police Officer', job: 'Keeps us safe', options: ['Keeps us safe', 'Delivers mail', 'Fixes cars', 'Cooks food'] },
  { emoji: '👨‍🚒', name: 'Firefighter', job: 'Puts out fires', options: ['Puts out fires', 'Fixes teeth', 'Grows food', 'Drives bus'] },
  { emoji: '👨‍🍳', name: 'Chef', job: 'Cooks food', options: ['Cooks food', 'Keeps us safe', 'Teaches students', 'Delivers mail'] },
  { emoji: '📬', name: 'Mail Carrier', job: 'Delivers mail', options: ['Delivers mail', 'Puts out fires', 'Helps sick people', 'Fixes cars'] },
];

export default function SocialStudiesGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const totalRounds = 6;
  const currentHelper = HELPERS[currentRound];

  const startGame = () => {
    setShowIntro(false);
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentHelper.job) {
      setScore(score + 1);
    }

    if (currentRound + 1 >= totalRounds) {
      setShowResults(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('social-studies');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>👥 School Helpers 👥</Text>
          <Text style={styles.introText}>Match each helper with their job!</Text>
          <Text style={styles.introText}>Who helps us every day?</Text>
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
          <Text style={styles.resultsEmoji}>👥✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Social Studies ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>What do they do?</Text>
        <Text style={styles.progress}>Helper {currentRound + 1} of {totalRounds}</Text>
      </View>

      <View style={styles.gameArea}>
        {/* Helper */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperEmoji}>{currentHelper.emoji}</Text>
          <Text style={styles.helperName}>{currentHelper.name}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentHelper.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#4ECDC4',
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
  helperContainer: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  helperEmoji: {
    fontSize: 100,
    marginBottom: 10,
  },
  helperName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    width: '100%',
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#4ECDC4',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  optionText: {
    fontSize: 20,
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
    color: '#4ECDC4',
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
