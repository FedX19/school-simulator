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
import { shuffleArray } from '@/utils/shuffle';

interface QuizQuestion {
  subject: string;
  question: string;
  emoji: string;
  options: string[];
  correct: string;
}

const QUIZ: QuizQuestion[] = [
  { subject: 'Reading', emoji: '🎈', question: 'What letter is this: A', options: ['A', 'B', 'C', 'D'], correct: 'A' },
  { subject: 'Math', emoji: '🍎', question: '2 + 1 = ?', options: ['2', '3', '4', '5'], correct: '3' },
  { subject: 'Science', emoji: '🔊', question: 'What sound does a dog make?', options: ['Woof!', 'Meow!', 'Moo!', 'Quack!'], correct: 'Woof!' },
  { subject: 'Social Studies', emoji: '👥', question: 'Who teaches students?', options: ['Teacher', 'Doctor', 'Chef', 'Police'], correct: 'Teacher' },
  { subject: 'Feelings', emoji: '😊', question: 'This face is:', options: ['Happy', 'Sad', 'Angry', 'Scared'], correct: 'Happy' },
  { subject: 'Writing', emoji: '✏️', question: 'We use this to write:', options: ['Pencil', 'Spoon', 'Ball', 'Shoe'], correct: 'Pencil' },
  { subject: 'Art', emoji: '🎨', question: 'What color is the sky?', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 'Blue' },
  { subject: 'Music', emoji: '🎵', question: 'We play drums by:', options: ['Tapping', 'Throwing', 'Eating', 'Sitting'], correct: 'Tapping' },
  { subject: 'Shapes', emoji: '⬜', question: 'A ball is a:', options: ['Circle', 'Square', 'Triangle', 'Star'], correct: 'Circle' },
  { subject: 'Health', emoji: '🥗', question: 'Which is healthy?', options: ['Apple', 'Candy', 'Soda', 'Cake'], correct: 'Apple' },
  { subject: 'P.E.', emoji: '🏃', question: 'Running is good for:', options: ['Exercise', 'Sleeping', 'Reading', 'Eating'], correct: 'Exercise' },
  { subject: 'Life Skills', emoji: '👕', question: 'We wear these on our feet:', options: ['Shoes', 'Hats', 'Gloves', 'Pants'], correct: 'Shoes' },
];

export default function StudyHallGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuiz, setShuffledQuiz] = useState<QuizQuestion[]>([]);

  const totalQuestions = 12;
  const question = shuffledQuiz[currentQuestion];

  const startGame = () => {
    // Shuffle question order
    const shuffledQuestions = shuffleArray(QUIZ).slice(0, totalQuestions);

    // Shuffle options for each question
    const questionsWithShuffledOptions = shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setShuffledQuiz(questionsWithShuffledOptions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setShowIntro(false);
  };

  const handleAnswer = (answer: string) => {
    if (answer === question.correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 >= totalQuestions) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('study-hall');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.introContainer}>
          <Text style={styles.introTitle}>📚 Study Hall Review 📚</Text>
          <Text style={styles.introText}>Review what we learned today!</Text>
          <Text style={styles.introText}>12 questions from all subjects!</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startGame}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (showResults) {
    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Great Review!</Text>
          <Text style={styles.resultsScore}>You got {score} out of {totalQuestions} correct!</Text>
          <Text style={styles.resultsEmoji}>📚✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Study Hall ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!question) {
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
        <Text style={styles.subjectText}>{question.subject} {question.emoji}</Text>
        <Text style={styles.progress}>Question {currentQuestion + 1} of {totalQuestions}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gameArea}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: '#DFE6E9',
    padding: 20,
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progress: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flexGrow: 1,
  },
  questionContainer: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#DFE6E9',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  introContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  introTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#636E72',
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
    textAlign: 'center',
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
