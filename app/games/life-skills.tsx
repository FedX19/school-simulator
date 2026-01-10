import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const OUTFITS = [
  {
    name: 'School Day',
    correct: ['👕', '👖', '👟'],
    wrong: ['🩱', '🎩'],
  },
  {
    name: 'Bedtime',
    correct: ['👔', '🩳'],
    wrong: ['🥾', '👗', '🎩'],
  },
];

export default function LifeSkillsGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();
  const [currentOutfit, setCurrentOutfit] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const totalOutfits = 2;
  const outfit = OUTFITS[currentOutfit];
  const allItems = [...outfit.correct, ...outfit.wrong].sort(() => Math.random() - 0.5);

  const startGame = () => {
    setShowIntro(false);
  };

  const handleItemTap = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleDone = () => {
    // Check if all correct items selected and no wrong items
    const isCorrect = outfit.correct.every(item => selectedItems.includes(item)) &&
                     selectedItems.every(item => outfit.correct.includes(item)) &&
                     selectedItems.length === outfit.correct.length;

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentOutfit + 1 >= totalOutfits) {
      setShowResults(true);
    } else {
      setCurrentOutfit(currentOutfit + 1);
      setSelectedItems([]);
    }
  };

  const handleComplete = async () => {
    await completeSubject('life-skills');
    router.back();
  };

  if (showIntro) {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>👕 Getting Dressed 👕</Text>
          <Text style={styles.introText}>Pick the right clothes!</Text>
          <Text style={styles.introText}>Choose what to wear!</Text>
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
          <Text style={styles.resultsTitle}>Great Choices!</Text>
          <Text style={styles.resultsScore}>You dressed correctly {score} times!</Text>
          <Text style={styles.resultsEmoji}>👕✨</Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Life Skills ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{outfit.name}</Text>
        <Text style={styles.progress}>Outfit {currentOutfit + 1} of {totalOutfits}</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Your Outfit:</Text>
          <View style={styles.selectedItems}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item, idx) => (
                <Text key={idx} style={styles.selectedEmoji}>{item}</Text>
              ))
            ) : (
              <Text style={styles.emptyText}>Tap clothes below!</Text>
            )}
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Available Clothes:</Text>
          <View style={styles.items}>
            {allItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.itemButton,
                  selectedItems.includes(item) && styles.itemSelected
                ]}
                onPress={() => handleItemTap(item)}>
                <Text style={styles.itemEmoji}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}>
          <Text style={styles.doneButtonText}>I'm Dressed! ✓</Text>
        </TouchableOpacity>
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
    backgroundColor: '#FAB1A0',
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
    padding: 20,
    justifyContent: 'space-around',
  },
  selectedContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    minHeight: 120,
  },
  selectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectedEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  itemsContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemButton: {
    width: 70,
    height: 70,
    backgroundColor: '#FAB1A0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSelected: {
    opacity: 0.3,
  },
  itemEmoji: {
    fontSize: 36,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  doneButtonText: {
    fontSize: 24,
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
    color: '#FAB1A0',
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
