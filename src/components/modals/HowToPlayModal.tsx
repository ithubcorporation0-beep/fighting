import React from 'react';
import { X, Keyboard, Zap, Shield, Flame, Swords, ArrowRight } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.35)] flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-cyan-400" />
            <h2
              className="text-xl font-black uppercase text-white tracking-wider"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              HOW TO PLAY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Combat Flow Diagrams */}
        <div className="flex flex-col gap-4 text-xs font-mono">
          {/* Step Sequence */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-widest">
              CORE COMBAT LOOP
            </span>
            <div className="flex items-center justify-between text-center gap-1 text-[11px] text-slate-300">
              <div className="p-2 bg-slate-900 rounded border border-slate-700 flex-1">
                TYPE WORD
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="p-2 bg-slate-900 rounded border border-slate-700 flex-1">
                ATTACK
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="p-2 bg-slate-900 rounded border border-slate-700 flex-1">
                BUILD COMBO
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="p-2 bg-slate-900 rounded border border-slate-700 flex-1">
                VICTORY
              </div>
            </div>
          </div>

          {/* Attack Tiers */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              SPEED TIERS & CRITICAL HITS
            </span>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between">
                <span>Normal Pace:</span>
                <span className="text-slate-400">Basic Punch (6 dmg)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold">Fast Typing:</span>
                <span className="text-cyan-300">Heavy Kick (14 dmg)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-300 font-bold">Flawless & Fast:</span>
                <span className="text-yellow-300">CRITICAL HIT (1.5x Multiplier)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fuchsia-300 font-bold">Combo Multiplier:</span>
                <span className="text-fuchsia-300">Up to 2.5x damage boost</span>
              </div>
            </div>
          </div>

          {/* Special Attack Meter */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-yellow-400 font-bold">
              <Zap className="w-4 h-4 fill-current" />
              <span>SPECIAL POWER BEAM</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every correct word fuels your Special Meter. When it hits 100%, press{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-800 text-yellow-300 border border-slate-700 rounded text-[11px]">
                SPACE
              </kbd>{' '}
              to unleash a catastrophic plasma blast dealing 35+ damage and staggering the enemy.
            </p>
          </div>

          {/* Choose Fighter & Perks */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-cyan-400 font-bold">
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>ROSTER & FIGHTER PERKS</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-2">
              Select your own warrior from the roster of 6 cyber fighters. Each possesses custom base HP, damage multipliers, and passive perks:
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300">
              <div><strong className="text-red-400">KAI:</strong> +15% Score bonus</div>
              <div><strong className="text-cyan-400">MAYA:</strong> +35% Special charge</div>
              <div><strong className="text-amber-400">JAX:</strong> -20% Damage taken (130 HP)</div>
              <div><strong className="text-purple-400">NYX:</strong> +25% Critical strike rate</div>
              <div><strong className="text-orange-400">AXEL:</strong> Combo combustion blast</div>
              <div><strong className="text-emerald-400">YUKI:</strong> Slows enemy attacks</div>
            </div>
          </div>

          {/* Enemy Counterattacks */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-rose-400 font-bold">
              <Shield className="w-4 h-4" />
              <span>ENEMY TELEGRAPH & COUNTERS</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Watch the enemy's <span className="text-rose-400 font-bold">ATK timer</span>. If you type too slowly or make repeated typos, the enemy will strike you! Completing an attack staggers the opponent and interrupts their windup.
            </p>
          </div>

          {/* Controls Quick Ref */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1 text-slate-300 font-bold">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>CONTROLS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">A - Z</kbd> Type Letters</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">SPACE</kbd> Special Attack</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">BACKSPACE</kbd> Clear Typo</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ESC</kbd> Pause Game</div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          READY TO FIGHT
        </button>
      </div>
    </div>
  );
};
