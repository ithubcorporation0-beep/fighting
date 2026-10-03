import React from 'react';
import { Delete, Zap } from 'lucide-react';

interface VirtualKeyboardProps {
  onKey: (char: string) => void;
  onBackspace: () => void;
  onSpecial: () => void;
  isSpecialReady: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKey,
  onBackspace,
  onSpecial,
  isSpecialReady,
}) => {
  return (
    <div
      className="w-full max-w-lg mx-auto flex flex-col items-center gap-1 sm:gap-1.5 px-1 py-1.5 sm:p-2 select-none touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Row 1: Q W E R T Y U I O P */}
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full">
        {KEYBOARD_ROWS[0].map((char) => (
          <button
            key={char}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onKey(char);
            }}
            className="flex-1 min-w-[26px] max-w-[42px] h-9 sm:h-10 md:h-11 bg-slate-900/95 active:bg-cyan-400 active:text-slate-950 text-slate-100 font-mono font-black text-xs sm:text-sm rounded border border-slate-700/80 shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:shadow-[0_0_12px_rgba(6,182,212,0.9)] active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
            aria-label={`Key ${char}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2: A S D F G H J K L */}
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-[92%] sm:w-[94%]">
        {KEYBOARD_ROWS[1].map((char) => (
          <button
            key={char}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onKey(char);
            }}
            className="flex-1 min-w-[26px] max-w-[42px] h-9 sm:h-10 md:h-11 bg-slate-900/95 active:bg-cyan-400 active:text-slate-950 text-slate-100 font-mono font-black text-xs sm:text-sm rounded border border-slate-700/80 shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:shadow-[0_0_12px_rgba(6,182,212,0.9)] active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
            aria-label={`Key ${char}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3: Z X C V B N M + BACKSPACE */}
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full">
        {KEYBOARD_ROWS[2].map((char) => (
          <button
            key={char}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onKey(char);
            }}
            className="flex-1 min-w-[26px] max-w-[42px] h-9 sm:h-10 md:h-11 bg-slate-900/95 active:bg-cyan-400 active:text-slate-950 text-slate-100 font-mono font-black text-xs sm:text-sm rounded border border-slate-700/80 shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:shadow-[0_0_12px_rgba(6,182,212,0.9)] active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
            aria-label={`Key ${char}`}
          >
            {char}
          </button>
        ))}

        {/* Backspace Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            onBackspace();
          }}
          className="min-w-[42px] sm:min-w-[52px] h-9 sm:h-10 md:h-11 px-2 bg-rose-950/80 active:bg-rose-500 text-rose-300 active:text-white font-mono text-xs rounded border border-rose-700/80 shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
          title="Backspace"
          aria-label="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Action Row: SPACE + UNLEASH SPECIAL */}
      <div className="flex items-center justify-center gap-1.5 w-full mt-0.5">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            onKey(' ');
          }}
          className="flex-1 h-8 sm:h-9 bg-slate-900/90 active:bg-slate-700 text-slate-300 font-mono font-bold text-xs sm:text-sm rounded border border-slate-700/80 active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
          aria-label="Space bar"
        >
          SPACE
        </button>

        {isSpecialReady && (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onSpecial();
            }}
            className="px-3 sm:px-4 h-8 sm:h-9 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black font-mono text-[11px] sm:text-xs rounded shadow-[0_0_14px_rgba(245,158,11,0.8)] active:scale-95 transition-all flex items-center gap-1 cursor-pointer animate-pulse select-none shrink-0"
            aria-label="Unleash Special Attack"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
            <span>SUPER STRIKE!</span>
          </button>
        )}
      </div>
    </div>
  );
};
