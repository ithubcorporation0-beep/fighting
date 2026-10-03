import { AttackTier } from '../types/game';

export function calculateWpm(correctCharacters: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 1 || correctCharacters <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctCharacters / 5;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const acc = (correctKeystrokes / totalKeystrokes) * 100;
  return Math.max(0, Math.min(100, Math.round(acc)));
}

export interface WordScoreResult {
  tier: AttackTier;
  damage: number;
  scoreGained: number;
  isCrit: boolean;
  message: 'PERFECT!' | 'GREAT!' | 'GOOD!' | 'COMBO!' | '';
}

export function evaluateWordCompletion(
  word: string,
  durationMs: number,
  hadErrors: boolean,
  combo: number,
  baseDamageOverride?: number,
): WordScoreResult {
  const length = word.length;
  // Speed rating (chars per second)
  const durationSec = durationMs / 1000;
  const charsPerSec = length / Math.max(0.1, durationSec);

  let tier: AttackTier = 'normal';
  let baseDamage = baseDamageOverride || 6;
  let speedBonus = 20;
  let message: WordScoreResult['message'] = 'GOOD!';
  let isCrit = false;

  if (charsPerSec >= 5.5) {
    tier = 'fast';
    baseDamage = 14;
    speedBonus = 120;
    message = 'GREAT!';
  } else if (charsPerSec >= 3.5) {
    tier = 'normal';
    baseDamage = 9;
    speedBonus = 60;
    message = 'GOOD!';
  } else {
    tier = 'normal';
    baseDamage = 6;
    speedBonus = 20;
    message = '';
  }

  // Critical hit check: no errors and fast completion
  if (!hadErrors && charsPerSec >= 4.0) {
    tier = 'critical';
    isCrit = true;
    baseDamage = Math.round(baseDamage * 1.5);
    speedBonus += 100;
    message = 'PERFECT!';
  } else if (combo >= 5) {
    message = 'COMBO!';
  }

  // Combo multiplier for damage
  const comboMultiplier = 1 + Math.min(1.5, combo * 0.08);
  const finalDamage = Math.max(1, Math.round(baseDamage * comboMultiplier));

  // Score computation
  const basePoints = length * 15;
  const accuracyBonus = !hadErrors ? 80 : 0;
  const comboBonus = combo * 25;
  const scoreGained = basePoints + speedBonus + accuracyBonus + comboBonus;

  return {
    tier,
    damage: finalDamage,
    scoreGained,
    isCrit,
    message,
  };
}
