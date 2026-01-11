import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';
import { shuffleArray } from '@/utils/shuffle';

interface FeelingPair {
  emoji: string;
  feeling: string;
  options: string[];
}

const FEELINGS: FeelingPair[] = [
  { emoji: '😊', feeling: 'Happy', options: ['Happy', 'Sad', 'Angry', 'Scared'] },
  { emoji: '😢', feeling: 'Sad', options: ['Sad', 'Happy', 'Silly', 'Surprised'] },
  { emoji: '😠', feeling: 'Angry', options: ['Angry', 'Happy', 'Tired', 'Calm'] },
  { emoji: '😱', feeling: 'Scared', options: ['Scared', 'Brave', 'Happy', 'Calm'] },
  { emoji: '😴', feeling: 'Tired', options: ['Tired', 'Excited', 'Happy', 'Angry'] },
  { emoji: '🤗', feeling: 'Loved', options: ['Loved', 'Lonely', 'Angry', 'Scared'] },
];

export default function FeelingsGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [shuffledFeelings, setShuffledFeelings] = useState<FeelingPair[]>([]);

  const totalRounds = 6;
  const currentFeeling = shuffledFeelings[currentRound];

  const startGame = () => {
    // Shuffle feelings order
    const shuffledList = shuffleArray(FEELINGS);

    // Shuffle options for each feeling
    const feelingsWithShuffledOptions = shuffledList.map(f => ({
      ...f,
      options: shuffleArray(f.options),
    }));

    setShuffledFeelings(feelingsWithShuffledOptions);
    setCurrentRound(0);
    setScore(0);
    setShowResults(false);
    setShowIntro(false);
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentFeeling.feeling) {
      setScore(score + 1);
    }

    if (currentRound + 1 >= totalRounds) {
      setShowResults(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('feelings');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>😊 Feelings 😊</Text>
          <Text style={styles.introText}>Match the face with the feeling!</Text>
          <Text style={styles.introText}>How are they feeling?</Text>
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
          <Text style={styles.resultsEmoji}>😊✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Feelings ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentFeeling) {
    return (
      <View style={styles.container}>
        <View style={styles.gameArea}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>How do they feel?</Text>
        <Text style={styles.progress}>Face {currentRound + 1} of {totalRounds}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.faceContainer}>
          <Text style={styles.faceEmoji}>{currentFeeling.emoji}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentFeeling.options.map((option) => (
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
    backgroundColor: '#FFA502',
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
  faceContainer: {
    backgroundColor: '#FFF',
    padding: 60,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  faceEmoji: {
    fontSize: 120,
  },
  optionsContainer: {
    width: '100%',
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#FFA502',
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
    color: '#FFA502',
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
