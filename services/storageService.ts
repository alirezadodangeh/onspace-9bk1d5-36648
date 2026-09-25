// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Entry } from '@/services/extractionService';

const STORAGE_KEY = '@sayyad_entries';

export async function loadEntries(): Promise<Entry[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    return JSON.parse(json) as Entry[];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: Entry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // silent fail
  }
}
