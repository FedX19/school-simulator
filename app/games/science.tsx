import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

interface Animal {
  id: string;
  emoji: string;
  name: string;
  sound: string; // Text-to-speech phrase
}

// Pool of 20+ animals for variety
const ANIMAL_POOL: Animal[] = [
  { id: 'dog', emoji: '🐶', name: 'Dog', sound: 'Woof woof! I am a dog' },
  { id: 'cat', emoji: '🐱', name: 'Cat', sound: 'Meow meow! I am a cat' },
  { id: 'cow', emoji: '🐮', name: 'Cow', sound: 'Moo moo! I am a cow' },
  { id: 'duck', emoji: '🦆', name: 'Duck', sound: 'Quack quack! I am a duck' },
  { id: 'frog', emoji: '🐸', name: 'Frog', sound: 'Ribbit ribbit! I am a frog' },
  { id: 'lion', emoji: '🦁', name: 'Lion', sound: 'Roar roar! I am a lion' },
  { id: 'pig', emoji: '🐷', name: 'Pig', sound: 'Oink oink! I am a pig' },
  { id: 'bee', emoji: '🐝', name: 'Bee', sound: 'Buzz buzz! I am a bee' },
  { id: 'horse', emoji: '🐴', name: 'Horse', sound: 'Neigh neigh! I am a horse' },
  { id: 'sheep', emoji: '🐑', name: 'Sheep', sound: 'Baa baa! I am a sheep' },
  { id: 'rooster', emoji: '🐓', name: 'Rooster', sound: 'Cock-a-doodle-doo! I am a rooster' },
  { id: 'elephant', emoji: '🐘', name: 'Elephant', sound: 'I am an elephant with a long trunk' },
  { id: 'bird', emoji: '🐦', name: 'Bird', sound: 'Tweet tweet! I am a bird' },
  { id: 'owl', emoji: '🦉', name: 'Owl', sound: 'Hoo hoo! I am an owl' },
  { id: 'monkey', emoji: '🐵', name: 'Monkey', sound: 'Ooh ooh ahh ahh! I am a monkey' },
  { id: 'wolf', emoji: '🐺', name: 'Wolf', sound: 'Awoo awoo! I am a wolf' },
  { id: 'chicken', emoji: '🐔', name: 'Chicken', sound: 'Cluck cluck! I am a chicken' },
  { id: 'snake', emoji: '🐍', name: 'Snake', sound: 'Hiss hiss! I am a snake' },
  { id: 'cricket', emoji: '🦗', name: 'Cricket', sound: 'Chirp chirp! I am a cricket' },
  { id: 'dolphin', emoji: '🐬', name: 'Dolphin', sound: 'Click click! I am a dolphin' },
  { id: 'goat', emoji: '🐐', name: 'Goat', sound: 'Maa maa! I am a goat' },
  { id: 'turkey', emoji: '🦃', name: 'Turkey', sound: 'Gobble gobble! I am a turkey' },
];

interface Question {
  correct: Animal;
  choices: Animal[];
}

const QUESTIONS_PER_GAME = 10;
const PASS_THRESHOLD = 0.8; // 80%

// Utility: shuffle array
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Utility: sample N items from array without replacement
function sampleWithoutReplacement<T>(array: T[], n: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, n);
}

// Generate a question with 1 correct + 3 distractors
function generateQuestion(correct: Animal, pool: Animal[]): Question {
  const distractors = pool.filter((a) => a.id !== correct.id);
  const selectedDistractors = sampleWithoutReplacement(distractors, 3);
  const choices = shuffle([correct, ...selectedDistractors]);
  return { correct, choices };
}

// Generate a full game (10 questions)
function generateGame(pool: Animal[]): Question[] {
  const selectedAnimals = sampleWithoutReplacement(pool, QUESTIONS_PER_GAME);
  return selectedAnimals.map((animal) => generateQuestion(animal, pool));
}

export default function ScienceGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();

  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup speech on unmount
      Speech.stop();
    };
  }, []);

  const startGame = () => {
    const newQuestions = generateGame(ANIMAL_POOL);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setAttempts(0);
    setSelectedChoice(null);
    setShowIntro(false);
    setShowResults(false);
  };

  const playSound = async (soundText: string) => {
    // Stop any currently playing speech
    await Speech.stop();

    // Speak the animal sound using text-to-speech
    Speech.speak(soundText, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85, // Slightly slower for kindergarten
    });
  };

  useEffect(() => {
    // Auto-play sound when question changes
    if (!showIntro && !showResults && questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      playSound(question.correct.sound);
    }
  }, [currentQuestionIndex, questions, showIntro, showResults]);

  const handleChoicePress = (choice: Animal) => {
    if (selectedChoice) return; // Already selected, waiting for next

    const question = questions[currentQuestionIndex];
    const isCorrect = choice.id === question.correct.id;

    setSelectedChoice(choice.id);

    if (isCorrect) {
      // Correct answer
      setCorrectCount(correctCount + 1);
      // Move to next question after a short delay
      setTimeout(() => {
        moveToNext();
      }, 800);
    } else {
      // Wrong answer
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        // Second wrong attempt, move to next
        setTimeout(() => {
          moveToNext();
        }, 800);
      } else {
        // First wrong attempt, just highlight red but don't advance
        setTimeout(() => {
          setSelectedChoice(null);
        }, 800);
      }
    }
  };

  const moveToNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    setSelectedChoice(null);
    setAttempts(0);

    if (nextIndex >= questions.length) {
      // Game over
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handleComplete = async () => {
    const passed = correctCount >= QUESTIONS_PER_GAME * PASS_THRESHOLD;
    if (passed) {
      await completeSubject('science');
    }
    router.back();
  };

  const handleTryAgain = () => {
    startGame();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🔊 Animal Sounds 🔊</Text>
          <Text style={styles.introText}>Listen to the sound and tap the correct animal!</Text>
          <Text style={styles.introText}>You need 8 out of 10 correct to pass.</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showResults) {
    const passed = correctCount >= QUESTIONS_PER_GAME * PASS_THRESHOLD;
    const percentage = Math.round((correctCount / QUESTIONS_PER_GAME) * 100);

    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, !passed && styles.resultsTitleFail]}>
            {passed ? '🎉 Great Job! 🎉' : 'Keep Trying!'}
          </Text>
          <Text style={styles.resultsScore}>
            You got {correctCount} out of {QUESTIONS_PER_GAME} correct!
          </Text>
          <Text style={styles.resultsPercentage}>{percentage}%</Text>

          {passed ? (
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete Science ✓</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.tryAgainMessage}>You need 80% to pass. Try again!</Text>
              <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
                <Text style={styles.tryAgainButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Back to Locker</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#95E1D3" />
      </View>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Listen and Choose</Text>
        <Text style={styles.progress}>
          Question {currentQuestionIndex + 1} of {QUESTIONS_PER_GAME}
        </Text>
        <Text style={styles.scoreText}>
          Correct: {correctCount} / {QUESTIONS_PER_GAME}
        </Text>
      </View>

      <View style={styles.gameArea}>
        {/* Play Sound Button */}
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => playSound(question.correct.sound)}>
          <Text style={styles.soundButtonEmoji}>🔊</Text>
          <Text style={styles.soundButtonText}>Tap to Hear Sound</Text>
        </TouchableOpacity>

        {/* Choice Grid */}
        <View style={styles.choicesContainer}>
          {question.choices.map((choice) => {
            const isSelected = selectedChoice === choice.id;
            const isCorrect = choice.id === question.correct.id;
            const showRed = isSelected && !isCorrect;
            const showGreen = isSelected && isCorrect;

            return (
              <TouchableOpacity
                key={choice.id}
                style={[
                  styles.choiceButton,
                  showRed && styles.choiceButtonWrong,
                  showGreen && styles.choiceButtonCorrect,
                ]}
                onPress={() => handleChoicePress(choice)}
                disabled={!!selectedChoice}>
                <Text style={styles.choiceEmoji}>{choice.emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {attempts === 1 && !selectedChoice && (
          <Text style={styles.hintText}>Try again!</Text>
        )}
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
    backgroundColor: '#95E1D3',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progress: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 5,
  },
  scoreText: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  soundButton: {
    backgroundColor: '#95E1D3',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  soundButtonEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  soundButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
  },
  choiceButton: {
    width: Math.min((width - 60) / 2, 150),
    height: Math.min((width - 60) / 2, 150),
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 4,
    borderColor: '#95E1D3',
  },
  choiceButtonWrong: {
    backgroundColor: '#FFCDD2',
    borderColor: '#F44336',
  },
  choiceButtonCorrect: {
    backgroundColor: '#C8E6C9',
    borderColor: '#4CAF50',
  },
  choiceEmoji: {
    fontSize: 70,
  },
  hintText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 20,
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
    color: '#95E1D3',
    marginBottom: 20,
  },
  introText: {
    fontSize: 22,
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
    textAlign: 'center',
  },
  resultsTitleFail: {
    color: '#FF9800',
  },
  resultsScore: {
    fontSize: 26,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#95E1D3',
    marginBottom: 30,
  },
  tryAgainMessage: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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
  tryAgainButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  tryAgainButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#9E9E9E',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
