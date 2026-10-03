import React from 'react';
import { GameMode, GameRunStats, EnemyArchetype } from '../../types/game';
import { ARCHETYPE_INFO } from '../../data/enemies';
import { Trophy, RotateCcw, ArrowRight, Home, Zap, Target, Gauge, Hash, Dices, Shield, Flame, Swords, Crown } from 'lucide-react';

interface GameOverModalProps {
  isVictory: boolean;
  mode: GameMode;
  level: number;
  maxCampaignLevel: number;
  stats: GameRunStats;
  enemyName?: string;
  enemyArchetype?: EnemyArchetype;
  isNewHighScore?: boolean;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  onChangeCharacter?: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  mode,
  level,
  maxCampaignLevel,
  stats,
  enemyName,
  enemyArchetype,
  isNewHighScore = false,
  onNextLevel,
  onPlayAgain,
  onChangeCharacter,
  onMainMenu,
}) => {
  // Compute Rank based on WPM and Accuracy
  const getRank = () => {
    if (!isVictory && mode === 'campaign') return 'D';
    if (stats.wpm >= 65 && stats.accuracy >= 95) return 'S';
    if (stats.wpm >= 50 && stats.accuracy >= 90) return 'A';
    if (stats.wpm >= 35 && stats.accuracy >= 80) return 'B';
    return 'C';
  };

  const rank = getRank();
  const hasNextLevel = mode === 'campaign' && isVictory && level < maxCampaignLevel;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/50 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(168,85,247,0.4)] flex flex-col items-center text-center">
        {/* Banner Title */}
        <div className="mb-4">
          {isNewHighScore && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-mono font-bold animate-pulse">
              <Trophy className="w-3.5 h-3.5" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          )}

          <h2
            className={`text-4xl md:text-5xl font-black uppercase tracking-wider drop-shadow-lg ${
              isVictory
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-cyan-300'
                : 'text-rose-500'
            }`}
            style={{ fontFamily: "'Chakra Petch', sans-serif" }}
          >
            {isVictory ? 'VICTORY!' : 'DEFEATED'}
          </h2>

          <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
            {isVictory
              ? mode === 'campaign'
                ? `SECTOR ${level} LIBERATED`
                : 'CHAMPION OF THE ARENA'
              : 'YOUR STRIKES FALTERED. RISE AGAIN!'}
          </p>

          {/* Opponent Info Badge */}
          {enemyName && (
            <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono">
              <span className="text-slate-400">OPPONENT:</span>
              <span className="font-bold text-white tracking-wider">{enemyName}</span>
              {enemyArchetype && (
                <span
                  className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${
                    ARCHETYPE_INFO[enemyArchetype]?.badgeColor || 'border-slate-700 text-cyan-300'
                  }`}
                >
                  {enemyArchetype.toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Big Rank Badge */}
        <div className="my-2 flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              FIGHTER RANK
            </span>
            <span
              className={`text-5xl font-black ${
                rank === 'S'
                  ? 'text-yellow-300 drop-shadow-[0_0_15px_#fde047]'
                  : rank === 'A'
                  ? 'text-cyan-400 drop-shadow-[0_0_15px_#22d3ee]'
                  : rank === 'B'
                  ? 'text-fuchsia-400 drop-shadow-[0_0_15px_#e879f9]'
                  : 'text-slate-400'
              }`}
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              {rank}
            </span>
          </div>
          <div className="h-12 w-[1px] bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              TOTAL SCORE
            </span>
            <span className="text-3xl font-black text-white font-mono">
              {stats.score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 my-5 text-left">
          {/* WPM */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>WPM</span>
            </div>
            <div className="text-xl font-bold font-mono text-cyan-300">{stats.wpm}</div>
          </div>

          {/* Accuracy */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACCURACY</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300">{stats.accuracy}%</div>
          </div>

          {/* Highest Combo */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>MAX COMBO</span>
            </div>
            <div className="text-xl font-bold font-mono text-yellow-300">{stats.highestCombo}x</div>
          </div>

          {/* Words Typed */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Hash className="w-3.5 h-3.5 text-purple-400" />
              <span>WORDS</span>
            </div>
            <div className="text-xl font-bold font-mono text-purple-300">
              {stats.wordsCompleted}
            </div>
          </div>
        </div>

        {/* Secondary Detailed Breakdown */}
        <div className="w-full py-2 px-3 bg-slate-950/40 rounded-lg text-xs font-mono text-slate-400 flex items-center justify-around mb-6 border border-slate-800/80">
          <div>
            <span>Mistakes: </span>
            <span className="text-rose-400 font-bold">{stats.incorrectKeystrokes}</span>
          </div>
          <span>·</span>
          <div>
            <span>Critical Hits: </span>
            <span className="text-amber-300 font-bold">{stats.criticalHits}</span>
          </div>
          <span>·</span>
          <div>
            <span>Time: </span>
            <span className="text-slate-200 font-bold">{Math.round(stats.timeElapsedSeconds)}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              <span>NEXT LEVEL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onPlayAgain}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              {mode === 'quick' ? <Dices className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
              <span>
                {mode === 'quick'
                  ? 'NEXT CHALLENGER'
                  : isVictory
                  ? 'PLAY AGAIN'
                  : 'TRY AGAIN'}
              </span>
            </button>
          )}

          {onChangeCharacter && (
            <button
              onClick={onChangeCharacter}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm"
            >
              <span>CHANGE FIGHTER</span>
            </button>
          )}

          <button
            onClick={onMainMenu}
            className="w-full py-3 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white font-bold rounded-xl border border-slate-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
