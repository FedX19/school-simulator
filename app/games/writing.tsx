import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';
import TracingCanvas from '@/components/tracing/TracingCanvas';
import { LETTER_DEFINITIONS, shuffleArray, type LetterDefinition } from '@/data/letters';

const LETTERS_PER_GAME = 10;
const PASS_THRESHOLD = 0.8; // 80% (8/10 letters)

export default function WritingGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();

  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [gameLetters, setGameLetters] = useState<LetterDefinition[]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [lettersPassed, setLettersPassed] = useState<boolean[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const startGame = () => {
    // Randomize letter order
    const shuffled = shuffleArray([...LETTER_DEFINITIONS]);
    const selected = shuffled.slice(0, LETTERS_PER_GAME);
    setGameLetters(selected);
    setCurrentLetterIndex(0);
    setLettersPassed([]);
    setCurrentProgress(0);
    setShowIntro(false);
    setShowResults(false);
  };

  const handleLetterComplete = () => {
    // Mark current letter as passed
    const newPassed = [...lettersPassed];
    newPassed[currentLetterIndex] = true;
    setLettersPassed(newPassed);

    // Move to next letter or show results
    if (currentLetterIndex + 1 >= LETTERS_PER_GAME) {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentLetterIndex(currentLetterIndex + 1);
        setCurrentProgress(0);
      }, 500);
    }
  };

  const handleSkipLetter = () => {
    // Mark current letter as NOT passed
    const newPassed = [...lettersPassed];
    newPassed[currentLetterIndex] = false;
    setLettersPassed(newPassed);

    // Move to next letter or show results
    if (currentLetterIndex + 1 >= LETTERS_PER_GAME) {
      setShowResults(true);
    } else {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setCurrentProgress(0);
    }
  };

  const handleProgressUpdate = (progress: number) => {
    setCurrentProgress(progress);
  };

  const handleTraceStart = () => {
    setScrollEnabled(false);
  };

  const handleTraceEnd = () => {
    setScrollEnabled(true);
  };

  const handleComplete = async () => {
    const passedCount = lettersPassed.filter(Boolean).length;
    const passed = passedCount >= LETTERS_PER_GAME * PASS_THRESHOLD;

    if (passed) {
      await completeSubject('writing');
    }
    router.back();
  };

  const handleTryAgain = () => {
    startGame();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.introContainer}>
          <Text style={styles.introTitle}>✏️ Letter Tracing ✏️</Text>
          <Text style={styles.introText}>Trace 10 letters with your finger!</Text>
          <Text style={styles.introText}>Follow the guide and trace carefully.</Text>
          <Text style={styles.introText}>You need 8 out of 10 to pass.</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (showResults) {
    const passedCount = lettersPassed.filter(Boolean).length;
    const passed = passedCount >= LETTERS_PER_GAME * PASS_THRESHOLD;
    const percentage = Math.round((passedCount / LETTERS_PER_GAME) * 100);

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, !passed && styles.resultsTitleFail]}>
            {passed ? '✏️ Amazing Writing! ✏️' : 'Keep Practicing!'}
          </Text>
          <Text style={styles.resultsScore}>
            You completed {passedCount} out of {LETTERS_PER_GAME} letters!
          </Text>
          <Text style={styles.resultsPercentage}>{percentage}%</Text>

          {passed ? (
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete Writing ✓</Text>
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
        </ScrollView>
      </View>
    );
  }

  if (gameLetters.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const currentLetter = gameLetters[currentLetterIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Trace the Letter</Text>
        <Text style={styles.letterDisplay}>{currentLetter.letter}</Text>
        <Text style={styles.progress}>
          Letter {currentLetterIndex + 1} of {LETTERS_PER_GAME}
        </Text>
        <Text style={styles.progressText}>
          Progress: {Math.round(currentProgress * 100)}%
        </Text>
      </View>

      <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={styles.gameArea}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Trace along the purple guide with your finger
          </Text>
        </View>

        <TracingCanvas
          key={`trace-${currentLetter.letter}-${currentLetterIndex}`}
          mode="teach"
          letter={currentLetter}
          onLetterComplete={handleLetterComplete}
          onProgressUpdate={handleProgressUpdate}
          onTraceStart={handleTraceStart}
          onTraceEnd={handleTraceEnd}
        />

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${currentProgress * 100}%` },
              ]}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkipLetter}>
          <Text style={styles.skipButtonText}>Skip Letter →</Text>
        </TouchableOpacity>
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
    backgroundColor: '#A29BFE',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  letterDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  progress: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 5,
  },
  progressText: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 3,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionContainer: {
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  skipButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
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
    color: '#A29BFE',
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
  resultsTitleFail: {
    color: '#FF5722',
  },
  resultsScore: {
    fontSize: 28,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#A29BFE',
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
  tryAgainMessage: {
    fontSize: 20,
    color: '#FF5722',
    marginBottom: 20,
    textAlign: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  },
});
