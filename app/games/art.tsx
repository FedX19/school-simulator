import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress } from '@/contexts/progress-context';

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.min((width - 60) / 10, 50);

// Color palette with numbers
const COLORS = [
  { number: 1, name: 'Red', color: '#FF0000' },
  { number: 2, name: 'Blue', color: '#0066FF' },
  { number: 3, name: 'Yellow', color: '#FFD700' },
  { number: 4, name: 'Green', color: '#00CC00' },
  { number: 5, name: 'Orange', color: '#FF8800' },
  { number: 6, name: 'Purple', color: '#9933FF' },
  { number: 7, name: 'Pink', color: '#FF69B4' },
  { number: 8, name: 'Brown', color: '#8B4513' },
];

interface Template {
  id: string;
  name: string;
  emoji: string;
  grid: number[][]; // Each cell is a color number (1-8)
}

// Templates: 8x8 grids for color-by-numbers
const TEMPLATES: Template[] = [
  {
    id: 'teddy',
    name: 'Teddy Bear',
    emoji: '🧸',
    grid: [
      [0, 8, 8, 8, 8, 8, 8, 0],
      [8, 8, 8, 8, 8, 8, 8, 8],
      [8, 0, 8, 8, 8, 8, 0, 8],
      [8, 8, 8, 8, 8, 8, 8, 8],
      [8, 8, 7, 8, 8, 7, 8, 8],
      [8, 8, 8, 8, 8, 8, 8, 8],
      [8, 8, 8, 7, 7, 8, 8, 8],
      [0, 8, 8, 8, 8, 8, 8, 0],
    ],
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    grid: [
      [7, 7, 0, 0, 0, 0, 7, 7],
      [7, 6, 7, 0, 0, 7, 6, 7],
      [6, 3, 6, 8, 8, 6, 3, 6],
      [6, 6, 6, 8, 8, 6, 6, 6],
      [6, 6, 6, 8, 8, 6, 6, 6],
      [6, 3, 6, 8, 8, 6, 3, 6],
      [7, 6, 7, 0, 0, 7, 6, 7],
      [7, 7, 0, 0, 0, 0, 7, 7],
    ],
  },
  {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 7, 0, 0],
      [0, 0, 7, 0, 0, 7, 0, 0],
      [0, 7, 7, 7, 7, 7, 7, 0],
      [7, 7, 0, 7, 7, 0, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 1, 1, 7, 7, 7],
      [0, 7, 7, 7, 7, 7, 7, 0],
    ],
  },
  {
    id: 'car',
    name: 'Toy Car',
    emoji: '🚗',
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 2, 2, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 8, 8, 1, 1, 8, 8, 1],
      [0, 8, 8, 0, 0, 8, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 'doll',
    name: 'Doll',
    emoji: '🪆',
    grid: [
      [0, 0, 3, 3, 3, 3, 0, 0],
      [0, 3, 3, 3, 3, 3, 3, 0],
      [0, 3, 0, 3, 3, 0, 3, 0],
      [0, 3, 3, 1, 1, 3, 3, 0],
      [0, 0, 6, 6, 6, 6, 0, 0],
      [0, 6, 6, 6, 6, 6, 6, 0],
      [6, 6, 7, 6, 6, 7, 6, 6],
      [0, 6, 6, 6, 6, 6, 6, 0],
    ],
  },
  {
    id: 'puppy',
    name: 'Puppy',
    emoji: '🐶',
    grid: [
      [0, 8, 0, 0, 0, 0, 8, 0],
      [8, 8, 8, 0, 0, 8, 8, 8],
      [8, 0, 8, 8, 8, 8, 0, 8],
      [8, 8, 8, 8, 8, 8, 8, 8],
      [0, 8, 8, 8, 8, 8, 8, 0],
      [0, 8, 8, 1, 1, 8, 8, 0],
      [0, 0, 8, 8, 8, 8, 0, 0],
      [0, 0, 0, 8, 8, 0, 0, 0],
    ],
  },
];

type CellState = number | null; // null = unpainted, number = painted with that color

export default function ArtGame() {
  const router = useRouter();
  const { completeSubject } = useProgress();

  const [showTemplateSelect, setShowTemplateSelect] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [grid, setGrid] = useState<CellState[][]>([]);

  const startGame = (template: Template) => {
    // Initialize grid with null (unpainted)
    const initialGrid = template.grid.map(row => row.map(() => null));
    setGrid(initialGrid);
    setCurrentTemplate(template);
    setSelectedColor(1);
    setShowTemplateSelect(false);
    setShowResults(false);
  };

  const handleCellPress = (rowIndex: number, colIndex: number) => {
    if (!currentTemplate) return;

    const targetColor = currentTemplate.grid[rowIndex][colIndex];
    if (targetColor === 0) return; // Don't paint background cells

    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          return selectedColor;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const calculateScore = () => {
    if (!currentTemplate) return 0;

    let correctCells = 0;
    let totalCells = 0;

    currentTemplate.grid.forEach((row, rIdx) => {
      row.forEach((targetColor, cIdx) => {
        if (targetColor !== 0) {
          totalCells++;
          if (grid[rIdx][cIdx] === targetColor) {
            correctCells++;
          }
        }
      });
    });

    return totalCells > 0 ? Math.round((correctCells / totalCells) * 100) : 0;
  };

  const handleCheckWork = () => {
    setShowResults(true);
  };

  const handleComplete = async () => {
    const score = calculateScore();
    if (score >= 80) {
      await completeSubject('art');
    }
    router.back();
  };

  const handleTryAnother = () => {
    setShowTemplateSelect(true);
    setShowResults(false);
    setCurrentTemplate(null);
  };

  // Template Selection Screen
  if (showTemplateSelect) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎨 Color by Numbers 🎨</Text>
          <Text style={styles.headerSubtitle}>Choose a picture to color!</Text>
        </View>
        <ScrollView contentContainerStyle={styles.templateGrid}>
          {TEMPLATES.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => startGame(template)}>
              <Text style={styles.templateEmoji}>{template.emoji}</Text>
              <Text style={styles.templateName}>{template.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Results Screen
  if (showResults && currentTemplate) {
    const score = calculateScore();
    const passed = score >= 80;

    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, !passed && styles.resultsTitleFail]}>
            {passed ? '🎉 Beautiful! 🎉' : 'Keep Practicing!'}
          </Text>
          <Text style={styles.resultsScore}>
            Accuracy: {score}%
          </Text>
          <Text style={styles.resultsEmoji}>{currentTemplate.emoji}</Text>

          {passed ? (
            <>
              <Text style={styles.resultsMessage}>
                You colored the {currentTemplate.name} perfectly!
              </Text>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}>
                <Text style={styles.completeButtonText}>Complete Art ✓</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.tryAgainMessage}>
                You need 80% accuracy. Try again!
              </Text>
              <TouchableOpacity
                style={styles.tryAgainButton}
                onPress={() => setShowResults(false)}>
                <Text style={styles.tryAgainButtonText}>Keep Coloring</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.anotherButton}
            onPress={handleTryAnother}>
            <Text style={styles.anotherButtonText}>Try Another Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to Locker</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Game Screen
  if (!currentTemplate) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentTemplate.emoji} {currentTemplate.name}
        </Text>
        <Text style={styles.headerSubtitle}>
          Tap a color, then tap the numbers!
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.gameArea}>
        {/* Color Palette */}
        <View style={styles.paletteContainer}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color.number}
              style={[
                styles.paletteButton,
                { backgroundColor: color.color },
                selectedColor === color.number && styles.paletteButtonSelected,
              ]}
              onPress={() => setSelectedColor(color.number)}>
              <Text style={styles.paletteNumber}>{color.number}</Text>
              {selectedColor === color.number && (
                <Text style={styles.paletteCheck}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Coloring Grid */}
        <View style={styles.gridContainer}>
          {currentTemplate.grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((cellTarget, colIndex) => {
                const paintedColor = grid[rowIndex][colIndex];
                const targetColorObj = COLORS.find(c => c.number === cellTarget);
                const paintedColorObj = COLORS.find(c => c.number === paintedColor);
                const isBackground = cellTarget === 0;

                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.gridCell,
                      {
                        backgroundColor: paintedColor
                          ? paintedColorObj?.color
                          : isBackground
                          ? '#F0F0F0'
                          : '#FFFFFF',
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      },
                    ]}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                    disabled={isBackground}>
                    {!isBackground && !paintedColor && (
                      <Text style={styles.cellNumber}>{cellTarget}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Check Work Button */}
        <TouchableOpacity
          style={styles.checkButton}
          onPress={handleCheckWork}>
          <Text style={styles.checkButtonText}>Check My Work!</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  header: {
    backgroundColor: '#FF6B9D',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFF',
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  templateCard: {
    width: 150,
    height: 150,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FF6B9D',
  },
  templateEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  gameArea: {
    alignItems: 'center',
    padding: 20,
  },
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  paletteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#DDD',
    position: 'relative',
  },
  paletteButtonSelected: {
    borderColor: '#FFD700',
    borderWidth: 4,
    transform: [{ scale: 1.1 }],
  },
  paletteNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  paletteCheck: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 16,
    color: '#FFD700',
  },
  gridContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 30,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  checkButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  checkButtonText: {
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
    fontWeight: 'bold',
  },
  resultsEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultsMessage: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  tryAgainMessage: {
    fontSize: 20,
    color: '#FF5722',
    marginBottom: 20,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
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
  anotherButton: {
    backgroundColor: '#9C27B0',
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
  anotherButtonText: {
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
});
