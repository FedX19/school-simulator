import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const SHAPES = ['Circle', 'Square', 'Triangle'];

export default function ShapesGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [targetShape, setTargetShape] = useState('');
  const [shapes, setShapes] = useState<string[]>([]);

  const totalRounds = 3;

  const startGame = () => {
    setShowIntro(false);
    setupRound(0);
  };

  const setupRound = (roundNum: number) => {
    const target = SHAPES[roundNum % SHAPES.length];
    setTargetShape(target);

    // Show all 3 shapes in random order
    const allShapes = [...SHAPES].sort(() => Math.random() - 0.5);
    setShapes(allShapes);
    setCurrentRound(roundNum);
  };

  const handleShapeTap = (shape: string) => {
    if (shape === targetShape) {
      setScore(score + 1);
    }

    if (currentRound + 1 >= totalRounds) {
      setShowResults(true);
    } else {
      setupRound(currentRound + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('shapes');
    router.back();
  };

  const renderShape = (shape: string) => {
    switch (shape) {
      case 'Circle':
        return <View style={styles.circle} />;
      case 'Square':
        return <View style={styles.square} />;
      case 'Triangle':
        return <View style={styles.triangleContainer}>
          <View style={styles.triangle} />
        </View>;
      default:
        return null;
    }
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>⬜ Shapes ⬜</Text>
          <Text style={styles.introText}>Find the shape I ask for!</Text>
          <Text style={styles.introText}>Circle, Square, or Triangle?</Text>
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
          <Text style={styles.resultsScore}>You got {score} out of {totalRounds} correct!</Text>
          <Text style={styles.resultsEmoji}>⬜✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Shapes ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Find the: {targetShape}</Text>
        <Text style={styles.progress}>Shape {currentRound + 1} of {totalRounds}</Text>
      </View>

      <View style={styles.gameArea}>
        {shapes.map((shape) => (
          <TouchableOpacity
            key={shape}
            style={styles.shapeButton}
            onPress={() => handleShapeTap(shape)}>
            {renderShape(shape)}
            <Text style={styles.shapeLabel}>{shape}</Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: '#74B9FF',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progress: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 5,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 30,
  },
  shapeButton: {
    alignItems: 'center',
    padding: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#74B9FF',
    marginBottom: 10,
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: '#74B9FF',
    marginBottom: 10,
  },
  triangleContainer: {
    width: 100,
    height: 100,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 87,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#74B9FF',
  },
  shapeLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#74B9FF',
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
