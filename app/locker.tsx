import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgress, Subject } from '@/contexts/progress-context';

const { width, height } = Dimensions.get('window');

interface Book {
  subject: Subject;
  title: string;
  color: string;
  icon: string;
  route: string;
}

const BOOKS: Book[] = [
  { subject: 'reading', title: 'Reading', color: '#FF6B9D', icon: '🎈', route: '/games/reading' },
  { subject: 'math', title: 'Math', color: '#FF6B6B', icon: '🍎', route: '/games/math' },
  { subject: 'science', title: 'Science', color: '#95E1D3', icon: '🔊', route: '/games/science' },
  { subject: 'social-studies', title: 'Social Studies', color: '#4ECDC4', icon: '👥', route: '/games/social-studies' },
  { subject: 'feelings', title: 'Feelings', color: '#FFA502', icon: '😊', route: '/games/feelings' },
  { subject: 'writing', title: 'Writing', color: '#A29BFE', icon: '✏️', route: '/games/writing' },
  { subject: 'art', title: 'Art', color: '#FD79A8', icon: '🎨', route: '/games/art' },
  { subject: 'music', title: 'Music', color: '#FDCB6E', icon: '🎵', route: '/games/music' },
  { subject: 'shapes', title: 'Shapes', color: '#74B9FF', icon: '⬜', route: '/games/shapes' },
  { subject: 'health', title: 'Health', color: '#55EFC4', icon: '🥗', route: '/games/health' },
  { subject: 'pe', title: 'P.E.', color: '#81ECEC', icon: '🏃', route: '/games/pe' },
  { subject: 'life-skills', title: 'Life Skills', color: '#FAB1A0', icon: '👕', route: '/games/life-skills' },
  { subject: 'study-hall', title: 'Study Hall', color: '#DFE6E9', icon: '📚', route: '/games/study-hall' },
];

export default function Locker() {
  const router = useRouter();
  const { progress, getTodayProgress, isAllComplete } = useProgress();
  const todayCompleted = getTodayProgress();
  const allComplete = isAllComplete();

  const handleBookPress = (book: Book) => {
    router.push(book.route as any);
  };

  const completedCount = todayCompleted.length;

  return (
    <View style={styles.container}>
      <View style={styles.lockerFrame}>
        <View style={styles.lockerHeader}>
          <Text style={styles.headerText}>MY KINDERGARTEN DAY</Text>
        </View>

        <ScrollView
          style={styles.bookshelf}
          contentContainerStyle={styles.bookshelfContent}>

          {/* Progress Header */}
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {completedCount} of 13 Complete
            </Text>
            {allComplete && (
              <Text style={styles.allDoneText}>🎉 All Done! Pick Your Sticker! 🎉</Text>
            )}
          </View>

          {/* Books Grid */}
          <View style={styles.booksGrid}>
            {BOOKS.map((book) => {
              const isCompleted = todayCompleted.includes(book.subject);

              return (
                <TouchableOpacity
                  key={book.subject}
                  activeOpacity={0.7}
                  onPress={() => handleBookPress(book)}
                  style={styles.bookContainer}>
                  <View style={[styles.book, { backgroundColor: book.color }]}>
                    <Text style={styles.bookIcon}>{book.icon}</Text>
                    <Text style={styles.bookTitle}>{book.title}</Text>

                    {/* Checkmark if completed */}
                    {isCompleted && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Day Complete Sticker */}
          {progress.dayCompleted && progress.sticker && (
            <View style={styles.dayStickerContainer}>
              <Text style={styles.dayStickerTitle}>Today's Sticker:</Text>
              <Text style={styles.daySticker}>{progress.sticker}</Text>
            </View>
          )}
        </ScrollView>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to School</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockerFrame: {
    width: Math.min(width * 0.9, 700),
    height: height * 0.9,
    backgroundColor: '#B8860B',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  lockerHeader: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
  },
  bookshelf: {
    flex: 1,
    backgroundColor: '#D2691E',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bookshelfContent: {
    padding: 15,
  },
  progressHeader: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  allDoneText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
  },
  bookContainer: {
    width: '30%',
    marginBottom: 15,
  },
  book: {
    aspectRatio: 0.7,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFF',
    padding: 5,
  },
  bookIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  checkmarkText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dayStickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  dayStickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
  },
  daySticker: {
    fontSize: 60,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
