import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Subject = 'math' | 'reading' | 'science';

export interface SubjectProgress {
  completed: boolean;
  sticker?: string;
  lastCompleted?: string;
}

export interface Progress {
  [key: string]: SubjectProgress;
}

interface ProgressContextType {
  progress: Progress;
  completeSubject: (subject: Subject, sticker: string) => Promise<void>;
  getTodayProgress: () => Subject[];
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = '@school_simulator_progress';

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<Progress>({});

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

  const saveProgress = async (newProgress: Progress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const completeSubject = async (subject: Subject, sticker: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newProgress = {
      ...progress,
      [subject]: {
        completed: true,
        sticker,
        lastCompleted: today,
      },
    };
    await saveProgress(newProgress);
  };

  const getTodayProgress = (): Subject[] => {
    const today = new Date().toISOString().split('T')[0];
    const completed: Subject[] = [];

    Object.entries(progress).forEach(([subject, data]) => {
      if (data.lastCompleted === today && data.completed) {
        completed.push(subject as Subject);
      }
    });

    return completed;
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setProgress({});
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
