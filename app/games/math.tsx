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

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  correctAnswer: number;
}

const STICKERS = ['⭐', '🌟', '✨', '🎉', '🎊', '🏆', '🥇', '👏'];
const QUESTIONS_TO_WIN = 10;
const TIME_PER_QUESTION = 5;
const PASSING_SCORE = 7;

type GameState = 'intro' | 'playing' | 'results';

export default function MathGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [gameState, setGameState] = useState<GameState>('intro');
  const [question, setQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [feedback, setFeedback] = useState<string>('');
  const [wrongAnswer, setWrongAnswer] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleAnims = useRef<Animated.Value[]>([]).current;
  const bubblePositions = useRef<{ x: Animated.Value; y: Animated.Value }[]>([]).current;

  useEffect(() => {
    if (gameState === 'playing' && !question) {
      generateQuestion();
    }
  }, [gameState]);

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

  const generateQuestion = () => {
    const operator = Math.random() > 0.5 ? '+' : '-';
    let num1, num2, correctAnswer;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 30) + 1;
      num2 = Math.floor(Math.random() * 30) + 1;
      correctAnswer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 40) + 20;
      num2 = Math.floor(Math.random() * num1) + 1;
      correctAnswer = num1 - num2;
    }

    const newQuestion: Question = { num1, num2, operator, correctAnswer };
    setQuestion(newQuestion);

    // Generate 5-6 options
    const numOptions = Math.random() > 0.5 ? 5 : 6;
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < numOptions - 1) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const wrongAnswer: number = correctAnswer + offset;
      if (wrongAnswer !== correctAnswer && wrongAnswer > 0) {
        wrongAnswers.add(wrongAnswer);
      }
    }

    const allOptions = [correctAnswer, ...Array.from(wrongAnswers)];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    // Initialize bubble animations
    bubbleAnims.length = 0;
    bubblePositions.length = 0;

    shuffled.forEach((_, index) => {
      bubbleAnims.push(new Animated.Value(0));

      // Random starting positions
      const xPos = new Animated.Value(Math.random() * (width - 140) + 20);
      const yPos = new Animated.Value(Math.random() * 150);
      bubblePositions.push({ x: xPos, y: yPos });

      // Floating animation loop
      const floatBubble = () => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(xPos, {
                toValue: Math.random() * (width - 140) + 20,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(yPos, {
                toValue: Math.random() * 150,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      };
      floatBubble();
    });

    // Animate bubbles in (scale)
    Animated.stagger(
      100,
      bubbleAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        })
      )
    ).start();

    setTimeLeft(TIME_PER_QUESTION);
    setFeedback('');
    setWrongAnswer(null);
  };

  const handleTimeout = () => {
    setFeedback('⏰ Time\'s up!');
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      setTimeout(() => finishGame(), 1000);
    } else {
      setTimeout(() => generateQuestion(), 1500);
    }
  };

  const handleAnswer = (selectedAnswer: number, index: number) => {
    if (feedback || !question) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const newQuestionsAnswered = questionsAnswered + 1;
    const timeBonus = timeLeft * 10;

    if (isCorrect) {
      // Pop animation
      Animated.sequence([
        Animated.timing(bubbleAnims[index], {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnims[index], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCorrectCount(correctCount + 1);
      setScore(score + 100 + timeBonus);
      setFeedback('🎉 Correct!');
    } else {
      // Wrong answer flash
      setWrongAnswer(selectedAnswer);
      setFeedback(`❌ Oops! Answer was ${question.correctAnswer}`);
    }

    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      setTimeout(() => finishGame(), 1500);
    } else {
      setTimeout(() => generateQuestion(), 1500);
    }
  };

  const finishGame = async () => {
    if (correctCount >= PASSING_SCORE) {
      const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      await completeSubject('math', randomSticker);
    }
    setGameState('results');
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCorrectCount(0);
    setQuestionsAnswered(0);
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
          <Text style={styles.introTitle}>🎈 Bubble Pop Math!</Text>
          <Text style={styles.introEmoji}>🔢</Text>

          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>How to Play:</Text>
            <Text style={styles.ruleText}>• Solve the math problem</Text>
            <Text style={styles.ruleText}>• Tap the bubble with the right answer</Text>
            <Text style={styles.ruleText}>• Pop it before time runs out!</Text>
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
            {passed ? '🎉 Great Job!' : '💪 Keep Practicing!'}
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

  if (!question) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
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

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.num1} {question.operator} {question.num2} = ?
        </Text>
      </View>

      {/* Feedback */}
      {feedback ? (
        <Text style={styles.feedbackText}>{feedback}</Text>
      ) : (
        <Text style={styles.instructionText}>Tap the correct bubble!</Text>
      )}

      {/* Bubbles */}
      <View style={styles.bubblesContainer}>
        {options.map((option, index) => {
          const isWrong = wrongAnswer === option;
          const scale = bubbleAnims[index] || new Animated.Value(1);
          const position = bubblePositions[index] || { x: new Animated.Value(0), y: new Animated.Value(0) };

          return (
            <Animated.View
              key={`${option}-${index}`}
              style={[
                styles.bubbleWrapper,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { scale }
                  ],
                  opacity: scale,
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.bubble,
                  isWrong && styles.bubbleWrong,
                ]}
                onPress={() => handleAnswer(option, index)}
                disabled={!!feedback}>
                <Text style={styles.bubbleText}>{option}</Text>
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
    backgroundColor: '#FF6B6B',
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
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
  questionContainer: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  questionText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  bubblesContainer: {
    flex: 1,
    position: 'relative',
    marginBottom: 30,
    minHeight: 200,
  },
  bubbleWrapper: {
    position: 'absolute',
    width: 90,
    height: 90,
  },
  bubble: {
    width: 90,
    height: 90,
    backgroundColor: '#FFF',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFB3B3',
  },
  bubbleWrong: {
    backgroundColor: '#FFCDD2',
    borderColor: '#F44336',
  },
  bubbleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
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
  loadingText: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 50,
  },
});
