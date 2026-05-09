import * as Speech from 'expo-speech';
import { KidMode } from '@/contexts/settings-context';

export async function speak(text: string, options?: { soundEnabled?: boolean; kidMode?: KidMode }) {
  if (!options?.soundEnabled) return;
  try {
    Speech.stop();
    Speech.speak(text, { rate: options?.kidMode === 'junior' ? 0.75 : 1.0 });
  } catch (error) {
    console.error('Speech error', error);
  }
}

export async function stopSpeaking() {
  try { Speech.stop(); } catch (error) { console.error('Stop speech error', error); }
}
