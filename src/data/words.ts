// Rich word and phrase bank categorized by difficulty and theme

export const PHRASES_EASY: string[] = [
  'OPEN YOUR MIND',
  'STRIKE FIRST',
  'FIGHT BACK',
  'NEVER STOP',
  'FAST HANDS',
  'STREET FIGHT',
  'POWER UP',
  'QUICK JAB',
  'HIGH KICK',
  'IRON FIST',
  'SHADOW RUN',
  'PURE SPEED',
  'TRUE VALOR',
  'STAY SHARP',
  'EYE OF TIGER',
  'READY FIGHT',
  'HEAVY HIT',
  'DOUBLE PUNCH',
  'SWIFT MOVE',
  'BREAK FREE',
];

export const PHRASES_MEDIUM: string[] = [
  'FEEL THE IMPACT',
  'UNLEASH THE COMBO',
  'LIGHTNING REFLEX',
  'BREAK THE DEFENSE',
  'DEFEND THE STREETS',
  'FOCUS YOUR ENERGY',
  'BATTLE TESTED',
  'TACTICAL ADVANTAGE',
  'COUNTER THE BLOW',
  'MOMENT OF TRUTH',
  'RISING UPPERCUT',
  'NEVER BACK DOWN',
  'KINETIC MOMENTUM',
  'STRIKE WITH HONOR',
  'OVERCOME THE ODDS',
  'RAPID FIRE PUNCH',
  'DRAGON TAIL KICK',
  'SPEED OF SOUND',
  'SHADOW DANCER',
  'MASTER THE FLOW',
];

export const PHRASES_HARD: string[] = [
  'MAXIMUM OVERDRIVE MODE',
  'SYNCHRONIZED ATTACK FORCE',
  'UNSTOPPABLE ARCADE WARRIOR',
  'PERFECT REFLEXES IN MOTION',
  'CHAMPION OF THE CONCRETE',
  'CRITICAL STRIKE COMBINATION',
  'BLITZKRIEG LIGHTNING ASSAULT',
  'SURPASS YOUR LIMITATIONS',
  'LEGENDARY KNOCKOUT BLOW',
  'ABSOLUTE PRECISION STRIKE',
  'THUNDERSTORM OF PUNCHES',
  'SUPERCHARGED COUNTER ATTACK',
  'DOMINATE THE BATTLEFIELD',
  'FATAL COMBO EXECUTION',
  'DEFENDER OF NEO TOKYO',
];

export const WORDS_EASY: string[] = [
  'START',
  'FIGHT',
  'POWER',
  'SPEED',
  'PUNCH',
  'KICK',
  'DODGE',
  'BLOCK',
  'DASH',
  'SLASH',
  'STRIKE',
  'FORCE',
  'BLAST',
  'CLASH',
  'GUARD',
  'FOCUS',
  'BURST',
  'SURGE',
  'FLAME',
  'SPARK',
  'SWIFT',
  'BRAVE',
  'SMASH',
  'RUSH',
  'SHINE',
  'FEINT',
  'IMPACT',
  'ENERGY',
  'DRIVE',
  'PULSE',
  'RAGE',
  'EDGE',
  'SHIELD',
  'VALOR',
  'FURY',
  'QUICK',
  'TEMPO',
  'STEEL',
  'VIGOR',
  'GLORY',
];

export const WORDS_MEDIUM: string[] = [
  'WARRIOR',
  'DEFEND',
  'ATTACK',
  'COMBO',
  'VICTORY',
  'THUNDER',
  'SHADOW',
  'LEGEND',
  'COUNTER',
  'FINISHER',
  'CYBERPUNK',
  'OVERDRIVE',
  'PRECISION',
  'REFLEXES',
  'VELOCITY',
  'MOMENTUM',
  'CATALYST',
  'CROSSOVER',
  'TAKEDOWN',
  'VOLTAGE',
  'LIGHTNING',
  'KNOCKOUT',
  'VORTEX',
  'TACTICAL',
  'RESOLUTE',
  'SHATTER',
  'DOMINATE',
  'CRITICAL',
  'DECISIVE',
  'UNSTOPPABLE',
  'FEROCIOUS',
  'CIRCUITS',
  'TITANIUM',
  'VENDETTA',
  'RETALIATE',
  'FIREWALL',
  'SPECTRUM',
  'DISRUPTION',
  'ACCELERATE',
  'CHALLENGER',
];

export const WORDS_HARD: string[] = [
  'CHAMPION',
  'DEVASTATION',
  'METEORIC',
  'THUNDERSTRIKE',
  'HYPERDRIVE',
  'CYBERNETICS',
  'NANOMACHINE',
  'ELECTRIFYING',
  'JUGGERNAUT',
  'ANNIHILATION',
  'SUPERCHARGED',
  'COUNTERATTACK',
  'EXTRAORDINARY',
  'SUBSONIC',
  'MILLISECOND',
  'OVERWHELMING',
  'INVINCIBILITY',
  'ELECTROSTATIC',
  'TRANSCENDENCE',
  'KINETIC FORCE',
  'NEON ASSAULT',
  'SONIC BREAKER',
  'SHADOW STRIKE',
  'PLASMA CANNON',
  'TURBO CHARGE',
  'ULTIMATE RUSH',
  'QUANTUM LEAP',
  'APEX PREDATOR',
  'CHAIN REACTION',
  'FINAL SHOWDOWN',
  'FATAL EXECUTION',
  'PERFECT TIMING',
  'SUPREME POWER',
  'CYBER CRUSHER',
  'TITAN SMASH',
  'BLITZKRIEG RUSH',
  'DRAGON UPPERCUT',
  'PHOENIX RISING',
  'LIMIT BREAK',
  'OVERCLOCK MODE',
];

export const WORDS_EXPERT: string[] = [
  'SYNCHRONIZED ATTACK',
  'OVERCLOCKED MATRIX',
  'SUPERSONIC VELOCITY',
  'CYBERNETIC RESONANCE',
  'ELECTROMAGNETIC BURST',
  'UNSTOPPABLE MOMENTUM',
  'NEON HYPER ACCELERATION',
  'MILLISECOND REFLEXES',
  'TACTICAL DISRUPTION',
  'DEVASTATING COMBO',
  'ABSOLUTE ZERO CANNON',
  'LIGHTNING COUNTER BLOW',
  'MAXIMUM OVERDRIVE MODE',
  'QUANTUM DECRYPTION STRIKE',
  'TITANIUM HEAVY IMPACT',
  'INFERNAL BLADE TEMPEST',
  'APEX OVERLORD DOMINION',
  'SUB-ATOMIC PULSE WAVE',
  'CHRONO WARPING STRIKE',
  'OMEGA PROTOCOL UNLEASHED',
];

export function getWordForDifficulty(
  complexity: 'simple' | 'medium' | 'hard' | 'expert',
  excludeWord?: string,
): string {
  // Alternate between punchy words and full fighting phrases (like 'OPEN YOUR MIND')
  let pool: string[];
  const usePhrase = Math.random() > 0.35;

  if (usePhrase) {
    switch (complexity) {
      case 'simple':
        pool = PHRASES_EASY;
        break;
      case 'medium':
        pool = PHRASES_MEDIUM;
        break;
      case 'hard':
      case 'expert':
        pool = PHRASES_HARD;
        break;
      default:
        pool = PHRASES_EASY;
    }
  } else {
    switch (complexity) {
      case 'simple':
        pool = WORDS_EASY;
        break;
      case 'medium':
        pool = WORDS_MEDIUM;
        break;
      case 'hard':
        pool = WORDS_HARD;
        break;
      case 'expert':
        pool = WORDS_EXPERT;
        break;
      default:
        pool = WORDS_MEDIUM;
    }
  }

  const filtered = pool.filter((w) => w !== excludeWord);
  const choicePool = filtered.length > 0 ? filtered : pool;
  const randomIndex = Math.floor(Math.random() * choicePool.length);
  return choicePool[randomIndex];
}
