import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type KidMode = 'junior' | 'bigKid';

interface SettingsState {
  kidMode: KidMode;
  childName?: string;
  soundEnabled: boolean;
}

interface SettingsContextType extends SettingsState {
  updateSettings: (updates: Partial<SettingsState>) => Promise<void>;
}

const STORAGE_KEY = '@school_quest_settings';
const defaultSettings: SettingsState = { kidMode: 'junior', soundEnabled: true };
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  useEffect(() => { (async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value) setSettings({ ...defaultSettings, ...JSON.parse(value) });
    } catch (error) { console.error('Failed loading settings', error); }
  })(); }, []);

  const updateSettings = async (updates: Partial<SettingsState>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (error) { console.error('Failed saving settings', error); }
  };

  return <SettingsContext.Provider value={{ ...settings, updateSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
