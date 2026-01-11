import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';
import { shuffleArray } from '@/utils/shuffle';

interface ColorPair {
  name: string;
  color: string;
  options: { name: string; color: string }[];
}

const COLORS: ColorPair[] = [
  {
    name: 'Red',
    color: '#FF0000',
    options: [
      { name: 'Red', color: '#FF0000' },
      { name: 'Blue', color: '#0000FF' },
      { name: 'Yellow', color: '#FFFF00' },
      { name: 'Green', color: '#00FF00' },
    ]
  },
  {
    name: 'Blue',
    color: '#0000FF',
    options: [
      { name: 'Blue', color: '#0000FF' },
      { name: 'Red', color: '#FF0000' },
      { name: 'Purple', color: '#800080' },
      { name: 'Orange', color: '#FFA500' },
    ]
  },
  {
    name: 'Yellow',
    color: '#FFFF00',
    options: [
      { name: 'Yellow', color: '#FFFF00' },
      { name: 'Green', color: '#00FF00' },
      { name: 'Orange', color: '#FFA500' },
      { name: 'Red', color: '#FF0000' },
    ]
  },
  {
    name: 'Green',
    color: '#00FF00',
    options: [
      { name: 'Green', color: '#00FF00' },
      { name: 'Blue', color: '#0000FF' },
      { name: 'Yellow', color: '#FFFF00' },
      { name: 'Purple', color: '#800080' },
    ]
  },
];

export default function ArtGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [shuffledColors, setShuffledColors] = useState<ColorPair[]>([]);

  const totalRounds = 4;
  const currentColor = shuffledColors[currentRound];

  const startGame = () => {
    // Shuffle colors order
    const shuffledList = shuffleArray(COLORS);

    // Shuffle options for each color
    const colorsWithShuffledOptions = shuffledList.map(c => ({
      ...c,
      options: shuffleArray(c.options),
    }));

    setShuffledColors(colorsWithShuffledOptions);
    setCurrentRound(0);
    setScore(0);
    setShowResults(false);
    setShowIntro(false);
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentColor.name) {
      setScore(score + 1);
    }

    if (currentRound + 1 >= totalRounds) {
      setShowResults(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleComplete = async () => {
    await completeSubject('art');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>🎨 Color Match 🎨</Text>
          <Text style={styles.introText}>Match the color name!</Text>
          <Text style={styles.introText}>What color is this?</Text>
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
          <Text style={styles.resultsEmoji}>🎨✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Art ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentColor) {
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
        <Text style={styles.headerText}>What color is this?</Text>
        <Text style={styles.progress}>Color {currentRound + 1} of {totalRounds}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={[styles.colorBox, { backgroundColor: currentColor.color }]} />

        <View style={styles.optionsContainer}>
          {currentColor.options.map((option) => (
            <TouchableOpacity
              key={option.name}
              style={[styles.optionButton, { backgroundColor: option.color }]}
              onPress={() => handleAnswer(option.name)}>
              <Text style={styles.optionText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: '#FD79A8',
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
  },
  colorBox: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  optionButton: {
    width: 120,
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
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    color: '#FD79A8',
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
