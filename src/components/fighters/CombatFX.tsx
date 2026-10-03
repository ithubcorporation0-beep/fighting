import React from 'react';
import { FloatingDamage, HitEffect } from '../../types/game';

interface CombatFXProps {
  floatingDamages: FloatingDamage[];
  hitEffects: HitEffect[];
  comboMessage: string;
}

export const CombatFX: React.FC<CombatFXProps> = ({
  floatingDamages,
  hitEffects,
  comboMessage,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Floating Damage & Heal Numbers */}
      {floatingDamages.map((dmg) => (
        <div
          key={dmg.id}
          className={`absolute text-2xl md:text-3xl font-extrabold select-none transition-all animate-[damage-float_0.85s_ease-out_forwards] font-mono ${
            dmg.isCrit
              ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(234,179,8,0.9)] scale-125'
              : dmg.isHeal
              ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]'
              : dmg.isEnemy
              ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]'
              : 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]'
          }`}
          style={{
            left: dmg.isEnemy ? `calc(54% + ${dmg.xOffset}px)` : `calc(45% + ${dmg.xOffset}px)`,
            top: `calc(42% + ${dmg.yOffset}px)`,
          }}
        >
          {dmg.text}
        </div>
      ))}

      {/* Hit Sparks & Particle Bursts */}
      {hitEffects.map((hit) => (
        <div
          key={hit.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none animate-[ping_0.35s_ease-out_forwards]"
          style={{
            left: `${hit.x}%`,
            top: `${hit.y}%`,
            width: `${hit.size}px`,
            height: `${hit.size}px`,
          }}
        >
          <div
            className={`w-full h-full rounded-full blur-[2px] ${
              hit.type === 'crit'
                ? 'bg-gradient-to-r from-yellow-300 to-amber-500 shadow-[0_0_30px_#f59e0b]'
                : hit.type === 'special'
                ? 'bg-gradient-to-r from-cyan-300 via-white to-blue-500 shadow-[0_0_40px_#06b6d4]'
                : 'bg-gradient-to-r from-rose-400 to-orange-500 shadow-[0_0_20px_#f43f5e]'
            }`}
          />
        </div>
      ))}

      {/* Central Feedback Popups: "PERFECT!", "GREAT!", "COMBO!", "MISS" */}
      {comboMessage && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div
            className={`px-6 py-2 rounded-lg font-black tracking-widest text-xl md:text-3xl uppercase animate-[bounce_0.4s_ease-out] backdrop-blur-sm border ${
              comboMessage === 'PERFECT!'
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/60 shadow-[0_0_25px_rgba(234,179,8,0.5)]'
                : comboMessage === 'GREAT!'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : comboMessage === 'MISS!' || comboMessage === 'ERROR'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/60 shadow-[0_0_20px_rgba(217,70,239,0.4)]'
            }`}
            style={{ fontFamily: "'Chakra Petch', sans-serif" }}
          >
            {comboMessage}
          </div>
        </div>
      )}
    </div>
  );
};
