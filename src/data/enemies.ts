import { EnemyConfig, EnemyArchetype, AttackPatternType } from '../types/game';

export interface ArchetypeDetails {
  name: EnemyArchetype;
  badge: string;
  tagline: string;
  description: string;
  badgeColor: string;
  barColor: string;
  icon: 'zap' | 'shield' | 'flame' | 'target' | 'swords' | 'crown';
}

export const ARCHETYPE_INFO: Record<EnemyArchetype, ArchetypeDetails> = {
  Speedster: {
    name: 'Speedster',
    badge: 'SPEEDSTER',
    tagline: 'RAPID BLITZ · FAST INTERVALS',
    description: 'Strikes with lightning flurry tempo. Shorter telegraph window demands swift keystroke reactions.',
    badgeColor: 'border-cyan-400/60 bg-cyan-950/80 text-cyan-300',
    barColor: 'from-cyan-400 to-sky-500',
    icon: 'zap',
  },
  Heavy: {
    name: 'Heavy',
    badge: 'HEAVY BRUISER',
    tagline: 'CRUSHING BLOWS · MASSIVE DAMAGE',
    description: 'Winds up devastating strikes that deal heavy damage and cause arena tremors. Must be interrupted!',
    badgeColor: 'border-amber-400/60 bg-amber-950/80 text-amber-300',
    barColor: 'from-amber-500 to-orange-600',
    icon: 'flame',
  },
  Tank: {
    name: 'Tank',
    badge: 'ARMORED TANK',
    tagline: 'FORTIFIED SHIELD · MASSIVE HP',
    description: 'Enclosed in an armored energy shield that absorbs damage before HP is dented. Slower, heavy blows.',
    badgeColor: 'border-emerald-400/60 bg-emerald-950/80 text-emerald-300',
    barColor: 'from-emerald-400 to-teal-500',
    icon: 'shield',
  },
  Assassin: {
    name: 'Assassin',
    badge: 'SHADOW ASSASSIN',
    tagline: 'FEINT & AMBUSH · UNPREDICTABLE',
    description: 'Feints and hesitates midway through charging before suddenly bursting forward at triple speed.',
    badgeColor: 'border-purple-400/60 bg-purple-950/80 text-purple-300',
    barColor: 'from-purple-500 to-fuchsia-600',
    icon: 'target',
  },
  Brawler: {
    name: 'Brawler',
    badge: 'STREET BRAWLER',
    tagline: 'BALANCED TEMPO · DIRECT COMBAT',
    description: 'Disciplined fighter with steady attack rhythm and balanced offensive and defensive capabilities.',
    badgeColor: 'border-red-400/60 bg-red-950/80 text-red-300',
    barColor: 'from-red-500 to-rose-600',
    icon: 'swords',
  },
  Boss: {
    name: 'Boss',
    badge: 'APEX OVERLORD',
    tagline: 'MULTI-PHASE · EXTREME THREAT',
    description: 'Elite syndicate apex master with accelerating attack cadence and expert phrase complexity.',
    badgeColor: 'border-rose-400/80 bg-rose-950/90 text-rose-300',
    barColor: 'from-rose-500 to-purple-600',
    icon: 'crown',
  },
};

export const ALL_ENEMIES: EnemyConfig[] = [
  // ================================================================
  // 1. SPEEDSTERS (Fast intervals, blitz pattern, quick telegraph)
  // ================================================================
  {
    id: 'viper',
    name: 'VIPER',
    title: 'CYBERBLADE SPEEDSTER',
    archetype: 'Speedster',
    attackPattern: 'blitz',
    patternDescription: 'Rapid 3.2s blitz cycle. Short telegraph warning.',
    level: 2,
    maxHp: 85,
    attackIntervalMs: {
      easy: 4500,
      normal: 3400,
      hard: 2600,
    },
    attackDamage: 7,
    wordComplexity: 'medium',
    telegraphThreshold: 78,
    colorTheme: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#67e8f9',
      glow: 'rgba(6, 182, 212, 0.45)',
    },
    flavorQuote: "Blink once, and you'll find twin plasma blades at your throat.",
  },
  {
    id: 'volt',
    name: 'VOLT-X',
    title: 'PLASMA SPRINTER',
    archetype: 'Speedster',
    attackPattern: 'blitz',
    patternDescription: 'Ultra-fast 2.8s lightning intervals with stinging flurry strikes.',
    level: 3,
    maxHp: 80,
    attackIntervalMs: {
      easy: 4000,
      normal: 2900,
      hard: 2200,
    },
    attackDamage: 6,
    wordComplexity: 'medium',
    telegraphThreshold: 80,
    colorTheme: {
      primary: '#38bdf8',
      secondary: '#0284c7',
      accent: '#bae6fd',
      glow: 'rgba(56, 189, 248, 0.45)',
    },
    flavorQuote: "You type in seconds. I strike in microseconds!",
  },

  // ================================================================
  // 2. HEAVIES (Slow buildup, crushing damage 16-20, heavy tremor)
  // ================================================================
  {
    id: 'crusher',
    name: 'CRUSHER',
    title: 'HEAVY DEMOLISHER',
    archetype: 'Heavy',
    attackPattern: 'crushing',
    patternDescription: 'Long windup telegraph into a massive 18 DMG crushing blow.',
    level: 3,
    maxHp: 120,
    attackIntervalMs: {
      easy: 6800,
      normal: 5400,
      hard: 4200,
    },
    attackDamage: 18,
    wordComplexity: 'medium',
    telegraphThreshold: 55, // Early dramatic windup
    colorTheme: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fde68a',
      glow: 'rgba(245, 158, 11, 0.5)',
    },
    flavorQuote: "Feel the ground shake! One clean hit turns rookies into scrap.",
  },
  {
    id: 'berserker',
    name: 'RAZOR BERSERKER',
    title: 'ADRENALINE BRUISER',
    archetype: 'Heavy',
    attackPattern: 'accelerating',
    patternDescription: 'Accelerates speed dynamically as attack charge increases.',
    level: 4,
    maxHp: 115,
    attackIntervalMs: {
      easy: 6000,
      normal: 4800,
      hard: 3600,
    },
    attackDamage: 16,
    wordComplexity: 'hard',
    telegraphThreshold: 65,
    colorTheme: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#fed7aa',
      glow: 'rgba(234, 88, 12, 0.5)',
    },
    flavorQuote: "The closer I get to striking, the faster my fury grows!",
  },

  // ================================================================
  // 3. TANKS (Armored shield pool, high HP, damage absorption)
  // ================================================================
  {
    id: 'titan',
    name: 'TITAN-9',
    title: 'ARMORED JUGGERNAUT',
    archetype: 'Tank',
    attackPattern: 'fortified',
    patternDescription: 'Shielded with +30 Shield HP. Slower, unyielding strikes.',
    level: 3,
    maxHp: 135,
    shieldHp: 30,
    attackIntervalMs: {
      easy: 6200,
      normal: 5000,
      hard: 3900,
    },
    attackDamage: 12,
    wordComplexity: 'medium',
    telegraphThreshold: 68,
    colorTheme: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#a7f3d0',
      glow: 'rgba(16, 185, 129, 0.45)',
    },
    flavorQuote: "Hydraulic armor deployed. Break my shield first if you can!",
  },
  {
    id: 'goliath',
    name: 'GOLIATH-X',
    title: 'HYDRAULIC BASTION',
    archetype: 'Tank',
    attackPattern: 'fortified',
    patternDescription: 'Heavy cybernetic bunker with +40 Shield HP and immense durability.',
    level: 4,
    maxHp: 160,
    shieldHp: 40,
    attackIntervalMs: {
      easy: 6500,
      normal: 5200,
      hard: 4100,
    },
    attackDamage: 14,
    wordComplexity: 'hard',
    telegraphThreshold: 65,
    colorTheme: {
      primary: '#14b8a6',
      secondary: '#0f766e',
      accent: '#99f6e4',
      glow: 'rgba(20, 184, 166, 0.45)',
    },
    flavorQuote: "My armor plates are forged from tungsten alloy. Your punches tickle.",
  },

  // ================================================================
  // 4. ASSASSINS (Feint patterns, pause-and-burst tempo)
  // ================================================================
  {
    id: 'kage',
    name: 'KAGE',
    title: 'SHADOW ELITE',
    archetype: 'Assassin',
    attackPattern: 'feint',
    patternDescription: 'Pauses at 50% charge before a lightning ambush strike.',
    level: 4,
    maxHp: 105,
    attackIntervalMs: {
      easy: 5500,
      normal: 4200,
      hard: 3100,
    },
    attackDamage: 15,
    wordComplexity: 'hard',
    telegraphThreshold: 72,
    colorTheme: {
      primary: '#a855f7',
      secondary: '#7e22ce',
      accent: '#d8b4fe',
      glow: 'rgba(168, 85, 247, 0.45)',
    },
    flavorQuote: "Can your keystrokes anticipate a shadow that disappears mid-strike?",
  },
  {
    id: 'specter',
    name: 'PHANTOM SPECTER',
    title: 'VOID INFILTRATOR',
    archetype: 'Assassin',
    attackPattern: 'feint',
    patternDescription: 'Deceptive cadence with sudden acceleration spikes.',
    level: 4,
    maxHp: 100,
    attackIntervalMs: {
      easy: 5200,
      normal: 4000,
      hard: 2900,
    },
    attackDamage: 14,
    wordComplexity: 'hard',
    telegraphThreshold: 70,
    colorTheme: {
      primary: '#8b5cf6',
      secondary: '#6d28d9',
      accent: '#c4b5fd',
      glow: 'rgba(139, 92, 246, 0.45)',
    },
    flavorQuote: "Do not trust the rhythm of my blade until it has already landed.",
  },

  // ================================================================
  // 5. BRAWLERS (Steady, balanced cadence)
  // ================================================================
  {
    id: 'rook',
    name: 'ROOK',
    title: 'STREET BRAWLER',
    archetype: 'Brawler',
    attackPattern: 'steady',
    patternDescription: 'Disciplined steady cadence with reliable boxing rhythm.',
    level: 1,
    maxHp: 85,
    attackIntervalMs: {
      easy: 6500,
      normal: 4900,
      hard: 3800,
    },
    attackDamage: 8,
    wordComplexity: 'simple',
    telegraphThreshold: 70,
    colorTheme: {
      primary: '#ef4444',
      secondary: '#b91c1c',
      accent: '#fca5a5',
      glow: 'rgba(239, 68, 68, 0.45)',
    },
    flavorQuote: "You talk with your fingers, rookie? Let's see your hands work!",
  },
  {
    id: 'blaze',
    name: 'BLAZE',
    title: 'NEON KICKBOXER',
    archetype: 'Brawler',
    attackPattern: 'steady',
    patternDescription: 'Clean martial arts rhythm with steady punch-kick combinations.',
    level: 2,
    maxHp: 95,
    attackIntervalMs: {
      easy: 5800,
      normal: 4400,
      hard: 3400,
    },
    attackDamage: 9,
    wordComplexity: 'medium',
    telegraphThreshold: 70,
    colorTheme: {
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#fecdd3',
      glow: 'rgba(244, 63, 94, 0.45)',
    },
    flavorQuote: "Keep your guard high! In the street, second place is hospital food.",
  },

  // ================================================================
  // 6. BOSSES (Apex multi-phase challenges)
  // ================================================================
  {
    id: 'zero',
    name: 'OVERLORD ZERO',
    title: 'NEO-TOKYO APEX BOSS',
    archetype: 'Boss',
    attackPattern: 'accelerating',
    patternDescription: 'Multi-phase boss: accelerating timer and expert vocabulary.',
    level: 5,
    maxHp: 180,
    shieldHp: 25,
    attackIntervalMs: {
      easy: 4500,
      normal: 3200,
      hard: 2200,
    },
    attackDamage: 19,
    wordComplexity: 'expert',
    telegraphThreshold: 65,
    colorTheme: {
      primary: '#e11d48',
      secondary: '#9f1239',
      accent: '#ffe4e6',
      glow: 'rgba(225, 29, 72, 0.55)',
    },
    flavorQuote: "All systems bow to ZERO. Your keystroke frequency is terminated.",
  },
];

// Curated 5-Level Campaign Progression showcasing each archetype
export const CAMPAIGN_ENEMIES: EnemyConfig[] = [
  ALL_ENEMIES.find((e) => e.id === 'rook')!,     // Lvl 1: Brawler
  ALL_ENEMIES.find((e) => e.id === 'viper')!,    // Lvl 2: Speedster
  ALL_ENEMIES.find((e) => e.id === 'crusher')!,  // Lvl 3: Heavy
  ALL_ENEMIES.find((e) => e.id === 'kage')!,     // Lvl 4: Assassin
  ALL_ENEMIES.find((e) => e.id === 'zero')!,     // Lvl 5: Boss
];

export function getEnemyByLevel(level: number): EnemyConfig {
  const index = Math.max(0, Math.min(level - 1, CAMPAIGN_ENEMIES.length - 1));
  return { ...CAMPAIGN_ENEMIES[index] };
}

export interface RandomEnemyFilter {
  excludeId?: string;
  archetype?: EnemyArchetype;
  minLevel?: number;
  maxLevel?: number;
}

/**
 * Randomly selects from the pool of different enemy types (Speedster, Heavy, Tank, Assassin, Brawler)
 */
export function getRandomEnemy(filter?: RandomEnemyFilter): EnemyConfig {
  let pool = ALL_ENEMIES;

  if (filter?.excludeId) {
    pool = pool.filter((e) => e.id !== filter.excludeId);
  }

  if (filter?.archetype) {
    const matching = pool.filter((e) => e.archetype === filter.archetype);
    if (matching.length > 0) pool = matching;
  }

  if (filter?.minLevel !== undefined) {
    const matching = pool.filter((e) => e.level >= (filter.minLevel ?? 1));
    if (matching.length > 0) pool = matching;
  }

  if (filter?.maxLevel !== undefined) {
    const matching = pool.filter((e) => e.level <= (filter.maxLevel ?? 5));
    if (matching.length > 0) pool = matching;
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)] || ALL_ENEMIES[0];
  return { ...chosen };
}

/**
 * Generates an endless wave enemy with dynamic scaling and randomized archetype
 */
export function generateWaveEnemy(waveNumber: number): EnemyConfig {
  // Cycle through or pick randomly among Speedster, Heavy, Tank, Assassin, Brawler
  const nonBossEnemies = ALL_ENEMIES.filter((e) => e.archetype !== 'Boss');
  const base = nonBossEnemies[Math.floor(Math.random() * nonBossEnemies.length)];

  // Scale HP and attack damage progressively with wave
  const hpScaling = 1 + (waveNumber - 1) * 0.12;
  const dmgScaling = 1 + (waveNumber - 1) * 0.08;

  const scaledMaxHp = Math.round(base.maxHp * hpScaling);
  const scaledDamage = Math.round(base.attackDamage * dmgScaling);
  const scaledShield = base.shieldHp ? Math.round(base.shieldHp * hpScaling) : undefined;

  // Slightly speed up attack interval on higher waves (up to 25% faster)
  const speedBonus = Math.max(0.75, 1 - (waveNumber - 1) * 0.03);

  return {
    ...base,
    id: `${base.id}-wave-${waveNumber}-${Math.random().toString(36).substring(2, 6)}`,
    name: `${base.name}`,
    title: `WAVE ${waveNumber} · ${base.title}`,
    level: waveNumber,
    maxHp: scaledMaxHp,
    shieldHp: scaledShield,
    attackDamage: scaledDamage,
    attackIntervalMs: {
      easy: Math.round(base.attackIntervalMs.easy * speedBonus),
      normal: Math.round(base.attackIntervalMs.normal * speedBonus),
      hard: Math.round(base.attackIntervalMs.hard * speedBonus),
    },
  };
}
