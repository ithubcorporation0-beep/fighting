import React from 'react';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onChangeCharacter?: () => void;
  onOpenSettings: () => void;
  onMainMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onChangeCharacter,
  onOpenSettings,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.35)] flex flex-col items-center text-center">
        <h2
          className="text-2xl md:text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 tracking-wider mb-6"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          GAME PAUSED
        </h2>

        <div className="w-full flex flex-col gap-3">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            style={{ fontFamily: "'Chakra Petch', sans-serif" }}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>RESUME</span>
          </button>

          {/* Change Fighter */}
          {onChangeCharacter && (
            <button
              onClick={onChangeCharacter}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>CHANGE FIGHTER</span>
            </button>
          )}

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>RESTART</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Settings className="w-4 h-4 text-fuchsia-400" />
            <span>SETTINGS</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={onMainMenu}
            className="w-full py-2.5 px-4 bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 font-semibold rounded-xl border border-slate-700/60 hover:border-rose-800 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>

        <p className="mt-5 text-[11px] font-mono text-slate-500">
          Press [ESC] to resume
        </p>
      </div>
    </div>
  );
};
