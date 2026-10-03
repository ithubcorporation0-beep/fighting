export type GameMode = 'campaign' | 'quick' | 'time_attack' | 'endless';

export type GameStatus =
  | 'menu'
  | 'playing'
  | 'paused'
  | 'victory'
  | 'defeat'
  | 'level_transition';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type FighterAction =
  | 'idle'
  | 'type_ready'
  | 'light_attack'
  | 'heavy_attack'
  | 'special_attack'
  | 'combo_attack'
  | 'hit'
  | 'heavy_hit'
  | 'attack'
  | 'special'
  | 'block'
  | 'victory'
  | 'defeat'
  | 'punch'
  | 'kick'
  | 'hurt';

export type ScreenShakeType = 'none' | 'light' | 'heavy' | 'special';

export type AttackTier = 'normal' | 'fast' | 'critical' | 'special';

export interface CharacterPerk {
  name: string;
  desc: string;
  iconName: 'zap' | 'shield' | 'flame' | 'target' | 'timer' | 'heart';
}

export interface CharacterSpecialMove {
  name: string;
  desc: string;
  inputHint: string;
  effectType: 'beam' | 'blade' | 'ground_pound' | 'flame_rush' | 'chrono_burst';
}

export interface CharacterConfig {
  id: string;
  name: string;
  title: string;
  archetype: string;
  country: string;
  portrait: string;
  maxHp: number;
  stats: {
    power: number;     // 1-5 scale
    speed: number;     // 1-5 scale
    defense: number;   // 1-5 scale
    special: number;   // 1-5 scale
  };
  damageMultiplier: number;
  defenseDamageReduction: number;
  specialChargeRate: number;
  critChanceBonus: number;
  perk: CharacterPerk;
  specialMove: CharacterSpecialMove;
  bio: string;
  flavorQuote: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    border: string;
    bgGradient: string;
  };
}

export interface FighterStats {
  name: string;
  title: string;
  maxHp: number;
  currentHp: number;
  action: FighterAction;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

export type EnemyArchetype = 'Brawler' | 'Speedster' | 'Heavy' | 'Tank' | 'Assassin' | 'Boss';

export type AttackPatternType =
  | 'steady'        // Standard linear rate
  | 'blitz'         // Ultra-fast tempo, rapid light strikes
  | 'crushing'      // Steady buildup then long dramatic telegraph with devastating damage
  | 'accelerating'  // Starts slow, ramps up exponentially
  | 'feint'         // Hesitates midway, then bursts suddenly
  | 'fortified';    // Reinforced armor shield pool, heavy blows

export interface EnemyConfig {
  id: string;
  name: string;
  title: string;
  archetype: EnemyArchetype;
  attackPattern: AttackPatternType;
  patternDescription: string;
  level: number;
  maxHp: number;
  shieldHp?: number; // Optional initial shield pool (for Tank archetype)
  attackIntervalMs: {
    easy: number;
    normal: number;
    hard: number;
  };
  attackDamage: number;
  wordComplexity: 'simple' | 'medium' | 'hard' | 'expert';
  telegraphThreshold: number; // e.g. 70 (normal), 80 (speedster), 55 (heavy)
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  flavorQuote: string;
}

export interface FloatingDamage {
  id: string;
  text: string;
  isCrit: boolean;
  isHeal?: boolean;
  isEnemy: boolean; // true = enemy took damage (appears on right), false = player took damage (appears on left)
  xOffset: number;
  yOffset: number;
}

export interface HitEffect {
  id: string;
  type: 'punch' | 'kick' | 'special' | 'crit' | 'block';
  x: number;
  y: number;
  size: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume: number;
  soundVolume: number;
  musicVolume: number;
  difficulty: Difficulty;
  reducedMotion: boolean;
  virtualKeyboard: boolean;
}

export interface GameRunStats {
  score: number;
  wpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  wordsCompleted: number;
  highestCombo: number;
  currentCombo: number;
  timeElapsedSeconds: number;
  specialAttacksUsed: number;
  criticalHits: number;
}

export interface HighScoreEntry {
  id: string;
  date: string;
  mode: GameMode;
  levelReached: number;
  score: number;
  wpm: number;
  accuracy: number;
  highestCombo: number;
}
