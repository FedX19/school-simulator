import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';
import { shuffleArray } from '@/utils/shuffle';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

interface Helper {
  id: string;
  name: string;
  emoji: string;
  // Placeholder for actual image asset path
  imagePath?: string;
}

interface Question {
  id: string;
  audioPrompt: string; // Text description of audio (for now, will be audio file path later)
  correctHelper: Helper;
  // Placeholder for actual audio file path
  audioPath?: string;
}

// Community Helpers pool
const HELPERS: Helper[] = [
  { id: 'firefighter', name: 'Firefighter', emoji: '👨‍🚒' },
  { id: 'doctor', name: 'Doctor', emoji: '👨‍⚕️' },
  { id: 'teacher', name: 'Teacher', emoji: '👨‍🏫' },
  { id: 'police', name: 'Police Officer', emoji: '👮' },
  { id: 'chef', name: 'Chef', emoji: '👨‍🍳' },
  { id: 'mailcarrier', name: 'Mail Carrier', emoji: '📬' },
  { id: 'farmer', name: 'Farmer', emoji: '👨‍🌾' },
  { id: 'nurse', name: 'Nurse', emoji: '👩‍⚕️' },
  { id: 'dentist', name: 'Dentist', emoji: '🦷' },
  { id: 'builder', name: 'Builder', emoji: '👷' },
  { id: 'busdriver', name: 'Bus Driver', emoji: '🚌' },
  { id: 'librarian', name: 'Librarian', emoji: '📚' },
  { id: 'veterinarian', name: 'Veterinarian', emoji: '🐕' },
  { id: 'pilot', name: 'Pilot', emoji: '✈️' },
  { id: 'artist', name: 'Artist', emoji: '🎨' },
];

// Question pool (15+ questions)
const QUESTION_POOL: Question[] = [
  { id: 'q1', audioPrompt: 'Who puts out fires?', correctHelper: HELPERS[0] },
  { id: 'q2', audioPrompt: 'Who helps sick people feel better?', correctHelper: HELPERS[1] },
  { id: 'q3', audioPrompt: 'Who teaches students at school?', correctHelper: HELPERS[2] },
  { id: 'q4', audioPrompt: 'Who keeps us safe?', correctHelper: HELPERS[3] },
  { id: 'q5', audioPrompt: 'Who cooks food at restaurants?', correctHelper: HELPERS[4] },
  { id: 'q6', audioPrompt: 'Who brings mail to our house?', correctHelper: HELPERS[5] },
  { id: 'q7', audioPrompt: 'Who grows food on a farm?', correctHelper: HELPERS[6] },
  { id: 'q8', audioPrompt: 'Who helps people in the hospital?', correctHelper: HELPERS[7] },
  { id: 'q9', audioPrompt: 'Who checks our teeth?', correctHelper: HELPERS[8] },
  { id: 'q10', audioPrompt: 'Who builds houses and buildings?', correctHelper: HELPERS[9] },
  { id: 'q11', audioPrompt: 'Who drives the school bus?', correctHelper: HELPERS[10] },
  { id: 'q12', audioPrompt: 'Who helps us find books?', correctHelper: HELPERS[11] },
  { id: 'q13', audioPrompt: 'Who helps sick animals?', correctHelper: HELPERS[12] },
  { id: 'q14', audioPrompt: 'Who flies airplanes?', correctHelper: HELPERS[13] },
  { id: 'q15', audioPrompt: 'Who makes beautiful paintings?', correctHelper: HELPERS[14] },
];

const QUESTIONS_PER_GAME = 10;
const PASS_THRESHOLD = 0.8;

interface QuestionWithOptions {
  question: Question;
  options: Helper[];
}

export default function SocialStudiesGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();

  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const feedbackScale = useState(new Animated.Value(1))[0];

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Auto-play audio prompt when question changes
  useEffect(() => {
    if (!showIntro && !showResults && gameQuestions.length > 0) {
      playAudioPrompt();
    }
  }, [currentQuestionIndex, showIntro, showResults]);

  const playAudioPrompt = async () => {
    // Placeholder: In production, this would load and play actual audio file
    // For now, we'll just show the text prompt in the UI
    // Example with actual audio file:
    // const { sound } = await Audio.Sound.createAsync(
    //   require(`@/assets/audio/${gameQuestions[currentQuestionIndex].question.audioPath}`)
    // );
    // await sound.playAsync();
    // setSound(sound);
  };

  const startGame = () => {
    // Select 10 random questions
    const selectedQuestions = shuffleArray(QUESTION_POOL).slice(0, QUESTIONS_PER_GAME);

    // For each question, create 3 answer options (1 correct + 2 wrong)
    const questionsWithOptions: QuestionWithOptions[] = selectedQuestions.map(q => {
      const wrongHelpers = HELPERS.filter(h => h.id !== q.correctHelper.id);
      const selectedWrong = shuffleArray(wrongHelpers).slice(0, 2);
      const allOptions = shuffleArray([q.correctHelper, ...selectedWrong]);

      return {
        question: q,
        options: allOptions,
      };
    });

    setGameQuestions(questionsWithOptions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFeedback(null);
    setShowIntro(false);
    setShowResults(false);
  };

  const handleAnswer = (selectedHelper: Helper) => {
    const currentQ = gameQuestions[currentQuestionIndex];
    const isCorrect = selectedHelper.id === currentQ.question.correctHelper.id;

    if (isCorrect) {
      setShowFeedback('correct');
      setScore(score + 1);

      // Animate correct feedback
      Animated.sequence([
        Animated.timing(feedbackScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Move to next question after delay
      setTimeout(() => {
        setShowFeedback(null);
        if (currentQuestionIndex + 1 >= QUESTIONS_PER_GAME) {
          setShowResults(true);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 1500);
    } else {
      // Incorrect - show feedback but don't advance
      setShowFeedback('incorrect');

      // Shake animation for incorrect
      Animated.sequence([
        Animated.timing(feedbackScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackScale, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Clear incorrect feedback after delay
      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  const handleComplete = async () => {
    const passed = score >= QUESTIONS_PER_GAME * PASS_THRESHOLD;
    if (passed) {
      await completeSubject('social-studies');
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
          <Text style={styles.introTitle}>👥 Who Helps Us? 👥</Text>
          <Text style={styles.introIcon}>🔊</Text>
          <Text style={styles.introText}>Listen to the question</Text>
          <Text style={styles.introText}>Tap the helper who can help!</Text>
          <Text style={styles.introSubtext}>10 questions • No reading required</Text>
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
    const passed = score >= QUESTIONS_PER_GAME * PASS_THRESHOLD;
    const percentage = Math.round((score / QUESTIONS_PER_GAME) * 100);

    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, !passed && styles.resultsTitleFail]}>
            {passed ? '🎉 Great Job! 🎉' : 'Keep Practicing!'}
          </Text>
          <Text style={styles.resultsScore}>
            You got {score} out of {QUESTIONS_PER_GAME} correct!
          </Text>
          <Text style={styles.resultsPercentage}>{percentage}%</Text>

          {passed ? (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete Social Studies ✓</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.tryAgainMessage}>You need 80% to pass. Try again!</Text>
              <TouchableOpacity
                style={styles.tryAgainButton}
                onPress={handleTryAgain}>
                <Text style={styles.tryAgainButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Back to Locker</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  if (gameQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.gameArea}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  const currentQ = gameQuestions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔊</Text>
        <Text style={styles.audioPrompt}>{currentQ.question.audioPrompt}</Text>
        <Text style={styles.progress}>
          Question {currentQuestionIndex + 1} of {QUESTIONS_PER_GAME}
        </Text>
      </View>

      {/* Answer Options */}
      <View style={styles.gameArea}>
        <View style={styles.optionsContainer}>
          {currentQ.options.map((helper) => (
            <Animated.View
              key={helper.id}
              style={[
                {
                  transform: [{ scale: feedbackScale }],
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  showFeedback === 'correct' && helper.id === currentQ.question.correctHelper.id && styles.optionButtonCorrect,
                  showFeedback === 'incorrect' && styles.optionButtonIncorrect,
                ]}
                onPress={() => handleAnswer(helper)}
                disabled={showFeedback !== null}>
                <Text style={styles.helperEmoji}>{helper.emoji}</Text>
                <Text style={styles.helperName}>{helper.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Feedback Message */}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            {showFeedback === 'correct' ? (
              <>
                <Text style={styles.feedbackEmoji}>✅</Text>
                <Text style={styles.feedbackText}>Great job!</Text>
              </>
            ) : (
              <>
                <Text style={styles.feedbackEmoji}>🤔</Text>
                <Text style={styles.feedbackText}>Try again!</Text>
              </>
            )}
          </View>
        )}

        {/* Replay Audio Button */}
        <TouchableOpacity
          style={styles.replayButton}
          onPress={playAudioPrompt}>
          <Text style={styles.replayIcon}>🔊</Text>
          <Text style={styles.replayText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  header: {
    backgroundColor: '#4ECDC4',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  audioPrompt: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  progress: {
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
  optionsContainer: {
    width: '100%',
    maxWidth: 500,
    gap: 20,
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#4ECDC4',
  },
  optionButtonCorrect: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  optionButtonIncorrect: {
    backgroundColor: '#FFE0E0',
    borderColor: '#FF5252',
  },
  helperEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  helperName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  feedbackEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  replayButton: {
    marginTop: 30,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  replayIcon: {
    fontSize: 24,
  },
  replayText: {
    fontSize: 18,
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
    color: '#4ECDC4',
    marginBottom: 20,
  },
  introIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  introText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  introSubtext: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    color: '#4ECDC4',
    marginBottom: 30,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 24,
    color: '#333',
  },
});
