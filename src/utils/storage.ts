import { GameSettings, HighScoreEntry } from '../types/game';

const SETTINGS_KEY = 'typing_fighter_settings';
const SCORES_KEY = 'typing_fighter_high_scores';
const CAMPAIGN_PROGRESS_KEY = 'typing_fighter_campaign_level';
const SELECTED_CHARACTER_KEY = 'typing_fighter_selected_character';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  masterVolume: 1.0,
  soundVolume: 0.7,
  musicVolume: 0.3,
  difficulty: 'normal',
  reducedMotion: false,
  virtualKeyboard: false,
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // LocalStorage fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Safe
  }
}

export function loadHighScores(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Safe
  }
  return [
    {
      id: 'default-1',
      date: '2026-09-25',
      mode: 'campaign',
      levelReached: 5,
      score: 18500,
      wpm: 68,
      accuracy: 96,
      highestCombo: 24,
    },
    {
      id: 'default-2',
      date: '2026-09-26',
      mode: 'quick',
      levelReached: 1,
      score: 6200,
      wpm: 54,
      accuracy: 92,
      highestCombo: 15,
    },
    {
      id: 'default-3',
      date: '2026-09-27',
      mode: 'time_attack',
      levelReached: 1,
      score: 9400,
      wpm: 62,
      accuracy: 94,
      highestCombo: 18,
    },
  ];
}

export function saveHighScore(entry: HighScoreEntry) {
  try {
    const existing = loadHighScores();
    const updated = [entry, ...existing]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
    localStorage.setItem(SCORES_KEY, JSON.stringify(updated));
  } catch {
    // Safe
  }
}

export function loadCampaignLevel(): number {
  try {
    const raw = localStorage.getItem(CAMPAIGN_PROGRESS_KEY);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 1) return parsed;
    }
  } catch {
    // Safe
  }
  return 1;
}

export function saveCampaignLevel(level: number) {
  try {
    const current = loadCampaignLevel();
    if (level > current) {
      localStorage.setItem(CAMPAIGN_PROGRESS_KEY, level.toString());
    }
  } catch {
    // Safe
  }
}

export function loadSelectedCharacterId(): string {
  try {
    const raw = localStorage.getItem(SELECTED_CHARACTER_KEY);
    if (raw && typeof raw === 'string' && raw.trim().length > 0) {
      return raw.trim();
    }
  } catch {
    // Safe
  }
  return 'kai';
}

export function saveSelectedCharacterId(charId: string) {
  try {
    localStorage.setItem(SELECTED_CHARACTER_KEY, charId);
  } catch {
    // Safe
  }
}

