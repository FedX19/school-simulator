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
  route: string;
}

const BOOKS: Book[] = [
  {
    subject: 'math',
    title: 'MATH',
    color: '#FF6B6B',
    route: '/games/math',
  },
  {
    subject: 'reading',
    title: 'READING',
    color: '#4ECDC4',
    route: '/games/reading',
  },
  {
    subject: 'science',
    title: 'SCIENCE',
    color: '#95E1D3',
    route: '/games/science',
  },
];

export default function Locker() {
  const router = useRouter();
  const { progress, getTodayProgress } = useProgress();
  const todayCompleted = getTodayProgress();

  const handleBookPress = (book: Book) => {
    router.push(book.route as any);
  };

  return (
    <View style={styles.container}>
      {/* Locker door frame */}
      <View style={styles.lockerFrame}>
        <View style={styles.lockerHeader}>
          <Text style={styles.headerText}>MY LOCKER</Text>
        </View>

        {/* Bookshelf */}
        <ScrollView
          style={styles.bookshelf}
          contentContainerStyle={styles.bookshelfContent}>
          {/* Books */}
          <View style={styles.booksRow}>
            {BOOKS.map((book) => (
              <TouchableOpacity
                key={book.subject}
                activeOpacity={0.7}
                onPress={() => handleBookPress(book)}
                style={styles.bookContainer}>
                <View style={[styles.book, { backgroundColor: book.color }]}>
                  <Text style={styles.bookTitle}>{book.title}</Text>

                  {/* Show sticker if completed today */}
                  {todayCompleted.includes(book.subject) && (
                    <View style={styles.stickerBadge}>
                      <Text style={styles.stickerText}>
                        {progress[book.subject]?.sticker || '⭐'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Progress section */}
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <View style={styles.progressBars}>
              {BOOKS.map((book) => {
                const isCompleted = todayCompleted.includes(book.subject);
                return (
                  <View key={book.subject} style={styles.progressItem}>
                    <Text style={styles.subjectName}>{book.title}</Text>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor: isCompleted ? book.color : '#E0E0E0',
                            width: isCompleted ? '100%' : '0%',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.statusText}>
                      {isCompleted ? '✓' : '○'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Sticker collection display */}
          <View style={styles.stickerCollection}>
            <Text style={styles.stickerCollectionTitle}>My Stickers</Text>
            <View style={styles.stickersGrid}>
              {Object.entries(progress).map(([subject, data]) => (
                data.sticker && (
                  <View key={subject} style={styles.stickerItem}>
                    <Text style={styles.stickerEmoji}>{data.sticker}</Text>
                    <Text style={styles.stickerLabel}>{subject}</Text>
                  </View>
                )
              ))}
              {Object.keys(progress).length === 0 && (
                <Text style={styles.noStickersText}>
                  Complete games to earn stickers!
                </Text>
              )}
            </View>
          </View>
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
    width: Math.min(width * 0.9, 600),
    height: height * 0.85,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
  },
  bookshelf: {
    flex: 1,
    backgroundColor: '#D2691E',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bookshelfContent: {
    padding: 20,
    alignItems: 'center',
  },
  booksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  bookContainer: {
    marginBottom: 10,
  },
  book: {
    width: 120,
    height: 180,
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
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    width: 150,
  },
  stickerBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  stickerText: {
    fontSize: 24,
  },
  progressSection: {
    width: '100%',
    backgroundColor: '#F5DEB3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressBars: {
    gap: 10,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subjectName: {
    width: 80,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  progressBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  statusText: {
    fontSize: 18,
    width: 25,
    textAlign: 'center',
  },
  stickerCollection: {
    width: '100%',
    backgroundColor: '#F5DEB3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  stickerCollectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
    textAlign: 'center',
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  stickerItem: {
    alignItems: 'center',
    width: 80,
  },
  stickerEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  stickerLabel: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  noStickersText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
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
