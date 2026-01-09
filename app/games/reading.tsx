import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const { width, height } = Dimensions.get('window');

interface WordPair {
  word: string;
  image: string;
  options: string[];
}

const WORD_PAIRS: WordPair[] = [
  {
    word: 'CAT',
    image: '🐱',
    options: ['CAT', 'DOG', 'BAT', 'RAT'],
  },
  {
    word: 'SUN',
    image: '☀️',
    options: ['SUN', 'FUN', 'RUN', 'BUN'],
  },
  {
    word: 'TREE',
    image: '🌲',
    options: ['TREE', 'FREE', 'FLEE', 'KNEE'],
  },
  {
    word: 'STAR',
    image: '⭐',
    options: ['STAR', 'SCAR', 'STIR', 'STAY'],
  },
  {
    word: 'FISH',
    image: '🐟',
    options: ['FISH', 'DISH', 'WISH', 'FIST'],
  },
];

const STICKERS = ['📚', '📖', '✏️', '📝', '🎓', '🏆', '⭐', '🌟'];
const QUESTIONS_TO_WIN = 5;

export default function ReadingGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationAnim = useState(new Animated.Value(0))[0];

  const currentPair = WORD_PAIRS[currentWordIndex];

  const handleAnswer = async (selectedWord: string) => {
    const isCorrect = selectedWord === currentPair.word;
    const newQuestionsAnswered = questionsAnswered + 1;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('🎉 Great reading!');
    } else {
      setFeedback(`❌ The word was ${currentPair.word}`);
    }

    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      // Game complete!
      const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      await completeSubject('reading', randomSticker);
      setShowCelebration(true);

      Animated.spring(celebrationAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      setTimeout(() => {
        router.back();
      }, 3000);
    } else {
      setTimeout(() => {
        setCurrentWordIndex((currentWordIndex + 1) % WORD_PAIRS.length);
        setFeedback('');
      }, 1500);
    }
  };

  if (showCelebration) {
    const scale = celebrationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.celebrationContainer}>
        <Animated.View style={[styles.celebrationBox, { transform: [{ scale }] }]}>
          <Text style={styles.celebrationTitle}>📚 Awesome Reading! 📚</Text>
          <Text style={styles.celebrationScore}>
            You got {score} out of {QUESTIONS_TO_WIN} correct!
          </Text>
          <Text style={styles.celebrationSticker}>
            {STICKERS[Math.floor(Math.random() * STICKERS.length)]}
          </Text>
          <Text style={styles.celebrationText}>Sticker earned!</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reading Challenge</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {questionsAnswered}/{QUESTIONS_TO_WIN}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <Text style={styles.instructions}>Match the picture with the word!</Text>

      {/* Picture */}
      <View style={styles.imageContainer}>
        <Text style={styles.imageEmoji}>{currentPair.image}</Text>
      </View>

      {/* Feedback */}
      {feedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : (
        <Text style={styles.questionPrompt}>Which word matches?</Text>
      )}

      {/* Word options */}
      <View style={styles.optionsContainer}>
        {currentPair.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
            disabled={!!feedback}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        {Array.from({ length: QUESTIONS_TO_WIN }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < questionsAnswered && styles.progressDotFilled,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scoreContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  instructions: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  imageContainer: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  imageEmoji: {
    fontSize: 120,
  },
  feedbackContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  questionPrompt: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: '#FFF',
    width: (width - 70) / 2,
    paddingVertical: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  optionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    opacity: 0.3,
  },
  progressDotFilled: {
    opacity: 1,
    backgroundColor: '#FFD700',
  },
  celebrationContainer: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationBox: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 400,
  },
  celebrationTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 20,
  },
  celebrationScore: {
    fontSize: 24,
    color: '#666',
    marginBottom: 30,
  },
  celebrationSticker: {
    fontSize: 80,
    marginBottom: 20,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
});
