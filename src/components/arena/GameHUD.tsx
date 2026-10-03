import React, { useState, useEffect, useRef } from 'react';
import { EnemyConfig, GameMode } from '../../types/game';
import { ARCHETYPE_INFO } from '../../data/enemies';
import {
  Settings,
  Pause,
  Zap,
  AlertTriangle,
  Shield,
  Flame,
  Target,
  Swords,
  Crown,
  Dices,
} from 'lucide-react';

export interface BattleHUDProps {
  playerHp: number;
  playerMaxHp: number;
  playerName?: string;
  playerTitle?: string;
  playerColor?: string;
  enemy: EnemyConfig;
  enemyHp: number;
  enemyMaxHp: number;
  enemyShieldHp?: number;
  enemyMaxShieldHp?: number;
  level: number;
  combo: number;
  enemyAttackProgress?: number;
  isEnemyTelegraphing?: boolean;
  isPlayerInvulnerable?: boolean;
  gameMode?: GameMode;
  onRerollEnemy?: () => void;
  onPause: () => void;
  onOpenSettings: () => void;
}

export const BattleHUD: React.FC<BattleHUDProps> = ({
  playerHp,
  playerMaxHp,
  playerName = 'KAI',
  playerTitle = 'HERO STRIKER',
  playerColor = '#06b6d4',
  enemy,
  enemyHp,
  enemyMaxHp,
  enemyShieldHp = 0,
  enemyMaxShieldHp = 0,
  level,
  combo,
  enemyAttackProgress = 0,
  isEnemyTelegraphing = false,
  isPlayerInvulnerable = false,
  gameMode,
  onRerollEnemy,
  onPause,
  onOpenSettings,
}) => {
  const playerHpPct = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100));
  const enemyHpPct = Math.max(0, Math.min(100, (enemyHp / enemyMaxHp) * 100));

  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [enemyDamaged, setEnemyDamaged] = useState(false);
  const [playerFlashKey, setPlayerFlashKey] = useState(0);
  const [enemyFlashKey, setEnemyFlashKey] = useState(0);

  const prevPlayerHpRef = useRef(playerHp);
  const prevEnemyHpRef = useRef(enemyHp);

  const isPlayerLowHp = playerHpPct > 0 && playerHpPct < 25;
  const isEnemyLowHp = enemyHpPct > 0 && enemyHpPct < 25;

  useEffect(() => {
    if (playerHp < prevPlayerHpRef.current) {
      setPlayerDamaged(true);
      setPlayerFlashKey((k) => k + 1);
      const timer = setTimeout(() => setPlayerDamaged(false), 450);
      prevPlayerHpRef.current = playerHp;
      return () => clearTimeout(timer);
    }
    prevPlayerHpRef.current = playerHp;
  }, [playerHp]);

  useEffect(() => {
    if (enemyHp < prevEnemyHpRef.current) {
      setEnemyDamaged(true);
      setEnemyFlashKey((k) => k + 1);
      const timer = setTimeout(() => setEnemyDamaged(false), 450);
      prevEnemyHpRef.current = enemyHp;
      return () => clearTimeout(timer);
    }
    prevEnemyHpRef.current = enemyHp;
  }, [enemyHp]);

  const archetypeInfo = ARCHETYPE_INFO[enemy.archetype];
  const ArchetypeIcon =
    enemy.archetype === 'Speedster'
      ? Zap
      : enemy.archetype === 'Heavy'
      ? Flame
      : enemy.archetype === 'Tank'
      ? Shield
      : enemy.archetype === 'Assassin'
      ? Target
      : enemy.archetype === 'Boss'
      ? Crown
      : Swords;

  return (
    <div className="relative w-full select-none pointer-events-auto">
      {/* CSS Keyframes for Health Bar Low Health Pulsing & Damage Flash */}
      <style>{`
        @keyframes hp-pulse-danger {
          0%, 100% {
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.4), inset 0 0 6px rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.7);
            filter: brightness(1);
          }
          50% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.95), inset 0 0 12px rgba(239, 68, 68, 0.65);
            border-color: rgba(254, 202, 202, 1);
            filter: brightness(1.3);
          }
        }

        @keyframes hp-damage-flash {
          0% {
            box-shadow: 0 0 30px rgba(255, 0, 60, 1), inset 0 0 16px rgba(255, 255, 255, 0.95);
            border-color: #ffffff;
            filter: brightness(1.75);
            transform: scale(1.035);
          }
          35% {
            box-shadow: 0 0 18px rgba(239, 68, 68, 0.85), inset 0 0 10px rgba(239, 68, 68, 0.7);
            border-color: #ef4444;
            filter: brightness(1.3);
          }
          100% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
            border-color: rgba(71, 85, 105, 0.8);
            filter: brightness(1);
            transform: scale(1);
          }
        }

        @keyframes hud-damage-overlay-flash {
          0% {
            opacity: 1;
            background: linear-gradient(90deg, rgba(255, 20, 60, 0.95), rgba(220, 38, 38, 0.8));
          }
          40% {
            opacity: 0.75;
            background: rgba(239, 68, 68, 0.6);
          }
          100% {
            opacity: 0;
            background: transparent;
          }
        }

        @keyframes hud-fill-pulse-low {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.6));
            opacity: 0.85;
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(239, 68, 68, 1));
            opacity: 1;
          }
        }

        .animate-hp-pulse {
          animation: hp-pulse-danger 0.9s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
        }

        .animate-hp-damage-flash {
          animation: hp-damage-flash 0.45s ease-out !important;
        }

        .hud-hp-overlay-flash {
          animation: hud-damage-overlay-flash 0.45s ease-out forwards;
        }

        .hud-hp-fill-low {
          animation: hud-fill-pulse-low 0.9s ease-in-out infinite alternate;
        }
      `}</style>

      {/* TOP BATTLE HUD ROW */}
      <header className="w-full px-2 sm:px-4 pt-1 sm:pt-2">
        <div className="max-w-7xl mx-auto grid grid-cols-12 items-start gap-2 md:gap-4">
          {/* ============================================================ */}
          {/* TOP LEFT: PLAYER / HP / COMBO 8x                            */}
          {/* ============================================================ */}
          <div className="col-span-5 flex flex-col items-start min-w-0">
            {/* Header: Label + Name */}
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 tracking-wider">
                  PLAYER
                </span>
                <span
                  className="text-xs sm:text-sm md:text-base font-black tracking-widest uppercase truncate"
                  style={{ fontFamily: "'Chakra Petch', sans-serif", color: playerColor }}
                >
                  {playerName}
                </span>
                {playerTitle && (
                  <span className="text-[8px] font-mono text-slate-400 uppercase hidden xl:inline">
                    · {playerTitle}
                  </span>
                )}
                {isPlayerInvulnerable && (
                  <span className="flex items-center gap-0.5 text-[8px] sm:text-[9px] font-black text-cyan-300 bg-cyan-950/90 px-1.5 py-0.2 rounded border border-cyan-400 animate-pulse tracking-wide">
                    SHIELD
                  </span>
                )}
                {isPlayerLowHp && !isPlayerInvulnerable && (
                  <span className="flex items-center gap-0.5 text-[8px] sm:text-[9px] font-black text-red-400 bg-red-950/80 px-1 py-0.2 rounded border border-red-500/70 animate-pulse tracking-wide">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400 shrink-0" />
                    DANGER
                  </span>
                )}
              </div>
              <span
                className={`font-mono text-[10px] sm:text-xs font-bold shrink-0 transition-colors ${
                  playerDamaged
                    ? 'text-red-400 scale-110'
                    : isPlayerLowHp
                    ? 'text-red-400 animate-pulse font-black'
                    : 'text-slate-300'
                }`}
              >
                {Math.round(playerHp)} / {playerMaxHp} <span className="text-slate-500 text-[9px]">HP</span>
              </span>
            </div>

            {/* Health Bar with dynamic keyframe animations */}
            <div
              key={`player-hp-bar-${playerFlashKey}`}
              className={`relative w-full h-3.5 sm:h-4.5 md:h-5 bg-slate-950/90 border rounded-sm overflow-hidden p-0.5 transition-all duration-150 ${
                playerDamaged
                  ? 'animate-hp-damage-flash border-white shadow-[0_0_20px_rgba(239,68,68,1)]'
                  : isPlayerLowHp
                  ? 'animate-hp-pulse border-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'border-slate-700/80 shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
              }`}
              style={{
                clipPath: 'polygon(0% 0%, 97% 0%, 100% 100%, 0% 100%)',
              }}
            >
              {/* Damage ghost */}
              <div className="absolute inset-0 bg-rose-950/50 pointer-events-none" />

              {/* Red flash overlay triggered upon taking damage */}
              {playerDamaged && (
                <div className="absolute inset-0 z-10 hud-hp-overlay-flash pointer-events-none" />
              )}

              {/* Health fill */}
              <div
                className={`h-full rounded-[1px] transition-all duration-200 ease-out shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] ${
                  playerDamaged
                    ? 'bg-gradient-to-r from-red-600 via-rose-500 to-white'
                    : isPlayerLowHp
                    ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-400 hud-hp-fill-low'
                    : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300'
                }`}
                style={{ width: `${playerHpPct}%` }}
              />

              {/* Upper gloss line */}
              <div className="absolute top-0 left-0 right-0 h-[30%] bg-white/20 pointer-events-none" />
            </div>

            {/* COMBO Counter directly under player HP */}
            <div className="flex items-center gap-2 mt-0.5">
              <div
                className={`flex items-center gap-1 font-mono font-black tracking-wider transition-all duration-150 ${
                  combo > 0
                    ? 'text-yellow-300 scale-105 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]'
                    : 'text-slate-600 opacity-60'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] text-slate-400">COMBO</span>
                <span className="text-[11px] sm:text-xs md:text-sm px-1.5 py-0.2 rounded bg-slate-900 border border-yellow-400/50 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.4)]">
                  {combo}x
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TOP CENTER: ROUND 1 / VS EMBLEM                              */}
          {/* ============================================================ */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            {/* ROUND BADGE */}
            <div
              className="px-2 py-0.5 rounded bg-slate-900/95 border border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.4)] text-[9px] sm:text-[11px] font-black tracking-widest text-fuchsia-300 uppercase"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              ROUND {level}
            </div>

            {/* VS EMBLEM */}
            <span
              className="text-sm sm:text-lg font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-300 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] my-0.5"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              VS
            </span>

            {/* PAUSE BUTTON */}
            <button
              onClick={onPause}
              className="text-[8px] sm:text-[9px] font-mono text-slate-400 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer"
              title="Pause (ESC)"
            >
              <Pause className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">PAUSE</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* TOP RIGHT: ENEMY / HP                                        */}
          {/* ============================================================ */}
          <div className="col-span-5 flex flex-col items-end min-w-0">
            {/* Header: Label + Name + Archetype Badge */}
            <div className="flex items-center justify-between w-full mb-1 flex-row-reverse">
              <div className="flex items-center gap-1.5 truncate flex-row-reverse">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 tracking-wider">
                  ENEMY
                </span>
                <span
                  className="text-xs sm:text-sm md:text-base font-black tracking-widest uppercase truncate"
                  style={{
                    color: enemy.colorTheme.primary,
                    fontFamily: "'Chakra Petch', sans-serif",
                  }}
                >
                  {enemy.name}
                </span>

                {/* Enemy Archetype Badge */}
                <span
                  className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                    archetypeInfo?.badgeColor || 'border-slate-700 bg-slate-900 text-slate-300'
                  }`}
                  title={`${enemy.archetype}: ${enemy.patternDescription}`}
                >
                  {ArchetypeIcon && <ArchetypeIcon className="w-2.5 h-2.5 shrink-0" />}
                  <span>{enemy.archetype.toUpperCase()}</span>
                </span>

                {isEnemyLowHp && (
                  <span className="flex items-center gap-0.5 text-[9px] font-black text-red-400 bg-red-950/80 px-1 py-0.2 rounded border border-red-500/70 animate-pulse tracking-wide">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400 shrink-0" />
                    DANGER
                  </span>
                )}
              </div>
              <span
                className={`font-mono text-[10px] sm:text-xs font-bold shrink-0 transition-colors ${
                  enemyDamaged
                    ? 'text-red-400 scale-110'
                    : isEnemyLowHp
                    ? 'text-red-400 animate-pulse font-black'
                    : 'text-slate-300'
                }`}
              >
                {Math.round(enemyHp)} / {enemyMaxHp} <span className="text-slate-500 text-[9px]">HP</span>
              </span>
            </div>

            {/* Health Bar with dynamic keyframe animations */}
            <div
              key={`enemy-hp-bar-${enemyFlashKey}`}
              className={`relative w-full h-3.5 sm:h-4.5 md:h-5 bg-slate-950/90 border rounded-sm overflow-hidden p-0.5 transition-all duration-150 ${
                enemyDamaged
                  ? 'animate-hp-damage-flash border-white shadow-[0_0_20px_rgba(239,68,68,1)]'
                  : isEnemyLowHp
                  ? 'animate-hp-pulse border-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'border-slate-700/80 shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
              }`}
              style={{
                clipPath: 'polygon(3% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
            >
              {/* Damage ghost */}
              <div className="absolute inset-0 bg-rose-950/50 pointer-events-none" />

              {/* Red flash overlay triggered upon taking damage */}
              {enemyDamaged && (
                <div className="absolute inset-0 z-10 hud-hp-overlay-flash pointer-events-none" />
              )}

              {/* Health fill */}
              <div
                className={`h-full rounded-[1px] transition-all duration-200 ease-out shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] ml-auto ${
                  enemyDamaged
                    ? 'bg-gradient-to-l from-white via-red-500 to-rose-600'
                    : isEnemyLowHp
                    ? 'bg-gradient-to-l from-red-600 via-rose-500 to-red-400 hud-hp-fill-low'
                    : 'bg-gradient-to-l from-rose-500 to-orange-400'
                }`}
                style={{ width: `${enemyHpPct}%` }}
              />

              {/* Upper gloss line */}
              <div className="absolute top-0 left-0 right-0 h-[30%] bg-white/20 pointer-events-none" />
            </div>

            {/* Armored Tank Shield Pool Bar (if enemy has shield) */}
            {enemyMaxShieldHp > 0 && (
              <div className="w-full flex flex-col items-end mt-1">
                <div className="flex items-center justify-between w-full text-[8px] sm:text-[9px] font-mono mb-0.5">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider">
                    <Shield className="w-2.5 h-2.5" />
                    ENERGY SHIELD
                  </span>
                  <span className="text-emerald-300 font-bold font-mono">
                    {Math.max(0, Math.round(enemyShieldHp))} / {enemyMaxShieldHp} SHIELD
                  </span>
                </div>
                <div className="relative w-full h-1.5 sm:h-2 bg-slate-950/90 border border-emerald-500/40 rounded-xs overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-100 ml-auto shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{
                      width: `${Math.max(0, Math.min(100, (enemyShieldHp / enemyMaxShieldHp) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* ENEMY ATTACK CHARGE GAUGE */}
            <div className="w-full flex flex-col items-end mt-1">
              <div className="flex items-center justify-between w-full text-[8px] sm:text-[9px] font-mono mb-0.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  {isEnemyTelegraphing ? '🚨 INCOMING STRIKE' : 'ATTACK CHARGE'}
                </span>
                <span
                  className={`font-black tracking-wider ${
                    isEnemyTelegraphing
                      ? 'text-rose-400 animate-pulse font-mono'
                      : 'text-amber-300'
                  }`}
                >
                  {isEnemyTelegraphing ? 'TYPE TO INTERRUPT!' : `${Math.round(enemyAttackProgress)}%`}
                </span>
              </div>
              <div
                className={`relative w-full h-1.5 sm:h-2 bg-slate-950/90 border rounded-xs overflow-hidden ${
                  isEnemyTelegraphing
                    ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)] animate-pulse'
                    : 'border-slate-800'
                }`}
              >
                <div
                  className={`h-full transition-all duration-75 ml-auto ${
                    isEnemyTelegraphing
                      ? 'bg-gradient-to-l from-rose-500 via-red-500 to-amber-400'
                      : 'bg-gradient-to-l from-amber-400 via-yellow-400 to-orange-500'
                  }`}
                  style={{ width: `${Math.min(100, enemyAttackProgress)}%` }}
                />
              </div>
            </div>

            {/* Telegraph Warning / Enemy Pattern Tag / Reroll Option */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 max-w-full">
              {isEnemyTelegraphing ? (
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-rose-400 bg-rose-950/80 px-2 py-0.2 rounded border border-rose-500 animate-bounce tracking-wide shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  WINDING UP!
                </span>
              ) : (
                <span
                  className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate max-w-[140px] sm:max-w-[200px]"
                  title={enemy.patternDescription}
                >
                  {enemy.attackPattern.toUpperCase()}: {enemy.patternDescription}
                </span>
              )}

              {/* Quick Brawl Reroll Challenger Button */}
              {onRerollEnemy && (
                <button
                  onClick={onRerollEnemy}
                  className="px-1.5 py-0.5 rounded bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-[9px] font-mono font-bold tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_6px_rgba(6,182,212,0.2)] active:scale-95 shrink-0"
                  title="Roll another random enemy archetype"
                >
                  <Dices className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="hidden sm:inline">REROLL</span>
                </button>
              )}

              {/* Quick Settings Gear */}
              <button
                onClick={onOpenSettings}
                className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Settings (ESC)"
                aria-label="Settings"
              >
                <Settings className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Warning Banner when enemy is telegraphing a strike */}
        {isEnemyTelegraphing && (
          <div className="max-w-xl mx-auto mt-1 px-3 py-1 bg-rose-600/90 border border-rose-400 rounded-md text-white font-mono font-black text-[10px] sm:text-xs text-center tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse uppercase flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>ENEMY WINDING UP PUNCH! COMPLETE PHRASE TO STAGGER!</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
        )}
      </header>
    </div>
  );
};

export interface CombatDashboardProps {
  wpm: number;
  accuracy: number;
  score: number;
  specialMeter: number;
  onTriggerSpecial?: () => void;
}

export const CombatDashboard: React.FC<CombatDashboardProps> = ({
  wpm,
  accuracy,
  score,
  specialMeter,
  onTriggerSpecial,
}) => {
  const isSpecialReady = specialMeter >= 100;

  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.6)] pointer-events-auto select-none">
      {/* WPM */}
      <div className="flex flex-col items-center">
        <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
          WPM
        </span>
        <span
          className="text-sm sm:text-lg font-black text-cyan-400 leading-tight"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          {wpm}
        </span>
      </div>

      <div className="h-5 w-[1px] bg-slate-800" />

      {/* ACCURACY */}
      <div className="flex flex-col items-center">
        <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
          ACCURACY
        </span>
        <span
          className="text-sm sm:text-lg font-black text-emerald-400 leading-tight"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          {accuracy}%
        </span>
      </div>

      <div className="h-5 w-[1px] bg-slate-800" />

      {/* SCORE */}
      <div className="flex flex-col items-center">
        <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
          SCORE
        </span>
        <span
          className="text-sm sm:text-lg font-black text-slate-200 leading-tight"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          {score.toLocaleString()}
        </span>
      </div>

      <div className="h-5 w-[1px] bg-slate-800" />

      {/* SPECIAL METER BAR */}
      <div className="flex-1 flex flex-col min-w-[110px] max-w-xs">
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono mb-0.5">
          <span
            className={`font-black flex items-center gap-1 ${
              isSpecialReady ? 'text-yellow-300 animate-pulse' : 'text-slate-400'
            }`}
          >
            <Zap className="w-2.5 h-2.5 text-cyan-400 fill-current" />
            <span>SPECIAL</span>
          </span>
          <span className={`font-bold ${isSpecialReady ? 'text-yellow-300 animate-pulse' : 'text-cyan-400'}`}>
            {Math.round(specialMeter)}%
          </span>
        </div>

        <div className="w-full h-2 sm:h-2.5 bg-slate-900 rounded-sm overflow-hidden border border-slate-800 p-[1px]">
          <div
            className={`h-full rounded-[1px] transition-all duration-150 ${
              isSpecialReady
                ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-cyan-300 shadow-[0_0_10px_rgba(250,204,21,0.9)] animate-pulse'
                : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400'
            }`}
            style={{ width: `${Math.min(100, specialMeter)}%` }}
          />
        </div>
      </div>

      {/* SPECIAL BUTTON / PROMPT */}
      <button
        onClick={onTriggerSpecial}
        disabled={!isSpecialReady}
        className={`px-2.5 sm:px-3 py-1 rounded text-[9px] sm:text-[10px] font-black tracking-wider uppercase transition-all flex items-center gap-1 shrink-0 ${
          isSpecialReady
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_16px_rgba(245,158,11,0.8)] cursor-pointer hover:scale-105 active:scale-95 animate-bounce'
            : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
        }`}
        style={{ fontFamily: "'Chakra Petch', sans-serif" }}
      >
        <Zap className="w-3 h-3 fill-current" />
        <span>{isSpecialReady ? 'SPECIAL [SPACE]' : 'CHARGING'}</span>
      </button>
    </div>
  );
};

// Unified GameHUD component wrapper
export interface GameHUDProps extends BattleHUDProps, CombatDashboardProps {
  mode?: GameMode;
  timeRemaining?: number;
  wave?: number;
}

export const GameHUD: React.FC<GameHUDProps> = (props) => {
  return (
    <>
      <BattleHUD {...props} />
    </>
  );
};
