import React, { useState, useEffect, useRef } from 'react';
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

const { width, height } = Dimensions.get('window');

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function ReadingGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [targetLetter, setTargetLetter] = useState('');
  const [balloons, setBalloons] = useState<{ letter: string; id: number }[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);

  const balloonPositions = useRef<{ x: Animated.Value; y: Animated.Value }[]>([]).current;

  useEffect(() => {
    if (!showIntro && !showResults && currentRound < shuffledLetters.length) {
      setupRound();
    }
  }, [currentRound, showIntro, showResults]);

  const setupRound = () => {
    const target = shuffledLetters[currentRound];
    setTargetLetter(target);

    // Create 4 balloons: 1 correct, 3 random wrong letters
    const wrongLetters = shuffledLetters.filter(l => l !== target);
    const shuffledWrong = shuffleArray(wrongLetters).slice(0, 3);
    const allBalloons = shuffleArray([target, ...shuffledWrong])
      .map((letter, idx) => ({ letter, id: idx }));

    setBalloons(allBalloons);

    // Clear old animations
    balloonPositions.length = 0;

    // Create floating animations for each balloon
    allBalloons.forEach(() => {
      const xPos = new Animated.Value(Math.random() * (width - 140) + 20);
      const yPos = new Animated.Value(Math.random() * 200 + 100);
      balloonPositions.push({ x: xPos, y: yPos });

      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(xPos, {
              toValue: Math.random() * (width - 140) + 20,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(yPos, {
              toValue: Math.random() * 200 + 100,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  };

  const startGame = () => {
    // Shuffle letter sequence
    setShuffledLetters(shuffleArray(LETTERS));
    setCurrentRound(0);
    setScore(0);
    setShowResults(false);
    setShowIntro(false);
  };

  const handleBalloonPress = (letter: string) => {
    if (letter === targetLetter) {
      setScore(score + 1);
    }

    if (currentRound + 1 >= shuffledLetters.length) {
      setShowResults(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('reading');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🎈 Letter Balloons 🎈</Text>
          <Text style={styles.introText}>Pop the balloon with the letter I say!</Text>
          <Text style={styles.introText}>Listen carefully and find the right letter.</Text>
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
    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Great Job!</Text>
          <Text style={styles.resultsScore}>You got {score} out of {shuffledLetters.length} letters!</Text>
          <Text style={styles.resultsEmoji}>🎈✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Reading ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Find the letter:</Text>
        <Text style={styles.targetLetter}>{targetLetter}</Text>
        <Text style={styles.progress}>Letter {currentRound + 1} of {shuffledLetters.length}</Text>
      </View>

      <View style={styles.gameArea}>
        {balloons.map((balloon, index) => {
          const pos = balloonPositions[index];
          if (!pos) return null;

          return (
            <Animated.View
              key={balloon.id}
              style={[
                styles.balloonContainer,
                {
                  transform: [
                    { translateX: pos.x },
                    { translateY: pos.y },
                  ],
                },
              ]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleBalloonPress(balloon.letter)}>
                <View style={styles.balloon}>
                  <Text style={styles.balloonText}>{balloon.letter}</Text>
                </View>
                <View style={styles.balloonString} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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
    backgroundColor: '#FF6B9D',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  targetLetter: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 10,
  },
  progress: {
    fontSize: 18,
    color: '#FFF',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  balloonContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  balloon: {
    width: 90,
    height: 110,
    backgroundColor: '#FF6B9D',
    borderRadius: 45,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  balloonText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  balloonString: {
    width: 2,
    height: 40,
    backgroundColor: '#8B4513',
    alignSelf: 'center',
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
    color: '#FF6B9D',
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
