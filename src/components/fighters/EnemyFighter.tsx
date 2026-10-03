import React from 'react';
import { EnemyConfig, FighterAction } from '../../types/game';

interface EnemyFighterProps {
  enemy: EnemyConfig;
  action: FighterAction;
  reducedMotion?: boolean;
}

export const EnemyFighter: React.FC<EnemyFighterProps> = ({
  enemy,
  action,
  reducedMotion = false,
}) => {
  const getActionClass = () => {
    switch (action) {
      case 'punch':
        return '-translate-x-12 scale-105 duration-75';
      case 'kick':
        return '-translate-x-14 -translate-y-2 scale-105 duration-75';
      case 'hurt':
        return 'translate-x-10 rotate-[8deg] brightness-125 duration-100';
      case 'defeat':
        return 'translate-y-12 rotate-45 opacity-60 duration-500';
      default:
        return reducedMotion ? '' : 'animate-[bounce_3s_ease-in-out_infinite]';
    }
  };

  const { primary, secondary, accent } = enemy.colorTheme;

  return (
    <div className={`relative flex items-center justify-center transition-all select-none ${getActionClass()}`}>
      {/* Ground Shadow */}
      <div className="absolute -bottom-4 w-40 h-6 bg-black/60 rounded-full blur-md" />

      {/* Telegraph Aura when enemy is preparing to attack */}
      {action === 'punch' && (
        <div
          className="absolute -inset-4 rounded-full blur-xl opacity-75 animate-ping pointer-events-none"
          style={{ backgroundColor: primary }}
        />
      )}

      {/* SVG Enemy Artwork */}
      <svg
        width="230"
        height="260"
        viewBox="0 0 230 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="scale-x-[-1]" // Facing left towards the player
        style={{
          filter: `drop-shadow(0 0 16px ${enemy.colorTheme.glow})`,
        }}
      >
        <defs>
          <linearGradient id={`enemy-grad-${enemy.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondary} />
            <stop offset="100%" stopColor={primary} />
          </linearGradient>
        </defs>

        {/* ================= ROOK (BRAWLER) ================= */}
        {enemy.id === 'rook' && (
          <g>
            {/* Legs */}
            <path d="M75 160 L60 210 L50 248" stroke="#1f2937" strokeWidth="22" strokeLinecap="round" />
            <path d="M50 248 L35 252 L55 255 Z" fill="#991b1b" />
            <path d="M100 160 L120 210 L115 248" stroke="#111827" strokeWidth="24" strokeLinecap="round" />
            <path d="M115 248 L135 252 L110 255 Z" fill="#dc2626" />

            {/* Heavy Brawler Torso */}
            <path d="M65 95 L135 90 L125 165 L60 160 Z" fill={`url(#enemy-grad-${enemy.id})`} />
            <path d="M85 95 L85 160" stroke="#7f1d1d" strokeWidth="4" />
            <path d="M110 93 L110 162" stroke="#7f1d1d" strokeWidth="4" />

            {/* Head & Mohawk */}
            <circle cx="100" cy="68" r="22" fill="#fed7aa" />
            {/* Crimson Mohawk */}
            <path d="M92 48 Q100 25 105 48" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
            <rect x="88" y="62" width="26" height="6" rx="2" fill="#111827" />
            <circle cx="106" cy="65" r="2.5" fill="#ef4444" />

            {/* Spiked Knuckle Arms */}
            {action === 'punch' ? (
              <g>
                <path d="M125 105 L175 100 L205 98" stroke="#fed7aa" strokeWidth="18" strokeLinecap="round" />
                <circle cx="210" cy="98" r="15" fill="#991b1b" />
                {/* Spikes */}
                <path d="M210 85 L222 98 L210 110" stroke="#fca5a5" strokeWidth="4" />
              </g>
            ) : (
              <g>
                <path d="M125 105 L150 125 L140 150" stroke="#fed7aa" strokeWidth="16" strokeLinecap="round" />
                <rect x="130" y="140" width="22" height="18" rx="4" fill="#991b1b" />
                <circle cx="136" cy="148" r="2" fill="#ffffff" />
                <circle cx="144" cy="148" r="2" fill="#ffffff" />
              </g>
            )}
          </g>
        )}

        {/* ================= VIPER (CYBERBLADE) ================= */}
        {enemy.id === 'viper' && (
          <g>
            {/* Agile Ninja Legs */}
            <path d="M80 155 L65 205 L52 248" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" />
            <path d="M52 248 L35 252 L55 254 Z" fill="#0891b2" />
            <path d="M105 155 L125 205 L120 248" stroke="#164e63" strokeWidth="18" strokeLinecap="round" />
            <path d="M120 248 L140 252 L115 254 Z" fill="#06b6d4" />

            {/* Trenchcoat Tails */}
            <path d="M60 150 L35 210 L50 200 L40 230" stroke="#0e7490" strokeWidth="4" fill="none" />

            {/* Sleek Torso */}
            <path d="M70 95 L120 90 L112 160 L68 155 Z" fill={`url(#enemy-grad-${enemy.id})`} />
            <line x1="95" y1="92" x2="90" y2="158" stroke="#22d3ee" strokeWidth="2.5" />

            {/* Masked Head */}
            <circle cx="95" cy="70" r="20" fill="#083344" />
            <path d="M80 68 L110 68" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
            <path d="M85 52 L95 40 L108 52" stroke="#06b6d4" strokeWidth="4" />

            {/* Dual Cyber Blades */}
            {action === 'punch' ? (
              <g>
                <path d="M120 100 L170 95 L200 90" stroke="#155e75" strokeWidth="14" strokeLinecap="round" />
                {/* Plasma Blade extension */}
                <path d="M190 90 L228 85 L180 110 Z" fill="#22d3ee" className="animate-pulse" />
              </g>
            ) : (
              <g>
                <path d="M115 100 L140 120 L135 145" stroke="#155e75" strokeWidth="14" strokeLinecap="round" />
                <path d="M135 145 L170 120 L160 160 Z" fill="#06b6d4" />
              </g>
            )}
          </g>
        )}

        {/* ================= TITAN-9 (HEAVY MECH) ================= */}
        {enemy.id === 'titan' && (
          <g>
            {/* Giant Hydraulic Legs */}
            <rect x="50" y="160" width="30" height="85" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="3" />
            <rect x="42" y="240" width="45" height="15" rx="3" fill="#b45309" />
            <rect x="100" y="160" width="34" height="85" rx="6" fill="#92400e" stroke="#451a03" strokeWidth="3" />
            <rect x="95" y="240" width="50" height="15" rx="3" fill="#d97706" />

            {/* Massive Armored Chest */}
            <polygon points="55,85 145,80 135,165 50,165" fill="#b45309" stroke="#78350f" strokeWidth="4" />
            <circle cx="95" cy="125" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="3" className="animate-pulse" />

            {/* Heavy Helmet */}
            <rect x="75" y="50" width="45" height="35" rx="6" fill="#451a03" stroke="#b45309" strokeWidth="3" />
            <rect x="82" y="65" width="32" height="7" rx="2" fill="#fbbf24" />

            {/* Hydraulic Puncher Arm */}
            {action === 'punch' ? (
              <g>
                <rect x="130" y="90" width="65" height="26" rx="4" fill="#d97706" />
                <circle cx="205" cy="103" r="22" fill="#b45309" />
                <line x1="205" y1="85" x2="205" y2="120" stroke="#fde68a" strokeWidth="4" />
              </g>
            ) : (
              <g>
                <rect x="120" y="95" width="28" height="55" rx="4" fill="#92400e" />
                <circle cx="134" cy="155" r="18" fill="#b45309" />
              </g>
            )}
          </g>
        )}

        {/* ================= KAGE (SHADOW NINJA) ================= */}
        {enemy.id === 'kage' && (
          <g>
            {/* Shadow particles */}
            <circle cx="45" cy="120" r="12" fill="#581c87" opacity="0.4" />
            <circle cx="60" cy="70" r="8" fill="#7e22ce" opacity="0.3" />

            {/* Slim Violet Assassin Body */}
            <path d="M78 155 L60 205 L48 248" stroke="#3b0764" strokeWidth="16" strokeLinecap="round" />
            <path d="M102 155 L120 205 L116 248" stroke="#581c87" strokeWidth="18" strokeLinecap="round" />

            <path d="M68 95 L118 90 L110 160 L65 155 Z" fill={`url(#enemy-grad-${enemy.id})`} />
            <path d="M85 92 L95 158" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />

            {/* Glowing Violet Eyes Mask */}
            <circle cx="94" cy="70" r="19" fill="#1e1b4b" />
            <circle cx="88" cy="69" r="3" fill="#c084fc" />
            <circle cx="102" cy="69" r="3" fill="#c084fc" />

            {/* Shadow Daggers */}
            {action === 'punch' ? (
              <g>
                <path d="M115 100 L165 95 L195 90" stroke="#6b21a8" strokeWidth="14" strokeLinecap="round" />
                <polygon points="195,80 225,90 195,100" fill="#d8b4fe" />
              </g>
            ) : (
              <g>
                <path d="M115 100 L135 125 L130 150" stroke="#6b21a8" strokeWidth="14" strokeLinecap="round" />
                <polygon points="125,145 155,160 130,170" fill="#a855f7" />
              </g>
            )}
          </g>
        )}

        {/* ================= OVERLORD ZERO (FINAL BOSS) ================= */}
        {enemy.id === 'zero' && (
          <g>
            {/* Floating Orbiting Drones */}
            <circle cx="35" cy="50" r="8" fill="#fda4af" stroke="#f43f5e" strokeWidth="2" className="animate-bounce" />
            <circle cx="185" cy="45" r="8" fill="#fda4af" stroke="#f43f5e" strokeWidth="2" className="animate-bounce" />

            {/* Regal Dark Armor & Crimson Cape */}
            <path d="M50 90 L30 220 L60 210 L50 245 Z" fill="#881337" opacity="0.8" />

            <path d="M75 155 L60 205 L48 248" stroke="#1f2937" strokeWidth="20" strokeLinecap="round" />
            <path d="M105 155 L125 205 L120 248" stroke="#111827" strokeWidth="22" strokeLinecap="round" />

            <path d="M65 90 L130 85 L120 162 L60 158 Z" fill={`url(#enemy-grad-${enemy.id})`} />
            <polygon points="95,105 110,130 80,130" fill="#ffffff" stroke="#f43f5e" strokeWidth="2" />

            {/* Cyber Crown / Headpiece */}
            <circle cx="98" cy="65" r="22" fill="#0f172a" />
            <polygon points="80,50 90,32 98,48 106,32 116,50" fill="#f43f5e" />
            <line x1="86" y1="65" x2="110" y2="65" stroke="#fda4af" strokeWidth="3" />

            {/* Supreme Cyber Arm / Death Cannon */}
            {action === 'punch' ? (
              <g>
                <path d="M125 100 L175 92 L205 90" stroke="#be123c" strokeWidth="18" strokeLinecap="round" />
                <circle cx="212" cy="90" r="18" fill="#f43f5e" />
                <circle cx="212" cy="90" r="25" stroke="#fda4af" strokeWidth="3" strokeDasharray="6 3" />
              </g>
            ) : (
              <g>
                <path d="M120 100 L145 125 L140 150" stroke="#be123c" strokeWidth="16" strokeLinecap="round" />
                <circle cx="140" cy="150" r="14" fill="#e11d48" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
