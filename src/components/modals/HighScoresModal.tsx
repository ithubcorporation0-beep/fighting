import React, { useState } from 'react';
import { HighScoreEntry, GameMode } from '../../types/game';
import { Trophy, X, Gauge, Target, Zap, Hash } from 'lucide-react';

interface HighScoresModalProps {
  scores: HighScoreEntry[];
  onClose: () => void;
}

export const HighScoresModal: React.FC<HighScoresModalProps> = ({ scores, onClose }) => {
  const [filterMode, setFilterMode] = useState<GameMode | 'all'>('all');

  const filteredScores =
    filterMode === 'all' ? scores : scores.filter((s) => s.mode === filterMode);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.35)] flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2
              className="text-xl font-black uppercase text-white tracking-wider"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              HALL OF FIGHTERS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 mb-4 text-xs font-mono">
          {(['all', 'campaign', 'quick', 'time_attack', 'endless'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`flex-1 py-1.5 px-2 rounded-md transition-colors uppercase font-bold text-[10px] sm:text-xs truncate ${
                filterMode === mode
                  ? 'bg-fuchsia-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Scores Table */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredScores.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm">
              No battle records found yet for this mode.
            </div>
          ) : (
            filteredScores.map((entry, idx) => (
              <div
                key={entry.id}
                className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between font-mono"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center font-black text-sm ${
                      idx === 0
                        ? 'text-yellow-400'
                        : idx === 1
                        ? 'text-slate-300'
                        : idx === 2
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <span>{entry.mode.replace('_', ' ')}</span>
                      {entry.mode === 'campaign' && (
                        <span className="text-[10px] text-fuchsia-400">LVL {entry.levelReached}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">{entry.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs text-cyan-300 font-semibold">{entry.wpm} WPM</div>
                    <div className="text-[10px] text-slate-400">{entry.accuracy}% ACC</div>
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-amber-300">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-yellow-400/80">{entry.highestCombo}x COMBO</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl transition-colors cursor-pointer text-sm"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
