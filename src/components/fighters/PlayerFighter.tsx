import React from 'react';
import { FighterAction } from '../../types/game';

interface PlayerFighterProps {
  action: FighterAction;
  reducedMotion?: boolean;
}

export const PlayerFighter: React.FC<PlayerFighterProps> = ({ action, reducedMotion = false }) => {
  // Action specific styling & transforms
  const getActionClass = () => {
    switch (action) {
      case 'punch':
        return 'translate-x-12 scale-105 duration-75';
      case 'kick':
        return 'translate-x-14 -translate-y-4 scale-105 duration-75';
      case 'special':
        return 'translate-x-8 scale-110 duration-100';
      case 'hurt':
        return '-translate-x-8 rotate-[-6deg] brightness-125 duration-100';
      case 'victory':
        return '-translate-y-3 duration-300';
      case 'defeat':
        return 'translate-y-8 rotate-12 opacity-80 duration-500';
      default:
        return reducedMotion ? '' : 'animate-[bounce_2.5s_ease-in-out_infinite]';
    }
  };

  return (
    <div className={`relative flex items-center justify-center transition-all select-none ${getActionClass()}`}>
      {/* Ground Shadow */}
      <div className="absolute -bottom-4 w-36 h-6 bg-black/60 rounded-full blur-md" />

      {/* Special Attack Energy Beam Projector when in special action */}
      {action === 'special' && (
        <div className="absolute left-28 -top-8 w-96 h-48 pointer-events-none z-30 flex items-center">
          <div className="w-full h-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent blur-md opacity-90 animate-pulse" />
          <div className="absolute w-full h-10 bg-gradient-to-r from-white via-cyan-200 to-transparent" />
          <div className="absolute -left-4 w-16 h-16 rounded-full bg-cyan-300 blur-lg animate-ping" />
        </div>
      )}

      {/* Cyber Fighter SVG Silhouette & Artwork */}
      <svg
        width="220"
        height="260"
        viewBox="0 0 220 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_16px_rgba(6,182,212,0.45)]"
      >
        <defs>
          <linearGradient id="kai-jacket" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="kai-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>

        {/* Back Leg */}
        <g className={action === 'kick' ? 'origin-center rotate-45 transition-transform' : ''}>
          <path d="M75 160 L60 210 L48 245" stroke="#1e1b4b" strokeWidth="18" strokeLinecap="round" />
          {/* Back Boot */}
          <path d="M48 245 L32 250 L56 254 Z" fill="#0284c7" />
        </g>

        {/* Torso & Cybernetic Vest */}
        <path
          d="M75 100 L125 95 L115 165 L68 160 Z"
          fill="url(#kai-jacket)"
          stroke="#4338ca"
          strokeWidth="3"
        />

        {/* Glowing Vest Circuit Stripes */}
        <path d="M85 105 L80 155" stroke="url(#kai-glow)" strokeWidth="3" strokeLinecap="round" />
        <path d="M105 102 L100 158" stroke="url(#kai-glow)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="92" cy="130" r="5" fill="#38bdf8" className="animate-pulse" />

        {/* Head / Face */}
        <g>
          {/* Neck */}
          <path d="M92 90 L92 105" stroke="#fbcfe8" strokeWidth="12" strokeLinecap="round" />
          {/* Head Base */}
          <circle cx="95" cy="72" r="22" fill="#fbcfe8" />
          {/* Spiky Street Fighter Hair */}
          <path
            d="M70 70 Q75 40 92 35 Q115 32 125 50 Q135 68 120 75 Q110 52 92 50 Q80 52 70 70 Z"
            fill="#09090b"
          />
          <path d="M78 45 L95 28 L106 44 L120 34 L124 55" stroke="#06b6d4" strokeWidth="2.5" />
          {/* Cyber Visor / Headband */}
          <rect x="76" y="65" width="40" height="9" rx="3" fill="#06b6d4" />
          <line x1="80" y1="69" x2="112" y2="69" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Front Leg */}
        <g>
          <path
            d={
              action === 'kick'
                ? 'M100 160 L150 145 L190 135' // Extended high kick
                : 'M95 160 L115 205 L112 245'
            }
            stroke="#1e293b"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Sneaker */}
          <path
            d={
              action === 'kick'
                ? 'M190 135 L205 130 L195 146 Z'
                : 'M112 245 L132 250 L108 254 Z'
            }
            fill="#38bdf8"
          />
        </g>

        {/* Back Arm */}
        <g>
          <path d="M75 105 L50 130 L65 145" stroke="#fbcfe8" strokeWidth="14" strokeLinecap="round" />
          <circle cx="65" cy="145" r="9" fill="#0284c7" />
        </g>

        {/* Lead Cyber Punching Arm */}
        <g>
          {action === 'punch' ? (
            // Extended Punch Pose
            <>
              <path d="M120 105 L165 102 L195 100" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" />
              {/* Fist */}
              <circle cx="198" cy="100" r="13" fill="#38bdf8" />
              {/* Energy Spark Trail */}
              <path d="M170 90 L210 100 L175 112" stroke="#ffffff" strokeWidth="3" />
            </>
          ) : action === 'special' ? (
            // Double Palm Thrust
            <>
              <path d="M115 105 L150 110 L170 110" stroke="#06b6d4" strokeWidth="16" strokeLinecap="round" />
              <circle cx="172" cy="110" r="14" fill="#67e8f9" />
            </>
          ) : action === 'hurt' ? (
            // Guarding Hurt Pose
            <>
              <path d="M110 105 L95 125 L90 140" stroke="#fbcfe8" strokeWidth="14" strokeLinecap="round" />
              <circle cx="90" cy="140" r="10" fill="#0284c7" />
            </>
          ) : action === 'victory' ? (
            // Raised Fist High
            <>
              <path d="M115 100 L130 65 L135 30" stroke="#06b6d4" strokeWidth="14" strokeLinecap="round" />
              <circle cx="135" cy="25" r="12" fill="#38bdf8" />
              <circle cx="135" cy="25" r="16" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" />
            </>
          ) : (
            // Normal Stance Arm (ready guard)
            <>
              <path d="M115 105 L145 125 L135 145" stroke="#fbcfe8" strokeWidth="14" strokeLinecap="round" />
              {/* Cyber Gauntlet */}
              <rect x="125" y="130" width="22" height="20" rx="4" fill="#06b6d4" />
              <circle cx="135" cy="145" r="10" fill="#0284c7" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
