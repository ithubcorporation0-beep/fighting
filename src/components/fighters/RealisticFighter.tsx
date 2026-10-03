import React from 'react';
import { FighterAction, EnemyArchetype } from '../../types/game';

interface RealisticFighterProps {
  type: 'player' | 'enemy';
  characterId?: string; // 'kai' | 'maya' | 'jax' | 'nyx' | 'axel' | 'yuki'
  enemyId?: string;     // 'rook' | 'viper' | 'volt' | 'crusher' | 'berserker' | 'titan' | 'goliath' | 'kage' | 'specter' | 'blaze' | 'zero'
  enemyArchetype?: EnemyArchetype;
  action: FighterAction;
  reducedMotion?: boolean;
  isTelegraphing?: boolean;
  isInvulnerable?: boolean;
}

export const RealisticFighter: React.FC<RealisticFighterProps> = ({
  type,
  characterId = 'kai',
  enemyId = 'rook',
  enemyArchetype,
  action,
  reducedMotion = false,
  isTelegraphing = false,
  isInvulnerable = false,
}) => {
  const isPlayer = type === 'player';

  // Combat displacement and stance transforms based on action
  const getTransformClasses = () => {
    switch (action) {
      case 'light_attack':
      case 'attack':
      case 'punch':
        return isPlayer
          ? 'translate-x-12 md:translate-x-18 scale-105 duration-75 z-20'
          : '-translate-x-12 md:-translate-x-18 scale-105 duration-75 z-20';
      case 'heavy_attack':
      case 'kick':
        return isPlayer
          ? 'translate-x-16 md:translate-x-24 -translate-y-2 scale-110 duration-100 z-20'
          : '-translate-x-16 md:-translate-x-24 -translate-y-2 scale-110 duration-100 z-20';
      case 'combo_attack':
        return isPlayer
          ? 'translate-x-14 md:translate-x-20 scale-105 duration-75 z-20'
          : '-translate-x-14 md:-translate-x-20 scale-105 duration-75 z-20';
      case 'special_attack':
      case 'special':
        return isPlayer
          ? 'translate-x-20 md:translate-x-28 scale-115 duration-100 z-20'
          : '-translate-x-20 md:-translate-x-28 scale-115 duration-100 z-20';
      case 'block':
        return isPlayer
          ? '-translate-x-3 scale-95 duration-100'
          : 'translate-x-3 scale-95 duration-100';
      case 'hit':
      case 'hurt':
        return isPlayer
          ? '-translate-x-10 md:-translate-x-14 rotate-[-6deg] duration-100'
          : 'translate-x-10 md:translate-x-14 rotate-[6deg] duration-100';
      case 'heavy_hit':
        return isPlayer
          ? '-translate-x-18 md:-translate-x-24 rotate-[-12deg] duration-150'
          : 'translate-x-18 md:translate-x-24 rotate-[12deg] duration-150';
      case 'defeat':
        return 'translate-y-12 rotate-45 opacity-50 duration-500';
      case 'victory':
        return '-translate-y-4 duration-300';
      case 'type_ready':
        return isPlayer ? 'translate-x-2 scale-[1.02] duration-100' : '';
      default:
        if (isTelegraphing) {
          return '-translate-x-3 -translate-y-1 scale-105 duration-150 animate-pulse';
        }
        return reducedMotion
          ? ''
          : isPlayer
          ? 'animate-[boxer-bounce_1.4s_ease-in-out_infinite]'
          : 'animate-[boxer-bounce_1.5s_ease-in-out_infinite]';
    }
  };

  const isAttacking =
    action === 'light_attack' ||
    action === 'heavy_attack' ||
    action === 'special_attack' ||
    action === 'combo_attack' ||
    action === 'attack' ||
    action === 'punch' ||
    action === 'kick' ||
    action === 'special';

  // Character-specific visual color configuration
  const getPlayerVisuals = () => {
    switch (characterId) {
      case 'maya':
        return {
          jacketGradId: 'maya-jacket',
          topColor1: '#06b6d4',
          topColor2: '#0891b2',
          trimColor: '#e0f2fe',
          pantsColor: '#0f172a',
          skinColor: '#fbcfe8',
          hairColor: '#0f172a',
          accentGlow: 'rgba(6, 182, 212, 0.6)',
          fistColor: '#06b6d4',
          specialAura: 'from-cyan-400 via-sky-300 to-transparent',
          sparkColor: '#38bdf8',
        };
      case 'jax':
        return {
          jacketGradId: 'jax-armor',
          topColor1: '#475569',
          topColor2: '#1e293b',
          trimColor: '#f59e0b',
          pantsColor: '#090d16',
          skinColor: '#94a3b8',
          hairColor: '#09090b',
          accentGlow: 'rgba(245, 158, 11, 0.6)',
          fistColor: '#f59e0b',
          specialAura: 'from-amber-500 via-yellow-400 to-transparent',
          sparkColor: '#fbbf24',
        };
      case 'nyx':
        return {
          jacketGradId: 'nyx-suit',
          topColor1: '#581c87',
          topColor2: '#2e1065',
          trimColor: '#c084fc',
          pantsColor: '#090514',
          skinColor: '#f5d0fe',
          hairColor: '#090514',
          accentGlow: 'rgba(168, 85, 247, 0.6)',
          fistColor: '#a855f7',
          specialAura: 'from-purple-500 via-fuchsia-400 to-transparent',
          sparkColor: '#c084fc',
        };
      case 'axel':
        return {
          jacketGradId: 'axel-vest',
          topColor1: '#ea580c',
          topColor2: '#9a3412',
          trimColor: '#fde047',
          pantsColor: '#1c1917',
          skinColor: '#fed7aa',
          hairColor: '#ea580c',
          accentGlow: 'rgba(234, 88, 12, 0.6)',
          fistColor: '#ea580c',
          specialAura: 'from-orange-500 via-amber-400 to-transparent',
          sparkColor: '#f97316',
        };
      case 'yuki':
        return {
          jacketGradId: 'yuki-coat',
          topColor1: '#059669',
          topColor2: '#064e3b',
          trimColor: '#a7f3d0',
          pantsColor: '#062820',
          skinColor: '#fbcfe8',
          hairColor: '#09090b',
          accentGlow: 'rgba(16, 185, 129, 0.6)',
          fistColor: '#10b981',
          specialAura: 'from-emerald-400 via-teal-300 to-transparent',
          sparkColor: '#34d399',
        };
      case 'kai':
      default:
        return {
          jacketGradId: 'kai-jacket',
          topColor1: '#ef4444',
          topColor2: '#b91c1c',
          trimColor: '#fbbf24',
          pantsColor: '#1e293b',
          skinColor: '#a16207',
          hairColor: '#09090b',
          accentGlow: 'rgba(239, 68, 68, 0.6)',
          fistColor: '#dc2626',
          specialAura: 'from-cyan-400 via-blue-500 to-transparent',
          sparkColor: '#38bdf8',
        };
    }
  };

  // Enemy-specific visual configuration
  const getEnemyVisuals = () => {
    const rawId = (enemyId || '').toLowerCase();
    const isSpeedster = rawId.includes('viper') || rawId.includes('volt') || enemyArchetype === 'Speedster';
    const isHeavy = rawId.includes('crusher') || rawId.includes('berserker') || enemyArchetype === 'Heavy';
    const isTank = rawId.includes('titan') || rawId.includes('goliath') || enemyArchetype === 'Tank';
    const isAssassin = rawId.includes('kage') || rawId.includes('specter') || enemyArchetype === 'Assassin';
    const isBoss = rawId.includes('zero') || enemyArchetype === 'Boss';

    if (isSpeedster) {
      return {
        topColor1: '#0891b2',
        topColor2: '#164e63',
        patternColor: '#06b6d4',
        skinColor: '#bae6fd',
        glow: '#06b6d4',
        maskColor: '#38bdf8',
        accentArmor: '#0284c7',
        archetype: 'Speedster' as const,
      };
    }
    if (isHeavy) {
      return {
        topColor1: '#ea580c',
        topColor2: '#7c2d12',
        patternColor: '#f97316',
        skinColor: '#fed7aa',
        glow: '#f59e0b',
        maskColor: '#fde047',
        accentArmor: '#c2410c',
        archetype: 'Heavy' as const,
      };
    }
    if (isTank) {
      return {
        topColor1: '#0f766e',
        topColor2: '#042f2e',
        patternColor: '#14b8a6',
        skinColor: '#99f6e4',
        glow: '#10b981',
        maskColor: '#6ee7b7',
        accentArmor: '#0d9488',
        archetype: 'Tank' as const,
      };
    }
    if (isAssassin) {
      return {
        topColor1: '#6b21a8',
        topColor2: '#2e1065',
        patternColor: '#7e22ce',
        skinColor: '#d8b4fe',
        glow: '#a855f7',
        maskColor: '#c084fc',
        accentArmor: '#581c87',
        archetype: 'Assassin' as const,
      };
    }
    if (isBoss) {
      return {
        topColor1: '#be123c',
        topColor2: '#4c0519',
        patternColor: '#9f1239',
        skinColor: '#fecdd3',
        glow: '#f43f5e',
        maskColor: '#fda4af',
        accentArmor: '#881337',
        archetype: 'Boss' as const,
      };
    }
    // Default: Brawler
    return {
      topColor1: '#334155',
      topColor2: '#0f172a',
      patternColor: '#dc2626',
      skinColor: '#fed7aa',
      glow: '#ef4444',
      maskColor: '#f87171',
      accentArmor: '#991b1b',
      archetype: 'Brawler' as const,
    };
  };

  const playerVis = getPlayerVisuals();
  const enemyVis = getEnemyVisuals();

  return (
    <div
      className={`relative flex items-center justify-center select-none transition-all ${getTransformClasses()}`}
      style={{
        transformOrigin: 'bottom center',
      }}
    >
      {/* Dual-Layer Ground Contact Shadow */}
      <div className="absolute -bottom-2.5 w-32 sm:w-40 md:w-48 h-5 sm:h-6 md:h-7 bg-black/75 rounded-full blur-md -z-10" />
      <div className="absolute -bottom-1.5 w-24 sm:w-30 md:w-36 h-3 bg-black/90 rounded-full blur-[2px] -z-10" />

      {/* Impact Spark Flash when hit */}
      {(action === 'hit' || action === 'hurt' || action === 'heavy_hit') && (
        <div className="absolute -top-6 inset-x-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-20 h-20 rounded-full bg-yellow-400/90 blur-md animate-ping" />
          <div className="absolute w-28 h-28 rounded-full border-2 border-orange-400 animate-ping opacity-75" />
        </div>
      )}

      {/* Enemy Telegraph Warning: Aura & Reticle */}
      {!isPlayer && isTelegraphing && (
        <div className="absolute -top-12 inset-x-0 flex flex-col items-center pointer-events-none z-40">
          <div className="px-2 py-0.5 rounded bg-rose-600 border border-white text-[10px] font-black tracking-widest text-white shadow-[0_0_15px_rgba(244,63,94,0.9)] animate-bounce uppercase">
            ⚠️ WINDING UP!
          </div>
          <div className="w-10 h-10 border-2 border-red-500 rounded-full animate-ping opacity-75 mt-1" />
        </div>
      )}

      {/* Enemy Telegraph Charging Halo */}
      {!isPlayer && isTelegraphing && (
        <div className="absolute -inset-4 rounded-full bg-rose-500/30 blur-xl pointer-events-none animate-pulse z-0" />
      )}

      {/* Special Attack Aura */}
      {(action === 'special' || action === 'special_attack') && (
        <div
          className={`absolute -inset-6 rounded-full blur-2xl pointer-events-none z-0 ${
            isPlayer ? 'bg-cyan-400/60 animate-pulse' : 'bg-rose-500/60 animate-pulse'
          }`}
        />
      )}

      {/* Player Defense Invulnerability Shield Shimmer */}
      {isPlayer && isInvulnerable && (
        <div className="absolute -inset-3 rounded-full border-2 border-cyan-400 bg-cyan-400/20 blur-[1px] pointer-events-none animate-pulse z-30 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-white/60 animate-ping opacity-40" />
        </div>
      )}

      {/* Dynamic Attack Motion Trails */}
      {isAttacking && (
        <div
          className={`absolute inset-0 pointer-events-none z-10 opacity-70 ${
            isPlayer ? 'translate-x-[-15px]' : 'translate-x-[15px]'
          }`}
        >
          <div
            className={`w-full h-full rounded-full blur-sm ${
              action === 'special_attack' || action === 'special'
                ? isPlayer
                  ? `bg-gradient-to-r ${playerVis.specialAura}`
                  : 'bg-gradient-to-l from-rose-500/40 via-purple-500/30 to-transparent'
                : action === 'heavy_attack' || action === 'kick'
                ? isPlayer
                  ? 'bg-gradient-to-r from-sky-400/30 to-transparent'
                  : 'bg-gradient-to-l from-amber-500/30 to-transparent'
                : isPlayer
                ? 'bg-cyan-400/20'
                : 'bg-rose-400/20'
            }`}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* PLAYER FIGHTER (DYNAMIC ROSTER SPRITE)                         */}
      {/* ============================================================== */}
      {isPlayer ? (
        <svg
          viewBox="0 0 180 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[105px] h-[163px] xs:w-[125px] xs:h-[194px] sm:w-[150px] sm:h-[233px] md:w-[170px] md:h-[264px] lg:w-[180px] lg:h-[280px] drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]"
        >
          <defs>
            <linearGradient id={playerVis.jacketGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={playerVis.topColor1} />
              <stop offset="100%" stopColor={playerVis.topColor2} />
            </linearGradient>
            <linearGradient id="skin-player-dynamic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={playerVis.skinColor} />
              <stop offset="100%" stopColor={playerVis.topColor2} stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Rear Leg */}
          <g>
            <path
              d={
                action === 'kick' || action === 'heavy_attack'
                  ? 'M65 170 L50 220 L35 265'
                  : 'M65 170 L55 215 L45 265'
              }
              stroke={playerVis.pantsColor}
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Rear Sneaker / Boot */}
            <path d="M45 265 L30 270 L52 274 Z" fill="#0f172a" />
            <path d="M30 270 L52 274" stroke={playerVis.trimColor} strokeWidth="2.5" />
          </g>

          {/* Lead Front Leg */}
          <g>
            <path
              d={
                action === 'kick' || action === 'heavy_attack'
                  ? 'M85 170 L135 150 L175 140'
                  : 'M85 170 L105 215 L102 265'
              }
              stroke={playerVis.pantsColor}
              strokeWidth="22"
              strokeLinecap="round"
            />
            {/* Front Sneaker / Boot */}
            <path
              d={
                action === 'kick' || action === 'heavy_attack'
                  ? 'M175 140 L188 135 L180 152 Z'
                  : 'M102 265 L120 270 L96 274 Z'
              }
              fill="#0f172a"
            />
            <path
              d={
                action === 'kick' || action === 'heavy_attack'
                  ? 'M175 140 L188 135'
                  : 'M102 265 L120 270'
              }
              stroke={playerVis.trimColor}
              strokeWidth="2.5"
            />
          </g>

          {/* Torso & Outfit */}
          <g>
            {/* Undershirt / Base Armor */}
            <path d="M68 98 L108 96 L100 175 L62 170 Z" fill="#090d16" />

            {/* Main Jacket / Armor Body */}
            <path
              d="M56 95 L118 92 L106 172 L52 168 Z"
              fill={`url(#${playerVis.jacketGradId})`}
              stroke={playerVis.topColor2}
              strokeWidth="2"
            />

            {/* Inner V-opening / Tech Core */}
            <path d="M80 94 L88 150 L96 94 Z" fill="#0f172a" />

            {/* Character Signature Accents */}
            {characterId === 'kai' && (
              <>
                {/* Gold Chain */}
                <path d="M80 98 Q88 140 96 98" stroke="#fbbf24" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <circle cx="88" cy="138" r="4" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
              </>
            )}

            {characterId === 'maya' && (
              <>
                {/* Valkyrie Energy Stripes */}
                <path d="M72 108 L102 108" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                <path d="M76 130 L98 130" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="88" cy="118" r="4" fill="#22d3ee" className="animate-pulse" />
              </>
            )}

            {characterId === 'jax' && (
              <>
                {/* Heavy Titanium Core Vent */}
                <rect x="76" y="110" width="24" height="24" rx="4" fill="#090d16" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="88" cy="122" r="5" fill="#f59e0b" className="animate-pulse" />
                <line x1="80" y1="122" x2="96" y2="122" stroke="#fef08a" strokeWidth="1.5" />
              </>
            )}

            {characterId === 'nyx' && (
              <>
                {/* Shinobi Sash & Kunai Sheath */}
                <path d="M64 120 L110 145" stroke="#a855f7" strokeWidth="4" />
                <rect x="94" y="125" width="10" height="20" rx="2" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
              </>
            )}

            {characterId === 'axel' && (
              <>
                {/* Flame Embers Tattoo / Vest Lines */}
                <path d="M72 108 Q88 125 76 150" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                <circle cx="88" cy="132" r="4.5" fill="#ea580c" className="animate-pulse" />
              </>
            )}

            {characterId === 'yuki' && (
              <>
                {/* Neo-Kimono Lapel */}
                <path d="M72 96 L88 145 L104 96" stroke="#34d399" strokeWidth="3" fill="none" />
                <circle cx="88" cy="128" r="4" fill="#10b981" />
              </>
            )}
          </g>

          {/* Head & Face */}
          <g>
            {/* Neck */}
            <path d="M86 85 L87 100" stroke={playerVis.skinColor} strokeWidth="12" strokeLinecap="round" />

            {/* Head Base */}
            <path
              d="M74 65 Q74 52 86 50 Q98 52 100 68 Q100 80 88 82 Q76 80 74 65 Z"
              fill={playerVis.skinColor}
            />

            {/* Character Specific Hair & Headgear */}
            {characterId === 'kai' && (
              <path
                d="M72 60 Q72 34 88 32 Q105 32 108 52 L108 62 L98 62 L96 54 Q86 48 76 52 Z"
                fill="#09090b"
              />
            )}

            {characterId === 'maya' && (
              <>
                {/* Sleek Undercut with Cyan Streak */}
                <path d="M70 58 Q75 35 95 35 Q108 38 106 60 L92 56 Q80 50 70 58 Z" fill="#0f172a" />
                <path d="M78 40 L102 46" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              </>
            )}

            {characterId === 'jax' && (
              <>
                {/* Cyborg Shaved Head & Red Optic Eye */}
                <path d="M72 58 Q76 40 88 40 Q102 40 106 58 Z" fill="#18181b" />
                <circle cx="94" cy="66" r="3" fill="#ef4444" className="animate-pulse" />
                <line x1="88" y1="62" x2="98" y2="62" stroke="#71717a" strokeWidth="2" />
              </>
            )}

            {characterId === 'nyx' && (
              <>
                {/* Shinobi Cowl & Visor */}
                <path d="M70 65 Q70 38 88 36 Q106 38 106 65 L100 78 L76 78 Z" fill="#1e1b4b" />
                <rect x="80" y="62" width="22" height="6" rx="2" fill="#c084fc" />
              </>
            )}

            {characterId === 'axel' && (
              <>
                {/* Spiky Flame Hair */}
                <path d="M68 62 L78 32 L88 48 L98 28 L104 50 L108 62 Z" fill="#ea580c" />
                <path d="M76 40 L88 52 L98 38" stroke="#fde047" strokeWidth="2" />
              </>
            )}

            {characterId === 'yuki' && (
              <>
                {/* Topknot with Hair Needle */}
                <circle cx="86" cy="40" r="10" fill="#09090b" />
                <line x1="72" y1="36" x2="102" y2="44" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
              </>
            )}

            {/* Eyes & Gaze */}
            {characterId !== 'jax' && characterId !== 'nyx' && (
              <>
                <line x1="88" y1="62" x2="96" y2="62" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="94" cy="66" r="1.8" fill={action === 'type_ready' ? playerVis.sparkColor : '#09090b'} />
              </>
            )}
          </g>

          {/* Rear Guard Arm */}
          <g>
            <path
              d="M62 102 L48 128 L62 138"
              stroke={`url(#${playerVis.jacketGradId})`}
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="62" cy="138" r="8" fill={playerVis.fistColor} />
          </g>

          {/* Lead Striking Arm */}
          <g>
            {action === 'attack' ||
            action === 'punch' ||
            action === 'light_attack' ||
            action === 'combo_attack' ||
            action === 'special' ||
            action === 'special_attack' ? (
              // Straight punch extension
              <>
                <path
                  d="M108 102 L146 102 L172 102"
                  stroke={`url(#${playerVis.jacketGradId})`}
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <circle cx="174" cy="102" r="11" fill={playerVis.fistColor} />
                <line x1="130" y1="96" x2="178" y2="96" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5 3" />
                <line x1="140" y1="108" x2="174" y2="108" stroke={playerVis.sparkColor} strokeWidth="2" strokeDasharray="4 2" />
              </>
            ) : action === 'heavy_attack' || action === 'kick' ? (
              // Roundhouse counter-balance
              <>
                <path
                  d="M102 100 L75 80 L60 70"
                  stroke={`url(#${playerVis.jacketGradId})`}
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <circle cx="58" cy="68" r="9" fill={playerVis.fistColor} />
                <path d="M120 160 Q160 145 185 130" stroke={playerVis.sparkColor} strokeWidth="3.5" fill="none" opacity="0.9" />
              </>
            ) : action === 'victory' ? (
              // Raised victorious fist
              <>
                <path
                  d="M102 98 L116 65 L118 36"
                  stroke={`url(#${playerVis.jacketGradId})`}
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <circle cx="118" cy="32" r="9" fill={playerVis.fistColor} />
              </>
            ) : (
              // Ready Guard
              <>
                <path
                  d="M102 102 L128 120 L118 138"
                  stroke={`url(#${playerVis.jacketGradId})`}
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <circle cx="118" cy="138" r="9" fill={playerVis.fistColor} />
              </>
            )}
          </g>
        </svg>
      ) : (
        /* ============================================================== */
        /* ENEMY / OPPONENT FIGHTER (DYNAMIC SYNDICATE BOSS SPRITE)       */
        /* ============================================================== */
        <svg
          viewBox="0 0 180 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[105px] h-[163px] xs:w-[125px] xs:h-[194px] sm:w-[150px] sm:h-[233px] md:w-[170px] md:h-[264px] lg:w-[180px] lg:h-[280px] scale-x-[-1] drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]"
        >
          <defs>
            <linearGradient id="enemy-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={enemyVis.topColor1} />
              <stop offset="100%" stopColor={enemyVis.topColor2} />
            </linearGradient>
          </defs>

          {/* Rear Leg */}
          <g>
            <path
              d={
                action === 'kick' || action === 'heavy_attack'
                  ? 'M65 175 L50 225 L35 265'
                  : 'M65 175 L55 218 L46 265'
              }
              stroke="#1e293b"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path d="M46 265 L32 270 L54 274 Z" fill="#0f172a" />
          </g>

          {/* Lead Front Leg */}
          <g>
            <path
              d={
                action === 'kick' || action === 'heavy_attack'
                  ? 'M85 175 L135 155 L175 142'
                  : 'M85 175 L102 218 L98 265'
              }
              stroke="#0f172a"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d={
                action === 'kick' || action === 'heavy_attack'
                  ? 'M175 142 L188 136 L180 152 Z'
                  : 'M98 265 L116 270 L92 274 Z'
              }
              fill="#0f172a"
            />
          </g>

          {/* Lower Combat Skirt / Armor Belt */}
          <g>
            <path
              d="M58 152 L112 150 L118 180 L52 178 Z"
              fill={enemyVis.patternColor}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <line x1="56" y1="152" x2="114" y2="150" stroke="#0f172a" strokeWidth="4" />
          </g>

          {/* Torso */}
          <g>
            <rect x="68" y="140" width="34" height="14" fill={enemyVis.skinColor} />
            <path
              d="M58 98 L112 95 L106 142 L62 142 Z"
              fill="url(#enemy-body-grad)"
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Tank Heavy Chest Reactor Plate */}
            {enemyVis.archetype === 'Tank' && (
              <polygon
                points="76,108 94,108 100,122 85,134 70,122"
                fill="#0f766e"
                stroke="#6ee7b7"
                strokeWidth="1.5"
                opacity="0.9"
              />
            )}

            {/* Heavy Hydraulic Vent Core */}
            {enemyVis.archetype === 'Heavy' && (
              <g>
                <rect x="74" y="110" width="22" height="16" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5" />
                <line x1="77" y1="114" x2="93" y2="114" stroke="#fde047" strokeWidth="1.5" />
                <line x1="77" y1="118" x2="93" y2="118" stroke="#fde047" strokeWidth="1.5" />
                <line x1="77" y1="122" x2="93" y2="122" stroke="#fde047" strokeWidth="1.5" />
              </g>
            )}

            {/* Speedster Aerodynamic Neon Stripe */}
            {enemyVis.archetype === 'Speedster' && (
              <path d="M68 102 L85 136 L92 102" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
            )}
          </g>

          {/* Head & Hairstyle / Boss Helmet / Archetype Headgear */}
          <g>
            <path d="M85 85 L85 100" stroke={enemyVis.skinColor} strokeWidth="11" strokeLinecap="round" />
            <circle cx="86" cy="68" r="16" fill={enemyVis.skinColor} />

            {/* Archetype Specific Head Decor */}
            {enemyVis.archetype === 'Boss' ? (
              <>
                {/* Overlord Zero Crown */}
                <path d="M70 54 L78 30 L86 45 L94 30 L102 54 Z" fill="#f43f5e" stroke="#fda4af" strokeWidth="1.5" />
                <rect x="80" y="64" width="16" height="5" rx="1.5" fill="#fda4af" />
              </>
            ) : enemyVis.archetype === 'Tank' ? (
              <>
                {/* Armored Heavy Helmet */}
                <rect x="73" y="52" width="26" height="25" rx="4" fill="#0f766e" stroke="#6ee7b7" strokeWidth="1.5" />
                <rect x="79" y="64" width="18" height="5" rx="1" fill="#14b8a6" />
                <line x1="73" y1="58" x2="99" y2="58" stroke="#6ee7b7" strokeWidth="1" />
              </>
            ) : enemyVis.archetype === 'Heavy' ? (
              <>
                {/* Brutal Cybernetic Mohawk & Brow Armor */}
                <path d="M82 36 L90 36 L90 54 L82 54 Z" fill="#ea580c" />
                <rect x="75" y="54" width="22" height="7" rx="1" fill="#7c2d12" stroke="#f59e0b" strokeWidth="1" />
              </>
            ) : enemyVis.archetype === 'Speedster' ? (
              <>
                {/* Aerodynamic Dual Ear Fins & Sleek Visor */}
                <polygon points="68,54 74,38 78,54" fill="#0891b2" />
                <polygon points="94,54 98,38 104,54" fill="#0891b2" />
                <rect x="78" y="62" width="20" height="6" rx="2" fill="#06b6d4" stroke="#e0f2fe" strokeWidth="1" />
              </>
            ) : enemyVis.archetype === 'Assassin' ? (
              <>
                {/* Shadow Ninja Cowl & Purple Monocle */}
                <path d="M72 52 Q86 44 100 52 L98 76 L74 76 Z" fill="#2e1065" stroke="#7e22ce" strokeWidth="1.5" />
                <circle cx="94" cy="67" r="3.5" fill="#c084fc" />
                <circle cx="94" cy="67" r="1.5" fill="#ffffff" />
              </>
            ) : (
              <>
                {/* Brawler Topknot Bun */}
                <circle cx="80" cy="40" r="12" fill="#09090b" />
                <path d="M72 65 Q72 48 86 48 Q100 48 102 65 L98 68 L88 56 L76 68 Z" fill="#09090b" />
              </>
            )}

            {/* Eyes (if not covered by full faceplate) */}
            {enemyVis.archetype !== 'Assassin' && enemyVis.archetype !== 'Speedster' && enemyVis.archetype !== 'Tank' && (
              <circle cx="94" cy="68" r="1.8" fill={isTelegraphing ? '#ef4444' : enemyVis.maskColor} />
            )}
          </g>

          {/* Rear Arm */}
          <g>
            <path d="M62 102 L48 126 L60 138" stroke="url(#enemy-body-grad)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="60" cy="138" r="7" fill={enemyVis.skinColor} />
          </g>

          {/* Lead Front Arm */}
          <g>
            {action === 'attack' ||
            action === 'punch' ||
            action === 'light_attack' ||
            action === 'special' ||
            action === 'special_attack' ? (
              <>
                <path d="M105 100 L145 100 L172 100" stroke="url(#enemy-body-grad)" strokeWidth="14" strokeLinecap="round" />
                <circle cx="174" cy="100" r="8" fill={enemyVis.glow} />
                <line x1="140" y1="94" x2="178" y2="94" stroke={enemyVis.glow} strokeWidth="2.5" strokeDasharray="4 2" />
              </>
            ) : isTelegraphing ? (
              <>
                <path d="M102 102 L80 88 L65 78" stroke="url(#enemy-body-grad)" strokeWidth="14" strokeLinecap="round" />
                <circle cx="65" cy="78" r="8" fill={enemyVis.skinColor} />
                <circle cx="65" cy="78" r="12" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />
              </>
            ) : (
              <>
                <path d="M102 102 L124 118 L114 136" stroke="url(#enemy-body-grad)" strokeWidth="14" strokeLinecap="round" />
                <circle cx="114" cy="136" r="8" fill={enemyVis.skinColor} />
              </>
            )}
          </g>
        </svg>
      )}
    </div>
  );
};
