import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Subject =
  | 'reading'
  | 'math'
  | 'science'
  | 'social-studies'
  | 'feelings'
  | 'writing'
  | 'art'
  | 'music'
  | 'shapes'
  | 'health'
  | 'pe'
  | 'life-skills'
  | 'study-hall';

export interface SubjectProgress {
  completed: boolean;
  lastCompleted?: string;
}

export interface DayProgress {
  subjects: { [key: string]: SubjectProgress };
  dayCompleted: boolean;
  sticker?: string;
  completedDate?: string;
}

interface ProgressContextType {
  progress: DayProgress;
  completeSubject: (subject: Subject) => Promise<void>;
  getTodayProgress: () => Subject[];
  isAllComplete: () => boolean;
  completeDayWithSticker: (sticker: string) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = '@school_simulator_progress';

const ALL_SUBJECTS: Subject[] = [
  'reading',
  'math',
  'science',
  'social-studies',
  'feelings',
  'writing',
  'art',
  'music',
  'shapes',
  'health',
  'pe',
  'life-skills',
  'study-hall',
];

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<DayProgress>({
    subjects: {},
    dayCompleted: false,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (newProgress: DayProgress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const completeSubject = async (subject: Subject) => {
    const today = new Date().toISOString().split('T')[0];
    const newProgress = {
      ...progress,
      subjects: {
        ...progress.subjects,
        [subject]: {
          completed: true,
          lastCompleted: today,
        },
      },
    };
    await saveProgress(newProgress);
  };

  const getTodayProgress = (): Subject[] => {
    const today = new Date().toISOString().split('T')[0];
    const completed: Subject[] = [];

    Object.entries(progress.subjects).forEach(([subject, data]) => {
      if (data.lastCompleted === today && data.completed) {
        completed.push(subject as Subject);
      }
    });

    return completed;
  };

  const isAllComplete = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return ALL_SUBJECTS.every((subject) => {
      const subjectProgress = progress.subjects[subject];
      return subjectProgress?.completed && subjectProgress?.lastCompleted === today;
    });
  };

  const completeDayWithSticker = async (sticker: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newProgress = {
      ...progress,
      dayCompleted: true,
      sticker,
      completedDate: today,
    };
    await saveProgress(newProgress);
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setProgress({ subjects: {}, dayCompleted: false });
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeSubject,
        getTodayProgress,
        isAllComplete,
        completeDayWithSticker,
        resetProgress,
      }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};
