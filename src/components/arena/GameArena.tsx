import React, { useEffect, useRef } from 'react';
import { EnemyConfig, FighterAction, FloatingDamage, HitEffect, ScreenShakeType } from '../../types/game';
import { RealisticFighter } from '../fighters/RealisticFighter';
import { CombatFX } from '../fighters/CombatFX';

interface GameArenaProps {
  playerAction: FighterAction;
  characterId?: string;
  enemy: EnemyConfig;
  enemyAction: FighterAction;
  screenShake: ScreenShakeType | boolean;
  screenFlash: boolean;
  floatingDamages: FloatingDamage[];
  hitEffects: HitEffect[];
  comboMessage: string;
  reducedMotion?: boolean;
  isEnemyTelegraphing?: boolean;
  isPlayerInvulnerable?: boolean;
}

export const GameArena: React.FC<GameArenaProps> = ({
  playerAction,
  characterId = 'kai',
  enemy,
  enemyAction,
  screenShake,
  screenFlash,
  floatingDamages,
  hitEffects,
  comboMessage,
  reducedMotion = false,
  isEnemyTelegraphing = false,
  isPlayerInvulnerable = false,
}) => {
  // Parallax layer references for high-performance direct transform manipulation
  const bgFarRef = useRef<HTMLImageElement>(null);
  const bgMidRef = useRef<HTMLDivElement>(null);
  const bgNearRef = useRef<HTMLDivElement>(null);

  const targetPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Parallax animation loop running via requestAnimationFrame
  useEffect(() => {
    // Only execute when reducedMotion is false
    if (reducedMotion) {
      if (bgFarRef.current) bgFarRef.current.style.transform = 'none';
      if (bgMidRef.current) bgMidRef.current.style.transform = 'none';
      if (bgNearRef.current) bgNearRef.current.style.transform = 'none';
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from center [-1, 1]
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetPosRef.current = {
        x: Math.max(-1, Math.min(1, normX)),
        y: Math.max(-1, Math.min(1, normY)),
      };
    };

    const updateParallax = () => {
      // Smooth interpolation (lerp) towards target mouse position
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.08;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.08;

      const { x, y } = currentPosRef.current;

      // Layer 1: Far background image (subtle counter-shift + slight scale to prevent edge clipping)
      if (bgFarRef.current) {
        bgFarRef.current.style.transform = `translate3d(${-x * 10}px, ${-y * 6}px, 0) scale(1.05)`;
      }

      // Layer 2: Midground lighting, mesh, and neon haze (medium counter-shift)
      if (bgMidRef.current) {
        bgMidRef.current.style.transform = `translate3d(${-x * 18}px, ${-y * 10}px, 0)`;
      }

      // Layer 3: Foreground drifting cyber dust particles (greater depth separation)
      if (bgNearRef.current) {
        bgNearRef.current.style.transform = `translate3d(${-x * 28}px, ${-y * 16}px, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafIdRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (bgFarRef.current) bgFarRef.current.style.transform = 'none';
      if (bgMidRef.current) bgMidRef.current.style.transform = 'none';
      if (bgNearRef.current) bgNearRef.current.style.transform = 'none';
    };
  }, [reducedMotion]);

  // Determine shake animation class based on intensity
  const getShakeClass = () => {
    if (reducedMotion || screenShake === 'none' || screenShake === false) return '';
    if (screenShake === 'special') return 'animate-[shake_0.36s_ease-in-out_2] scale-[1.01]';
    if (screenShake === 'heavy') return 'animate-[shake_0.24s_ease-in-out_2]';
    return 'animate-[shake_0.16s_ease-in-out]';
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-end overflow-hidden select-none transition-transform duration-75 ${getShakeClass()}`}
    >
      {/* ============================================================== */}
      {/* MULTI-LAYER URBAN ENVIRONMENT WITH PARALLAX DEPTH               */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: Far Backdrop Urban Cyber Arena (Scale 1.05 to prevent edge bleed) */}
        <img
          ref={bgFarRef}
          src="/src/assets/images/cyber_arena_bg_1790533290965.jpg"
          alt="Cyber Street Fighting Arena Stage"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105 will-change-transform"
          style={{ transformOrigin: 'center center' }}
          onError={(e) => {
            e.currentTarget.src = '/src/assets/images/urban_alley_street_1790532568505.jpg';
          }}
        />

        {/* Layer 2: Atmospheric Twilight Purple Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-indigo-950/30 to-purple-950/40 mix-blend-multiply pointer-events-none" />

        {/* Layer 3: Midground Moving Atmospheric Light & Industrial Mesh (Parallax Mid) */}
        <div
          ref={bgMidRef}
          className="absolute inset-0 pointer-events-none will-change-transform"
        >
          {/* Neon Glare Pulses */}
          <div className="absolute top-1/6 left-1/3 w-80 h-80 rounded-full bg-purple-600/15 blur-[80px] animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-cyan-600/15 blur-[80px] animate-pulse" />

          {/* Chainlink industrial mesh overlay */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px]" />
        </div>

        {/* Layer 4: Foreground Subtle Drifting Cyber Dust / Sparks (Parallax Near) */}
        {!reducedMotion && (
          <div
            ref={bgNearRef}
            className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform"
          >
            <div className="absolute bottom-28 left-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-60" />
            <div className="absolute bottom-36 right-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce opacity-40" />
            <div className="absolute bottom-24 right-1/5 w-1 h-1 bg-fuchsia-300 rounded-full animate-ping opacity-50" />
            <div className="absolute top-1/3 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40" />
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3D PERSPECTIVE FIGHTING GROUND PLATFORM                        */}
      {/* ============================================================== */}
      <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-52 md:h-60 pointer-events-none select-none z-10 overflow-hidden">
        {/* Perspective Plane Container */}
        <div
          className="w-full h-full relative"
          style={{
            perspective: '750px',
            perspectiveOrigin: '50% 100%',
          }}
        >
          {/* Perspective Ground Surface (Trapezoidal 3D Floor) */}
          <div
            className="w-full h-full origin-bottom"
            style={{
              transform: 'rotateX(52deg)',
              background:
                'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(2, 6, 23, 1) 100%)',
            }}
          >
            {/* Perspective Industrial Grid Overlay */}
            <div className="w-full h-full opacity-35 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] [background-size:44px_30px]" />

            {/* Wet Street Reflections (Cyan, Magenta & Red Sheen) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(6,182,212,0.25)_0%,rgba(217,70,239,0.18)_40%,transparent_80%)]" />
          </div>

          {/* Horizon Line (Separates City Skyline from Ground Platform) */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.9),0_0_6px_#38bdf8]" />
          <div className="absolute top-[2px] left-0 right-0 h-8 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none" />

          {/* Stage Base Curb Line (Separates Fighting Ground from Typing Area below) */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-800 via-cyan-500/50 to-slate-800" />
        </div>

        {/* Ambient Ground Lighting Pool beneath Fighters */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[420px] sm:w-[500px] md:w-[600px] h-12 bg-gradient-to-r from-rose-500/20 via-cyan-400/25 to-purple-600/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Screen Hit Flash Overlay */}
      {screenFlash && !reducedMotion && (
        <div className="absolute inset-0 bg-white/20 pointer-events-none z-30 animate-[ping_0.12s_ease-out_forwards]" />
      )}

      {/* Combat Visual Effects (Damage numbers, hit sparks, combo banner) */}
      <CombatFX
        floatingDamages={floatingDamages}
        hitEffects={hitEffects}
        comboMessage={comboMessage}
      />

      {/* ============================================================== */}
      {/* FIGHTERS STAGE (Grounded ON the Fighting Floor)                */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-4xl mx-auto flex items-end justify-center px-4 pb-8 sm:pb-10 md:pb-12 z-20">
        <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8 -space-x-2 sm:space-x-0">
          {/* PLAYER FIGHTER */}
          <div className="relative z-10 flex flex-col items-center">
            <RealisticFighter
              type="player"
              characterId={characterId}
              action={playerAction}
              reducedMotion={reducedMotion}
              isInvulnerable={isPlayerInvulnerable}
            />
          </div>

          {/* OPPONENT FIGHTER */}
          <div className="relative z-10 flex flex-col items-center">
            <RealisticFighter
              type="enemy"
              enemyId={enemy.id}
              enemyArchetype={enemy.archetype}
              action={enemyAction}
              reducedMotion={reducedMotion}
              isTelegraphing={isEnemyTelegraphing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
