import React, { useState, useEffect, useRef } from 'react';
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
  {
    question: 'What makes rain?',
    emoji: '🌧️',
    options: ['Clouds', 'Mountains', 'Trees', 'Wind'],
    correctAnswer: 'Clouds',
  },
  {
    question: 'What do caterpillars turn into?',
    emoji: '🐛',
    options: ['Butterflies', 'Birds', 'Bees', 'Ants'],
    correctAnswer: 'Butterflies',
  },
  {
    question: 'Where does the sun go at night?',
    emoji: '🌞',
    options: ['Behind Earth', 'In the ocean', 'Under mountains', 'Into space'],
    correctAnswer: 'Behind Earth',
  },
  {
    question: 'What do chickens lay?',
    emoji: '🐔',
    options: ['Eggs', 'Seeds', 'Nuts', 'Fruits'],
    correctAnswer: 'Eggs',
  },
  {
    question: 'What season comes after winter?',
    emoji: '❄️',
    options: ['Spring', 'Summer', 'Fall', 'Winter again'],
    correctAnswer: 'Spring',
  },
];

const STICKERS = ['🔬', '🧪', '🔭', '🌍', '⚗️', '🏆', '⭐', '🌟'];
const QUESTIONS_TO_WIN = 10;
const TIME_PER_QUESTION = 5;
const PASSING_SCORE = 7;

const OPTION_COLORS = ['#FF6B9D', '#C44569', '#FFA502', '#26de81'];

type GameState = 'intro' | 'playing' | 'results';

export default function ScienceGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [feedback, setFeedback] = useState<string>('');
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonAnims = useRef<Animated.Value[]>([]).current;

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex % QUIZ_QUESTIONS.length];

  useEffect(() => {
    if (gameState === 'playing') {
      startNewQuestion();
    }
  }, [gameState, currentQuestionIndex]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleTimeout();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameState]);

  const startNewQuestion = () => {
    setTimeLeft(TIME_PER_QUESTION);
    setFeedback('');
    setWrongAnswer(null);

    // Initialize button animations
    buttonAnims.length = 0;
    currentQuestion.options.forEach(() => {
      buttonAnims.push(new Animated.Value(0));
    });

    // Animate buttons in
    Animated.stagger(
      100,
      buttonAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        })
      )
    ).start();
  };

  const handleTimeout = () => {
    setFeedback('⏰ Time\'s up!');
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      setTimeout(() => finishGame(), 1000);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    }
  };

  const handleAnswer = (selectedAnswer: string, index: number) => {
    if (feedback) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newQuestionsAnswered = questionsAnswered + 1;
    const timeBonus = timeLeft * 10;

    if (isCorrect) {
      // Success animation - button pulses
      Animated.sequence([
        Animated.timing(buttonAnims[index], {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnims[index], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setCorrectCount(correctCount + 1);
      setScore(score + 100 + timeBonus);
      setFeedback('🎉 Correct!');
    } else {
      setWrongAnswer(selectedAnswer);
      setFeedback(`❌ It was: ${currentQuestion.correctAnswer}`);
    }

    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      setTimeout(() => finishGame(), 1500);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    }
  };

  const finishGame = async () => {
    if (correctCount >= PASSING_SCORE) {
      const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      await completeSubject('science', randomSticker);
    }
    setGameState('results');
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCorrectCount(0);
    setQuestionsAnswered(0);
    setCurrentQuestionIndex(0);
  };

  const getTimerColor = () => {
    if (timeLeft > 3) return '#4CAF50';
    if (timeLeft > 1) return '#FFC107';
    return '#F44336';
  };

  if (gameState === 'intro') {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🚀 Fast Facts Science!</Text>
          <Text style={styles.introEmoji}>🔬</Text>

          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>How to Play:</Text>
            <Text style={styles.ruleText}>• Read the science question</Text>
            <Text style={styles.ruleText}>• Tap the correct answer quickly!</Text>
            <Text style={styles.ruleText}>• Faster = higher score</Text>
            <Text style={styles.ruleText}>• 10 questions, 5 seconds each</Text>
            <Text style={styles.ruleText}>• Get 7+ correct to earn a sticker!</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back to Locker</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (gameState === 'results') {
    const passed = correctCount >= PASSING_SCORE;
    const accuracy = Math.round((correctCount / QUESTIONS_TO_WIN) * 100);

    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {passed ? '🔬 Amazing Scientist!' : '💪 Keep Exploring!'}
          </Text>

          <View style={styles.statsContainer}>
            <Text style={styles.statLabel}>Questions Correct:</Text>
            <Text style={styles.statValue}>{correctCount}/{QUESTIONS_TO_WIN}</Text>

            <Text style={styles.statLabel}>Accuracy:</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>

            <Text style={styles.statLabel}>Total Score:</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>

          {passed && (
            <View style={styles.stickerEarned}>
              <Text style={styles.stickerEarnedEmoji}>
                {STICKERS[Math.floor(Math.random() * STICKERS.length)]}
              </Text>
              <Text style={styles.stickerEarnedText}>Sticker Earned!</Text>
            </View>
          )}

          {!passed && (
            <Text style={styles.encouragementText}>
              Try again to earn a sticker! You need {PASSING_SCORE} correct.
            </Text>
          )}

          <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Back to Locker</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {questionsAnswered + 1}/{QUESTIONS_TO_WIN}
          </Text>
        </View>
      </View>

      {/* Timer */}
      <View style={[styles.timerContainer, { backgroundColor: getTimerColor() }]}>
        <Text style={styles.timerText}>{timeLeft}</Text>
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
      {feedback && <Text style={styles.feedbackText}>{feedback}</Text>}

      {/* Answer options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isWrong = wrongAnswer === option;
          const scale = buttonAnims[index] || new Animated.Value(1);
          const backgroundColor = OPTION_COLORS[index % OPTION_COLORS.length];

          return (
            <Animated.View
              key={`${option}-${index}`}
              style={[
                styles.optionWrapper,
                {
                  transform: [{ scale }],
                  opacity: scale,
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { backgroundColor: isWrong ? '#F44336' : backgroundColor },
                ]}
                onPress={() => handleAnswer(option, index)}
                disabled={!!feedback}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Progress dots */}
      <View style={styles.progressDots}>
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
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  introTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  introEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  rulesContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    width: '100%',
    maxWidth: 500,
  },
  rulesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#95E1D3',
    marginBottom: 15,
  },
  ruleText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
    lineHeight: 28,
  },
  startButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#95E1D3',
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  statLabel: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#95E1D3',
    marginBottom: 10,
  },
  stickerEarned: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stickerEarnedEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  stickerEarnedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  encouragementText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  doneButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#95E1D3',
  },
  progressContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#95E1D3',
  },
  timerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  emoji: {
    fontSize: 60,
  },
  questionContainer: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#95E1D3',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  optionWrapper: {
    width: '100%',
  },
  optionButton: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    opacity: 0.3,
  },
  progressDotFilled: {
    opacity: 1,
    backgroundColor: '#FFD700',
  },
});
