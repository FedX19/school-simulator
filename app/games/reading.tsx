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

interface WordPair {
  word: string;
  image: string;
  options: string[];
}

const WORD_PAIRS: WordPair[] = [
  { word: 'CAT', image: '🐱', options: ['CAT', 'DOG', 'BAT', 'RAT'] },
  { word: 'SUN', image: '☀️', options: ['SUN', 'FUN', 'RUN', 'BUN'] },
  { word: 'TREE', image: '🌲', options: ['TREE', 'FREE', 'FLEE', 'KNEE'] },
  { word: 'STAR', image: '⭐', options: ['STAR', 'SCAR', 'STIR', 'STAY'] },
  { word: 'FISH', image: '🐟', options: ['FISH', 'DISH', 'WISH', 'FIST'] },
  { word: 'BIRD', image: '🐦', options: ['BIRD', 'DIRT', 'BURN', 'BIND'] },
  { word: 'MOON', image: '🌙', options: ['MOON', 'NOON', 'SOON', 'ROOM'] },
  { word: 'FROG', image: '🐸', options: ['FROG', 'FROM', 'DRAG', 'FLAG'] },
  { word: 'BOOK', image: '📚', options: ['BOOK', 'COOK', 'LOOK', 'HOOK'] },
  { word: 'RAIN', image: '🌧️', options: ['RAIN', 'PAIN', 'MAIN', 'GAIN'] },
];

const STICKERS = ['📚', '📖', '✏️', '📝', '🎓', '🏆', '⭐', '🌟'];
const QUESTIONS_TO_WIN = 10;
const TIME_PER_QUESTION = 5;
const PASSING_SCORE = 7;

type GameState = 'intro' | 'playing' | 'results';

export default function ReadingGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [feedback, setFeedback] = useState<string>('');
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallingAnims = useRef<Animated.Value[]>([]).current;

  const currentPair = WORD_PAIRS[currentWordIndex % WORD_PAIRS.length];

  useEffect(() => {
    if (gameState === 'playing') {
      startNewQuestion();
    }
  }, [gameState, currentWordIndex]);

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

    // Initialize falling animations
    fallingAnims.length = 0;
    currentPair.options.forEach(() => {
      fallingAnims.push(new Animated.Value(-100));
    });

    // Stagger the falling animation
    Animated.stagger(
      200,
      fallingAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
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
        setCurrentWordIndex(currentWordIndex + 1);
      }, 1500);
    }
  };

  const handleAnswer = (selectedWord: string, index: number) => {
    if (feedback) return;

    const isCorrect = selectedWord === currentPair.word;
    const newQuestionsAnswered = questionsAnswered + 1;
    const timeBonus = timeLeft * 10;

    if (isCorrect) {
      // Catch animation - word flies up
      Animated.timing(fallingAnims[index], {
        toValue: -200,
        duration: 400,
        useNativeDriver: true,
      }).start();

      setCorrectCount(correctCount + 1);
      setScore(score + 100 + timeBonus);
      setFeedback('📚 Perfect!');
    } else {
      setWrongAnswer(selectedWord);
      setFeedback(`❌ It was ${currentPair.word}`);
    }

    setQuestionsAnswered(newQuestionsAnswered);

    if (newQuestionsAnswered >= QUESTIONS_TO_WIN) {
      setTimeout(() => finishGame(), 1500);
    } else {
      setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
      }, 1500);
    }
  };

  const finishGame = async () => {
    if (correctCount >= PASSING_SCORE) {
      const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      await completeSubject('reading', randomSticker);
    }
    setGameState('results');
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCorrectCount(0);
    setQuestionsAnswered(0);
    setCurrentWordIndex(0);
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
          <Text style={styles.introTitle}>📖 Word Catch!</Text>
          <Text style={styles.introEmoji}>📚</Text>

          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>How to Play:</Text>
            <Text style={styles.ruleText}>• Look at the picture</Text>
            <Text style={styles.ruleText}>• Tap the matching word</Text>
            <Text style={styles.ruleText}>• Catch it before time runs out!</Text>
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
            {passed ? '📚 Awesome Reading!' : '💪 Keep Practicing!'}
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

      {/* Picture to match */}
      <View style={styles.pictureContainer}>
        <Text style={styles.pictureEmoji}>{currentPair.image}</Text>
        <Text style={styles.pictureLabel}>What word matches?</Text>
      </View>

      {/* Feedback */}
      {feedback && <Text style={styles.feedbackText}>{feedback}</Text>}

      {/* Falling words */}
      <View style={styles.wordsContainer}>
        {currentPair.options.map((option, index) => {
          const isWrong = wrongAnswer === option;
          const translateY = fallingAnims[index] || new Animated.Value(0);

          return (
            <Animated.View
              key={`${option}-${index}`}
              style={[
                styles.wordWrapper,
                {
                  transform: [{ translateY }],
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.wordButton,
                  isWrong && styles.wordButtonWrong,
                ]}
                onPress={() => handleAnswer(option, index)}
                disabled={!!feedback}>
                <Text style={styles.wordText}>{option}</Text>
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
    backgroundColor: '#4ECDC4',
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
    color: '#4ECDC4',
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
    color: '#4ECDC4',
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
    color: '#4ECDC4',
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
    color: '#4ECDC4',
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
    color: '#4ECDC4',
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
  pictureContainer: {
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
  pictureEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  pictureLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  wordsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  wordWrapper: {
    width: '100%',
  },
  wordButton: {
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#B3E5E0',
  },
  wordButtonWrong: {
    backgroundColor: '#FFCDD2',
    borderColor: '#F44336',
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECDC4',
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
