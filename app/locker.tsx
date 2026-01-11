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
        {/* Locker Door Frame */}
        <View style={styles.lockerDoorFrame}>
          <View style={styles.lockerVentSlot} />
          <View style={styles.lockerVentSlot} />
          <View style={styles.lockerVentSlot} />
        </View>

        {/* Locker Interior */}
        <View style={styles.lockerInterior}>
          {/* Top Shelf - Progress Display */}
          <View style={styles.topShelf}>
            <Text style={styles.shelfLabel}>MY KINDERGARTEN DAY</Text>
            <Text style={styles.progressText}>
              {completedCount} of 13 Complete
            </Text>
            {allComplete && (
              <Text style={styles.allDoneText}>🎉 All Done! 🎉</Text>
            )}
          </View>

          {/* Books Stacked Vertically */}
          <ScrollView
            style={styles.bookStack}
            contentContainerStyle={styles.bookStackContent}
            showsVerticalScrollIndicator={false}>

            {BOOKS.map((book) => {
              const isCompleted = todayCompleted.includes(book.subject);

              return (
                <TouchableOpacity
                  key={book.subject}
                  activeOpacity={0.8}
                  onPress={() => handleBookPress(book)}
                  style={styles.bookSpineContainer}>

                  {/* Book Spine (vertical book) */}
                  <View style={[styles.bookSpine, { backgroundColor: book.color }]}>
                    <Text style={styles.bookSpineIcon}>{book.icon}</Text>
                    <Text style={styles.bookSpineTitle}>{book.title}</Text>

                    {/* Checkmark if completed */}
                    {isCompleted && (
                      <View style={styles.spineCheckmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Book top edge (3D effect) */}
                  <View style={[styles.bookTop, { backgroundColor: book.color, opacity: 0.8 }]} />
                </TouchableOpacity>
              );
            })}

            {/* Day Complete Sticker - on locker shelf */}
            {progress.dayCompleted && progress.sticker && (
              <View style={styles.stickerShelf}>
                <Text style={styles.stickerLabel}>Today's Sticker:</Text>
                <Text style={styles.daySticker}>{progress.sticker}</Text>
              </View>
            )}
          </ScrollView>

          {/* Locker Hook */}
          <View style={styles.lockerHook}>
            <View style={styles.hookBase} />
            <View style={styles.hookCurve} />
          </View>
        </View>

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
    backgroundColor: '#E8E8E8',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockerFrame: {
    width: Math.min(width * 0.95, 500),
    height: height * 0.92,
    backgroundColor: '#4A5568',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#2D3748',
  },
  lockerDoorFrame: {
    backgroundColor: '#718096',
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  lockerVentSlot: {
    width: 50,
    height: 4,
    backgroundColor: '#2D3748',
    borderRadius: 2,
  },
  lockerInterior: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'relative',
  },
  topShelf: {
    backgroundColor: '#CBD5E0',
    padding: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#A0AEC0',
    alignItems: 'center',
  },
  shelfLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 3,
  },
  allDoneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38A169',
    marginTop: 5,
  },
  bookStack: {
    flex: 1,
  },
  bookStackContent: {
    padding: 15,
    paddingBottom: 80,
  },
  bookSpineContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  bookSpine: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(0, 0, 0, 0.2)',
    borderRightWidth: 3,
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bookTop: {
    position: 'absolute',
    top: -3,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bookSpineIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  bookSpineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  spineCheckmark: {
    backgroundColor: '#38A169',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  stickerShelf: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 8,
  },
  daySticker: {
    fontSize: 50,
  },
  lockerHook: {
    position: 'absolute',
    top: 60,
    right: 15,
  },
  hookBase: {
    width: 8,
    height: 20,
    backgroundColor: '#718096',
    borderRadius: 4,
  },
  hookCurve: {
    width: 20,
    height: 15,
    backgroundColor: '#718096',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -2,
    marginLeft: -6,
  },
  backButton: {
    backgroundColor: '#4299E1',
    padding: 14,
    borderRadius: 10,
    margin: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2B6CB0',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
