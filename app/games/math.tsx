import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const { width, height } = Dimensions.get('window');

export default function MathGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [appleCount, setAppleCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);

  const totalRounds = 8;

  const startGame = () => {
    setShowIntro(false);
    setupRound(0);
  };

  const setupRound = (roundNum: number) => {
    // Generate 1-10 apples
    const count = Math.floor(Math.random() * 10) + 1;
    setAppleCount(count);

    // Create 4 answer options
    const opts = new Set<number>([count]);
    while (opts.size < 4) {
      const randomNum = Math.floor(Math.random() * 10) + 1;
      opts.add(randomNum);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setCurrentRound(roundNum);
  };

  const handleAnswer = (answer: number) => {
    if (answer === appleCount) {
      setScore(score + 1);
    }

    if (currentRound + 1 >= totalRounds) {
      setShowResults(true);
    } else {
      setupRound(currentRound + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('math');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🍎 Apple Counting 🍎</Text>
          <Text style={styles.introText}>Count the apples on the tree!</Text>
          <Text style={styles.introText}>Tap the right number.</Text>
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
          <Text style={styles.resultsTitle}>Great Counting!</Text>
          <Text style={styles.resultsScore}>You got {score} out of {totalRounds} correct!</Text>
          <Text style={styles.resultsEmoji}>🍎✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Math ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Count the apples!</Text>
        <Text style={styles.progress}>Round {currentRound + 1} of {totalRounds}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gameArea}>
        {/* Tree trunk */}
        <View style={styles.trunk} />

        {/* Tree top with apples */}
        <View style={styles.treeTop}>
          {Array.from({ length: appleCount }).map((_, idx) => (
            <Text key={idx} style={styles.apple}>🍎</Text>
          ))}
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>How many apples?</Text>
        </View>

        {/* Answer options */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
  },
  header: {
    backgroundColor: '#FF6B6B',
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
    alignItems: 'center',
    padding: 20,
  },
  trunk: {
    width: 40,
    height: 80,
    backgroundColor: '#8B4513',
    marginTop: 20,
    borderRadius: 5,
  },
  treeTop: {
    width: Math.min(width - 40, 400),
    minHeight: 200,
    backgroundColor: '#27AE60',
    borderRadius: 150,
    marginTop: -20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  apple: {
    fontSize: 36,
  },
  questionContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 30,
    width: '100%',
  },
  optionButton: {
    width: 80,
    height: 80,
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  optionText: {
    fontSize: 36,
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
    color: '#FF6B6B',
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
