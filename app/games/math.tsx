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

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  correctAnswer: number;
}

const STICKERS = ['⭐', '🌟', '✨', '🎉', '🎊', '🏆', '🥇', '👏'];
const QUESTIONS_TO_WIN = 5;

export default function MathGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [question, setQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const operator = Math.random() > 0.5 ? '+' : '-';
    let num1, num2, correctAnswer;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      correctAnswer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * num1) + 1;
      correctAnswer = num1 - num2;
    }

    const newQuestion: Question = { num1, num2, operator, correctAnswer };
    setQuestion(newQuestion);

    // Generate options
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrongAnswer: number = correctAnswer + offset;
      if (wrongAnswer !== correctAnswer && wrongAnswer > 0) {
        wrongAnswers.add(wrongAnswer);
      }
    }

    const allOptions = [correctAnswer, ...Array.from(wrongAnswers)];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
    setFeedback('');
  };

  const handleAnswer = async (selectedAnswer: number) => {
    if (!question) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const newQuestionsAnswered = questionsAnswered + 1;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('🎉 Correct!');
    } else {
      setFeedback(`❌ Oops! The answer was ${question.correctAnswer}`);
    }

    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      // Game complete!
      const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      await completeSubject('math', randomSticker);
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
        generateQuestion();
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
          <Text style={styles.celebrationTitle}>🎉 Great Job! 🎉</Text>
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

  if (!question) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
        <Text style={styles.title}>Math Challenge</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {questionsAnswered}/{QUESTIONS_TO_WIN}
          </Text>
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.num1} {question.operator} {question.num2} = ?
        </Text>
      </View>

      {/* Feedback */}
      {feedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
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
    backgroundColor: '#FF6B6B',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backBtn: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
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
    color: '#FF6B6B',
  },
  questionContainer: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 20,
    marginVertical: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  questionText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  feedbackContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
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
    paddingVertical: 30,
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 30,
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
    backgroundColor: '#FF6B6B',
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
  },
});
