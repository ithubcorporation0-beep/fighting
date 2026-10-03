import React from 'react';
import { Zap } from 'lucide-react';

interface SpecialMeterProps {
  specialMeter: number; // 0 to 100
  isSpecialReady: boolean;
  onTriggerSpecial: () => void;
  disabled?: boolean;
}

export const SpecialMeter: React.FC<SpecialMeterProps> = ({
  specialMeter,
  isSpecialReady,
  onTriggerSpecial,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex items-center gap-3 px-3 py-1">
      <div className="flex-1">
        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
          <div className="flex items-center gap-1.5 font-bold tracking-wider">
            <Zap className={`w-3.5 h-3.5 ${isSpecialReady ? 'text-yellow-300 animate-bounce' : 'text-cyan-400'}`} />
            <span className={isSpecialReady ? 'text-yellow-300 font-black' : 'text-slate-300'}>
              SPECIAL POWER
            </span>
          </div>
          <span className={`font-bold ${isSpecialReady ? 'text-yellow-300 animate-pulse' : 'text-cyan-400'}`}>
            {Math.round(specialMeter)}%
          </span>
        </div>

        {/* Meter Gauge */}
        <div className="relative w-full h-3 bg-slate-900 rounded-sm overflow-hidden border border-slate-700 p-0.5">
          <div
            className={`h-full rounded-sm transition-all duration-200 ${
              isSpecialReady
                ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-cyan-300 shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-pulse'
                : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400'
            }`}
            style={{ width: `${specialMeter}%` }}
          />
        </div>
      </div>

      {/* Activation Button */}
      <button
        onClick={onTriggerSpecial}
        disabled={!isSpecialReady || disabled}
        className={`px-3 md:px-4 py-2 rounded text-xs md:text-sm font-black tracking-wider uppercase transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
          isSpecialReady && !disabled
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.7)] cursor-pointer scale-105 active:scale-95'
            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
        }`}
        style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        title={isSpecialReady ? 'Unleash Special Attack (Press SPACE)' : 'Charge meter by typing words'}
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>{isSpecialReady ? 'SPECIAL [SPACE]' : 'LOCKED'}</span>
      </button>
    </div>
  );
};
