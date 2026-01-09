import React, { useState } from 'react';
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

interface QuizQuestion {
  question: string;
  emoji: string;
  options: string[];
  correctAnswer: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'What do plants need to grow?',
    emoji: '🌱',
    options: ['Sunlight & Water', 'Pizza', 'Ice Cream', 'Video Games'],
    correctAnswer: 'Sunlight & Water',
  },
  {
    question: 'How many legs does a spider have?',
    emoji: '🕷️',
    options: ['8', '6', '4', '10'],
    correctAnswer: '8',
  },
  {
    question: 'What color is the sky on a sunny day?',
    emoji: '☀️',
    options: ['Blue', 'Green', 'Red', 'Purple'],
    correctAnswer: 'Blue',
  },
  {
    question: 'What do bees make?',
    emoji: '🐝',
    options: ['Honey', 'Milk', 'Butter', 'Juice'],
    correctAnswer: 'Honey',
  },
  {
    question: 'Which animal lives in water?',
    emoji: '🌊',
    options: ['Fish', 'Cat', 'Dog', 'Bird'],
    correctAnswer: 'Fish',
  },
];

const STICKERS = ['🔬', '🧪', '🔭', '🌍', '⚗️', '🏆', '⭐', '🌟'];
const QUESTIONS_TO_WIN = 5;

export default function ScienceGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationAnim = useState(new Animated.Value(0))[0];

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleAnswer = async (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newQuestionsAnswered = questionsAnswered + 1;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('🎉 Correct! Great scientist!');
    } else {
      setFeedback(`❌ The answer was: ${currentQuestion.correctAnswer}`);
    }

    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      // Game complete!
      const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      await completeSubject('science', randomSticker);
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
        setCurrentQuestionIndex((currentQuestionIndex + 1) % QUIZ_QUESTIONS.length);
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
          <Text style={styles.celebrationTitle}>🔬 Amazing Scientist! 🔬</Text>
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
        <Text style={styles.title}>Science Quiz</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {questionsAnswered}/{QUESTIONS_TO_WIN}
          </Text>
        </View>
      </View>

      {/* Question emoji */}
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{currentQuestion.emoji}</Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Feedback */}
      {feedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option) => (
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
    backgroundColor: '#95E1D3',
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
    color: '#95E1D3',
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
    color: '#95E1D3',
  },
  emojiContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  emoji: {
    fontSize: 80,
  },
  questionContainer: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#95E1D3',
    textAlign: 'center',
  },
  feedbackContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#95E1D3',
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
    backgroundColor: '#95E1D3',
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
    color: '#95E1D3',
    marginBottom: 20,
    textAlign: 'center',
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
    color: '#95E1D3',
  },
});
