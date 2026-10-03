import React, { useState, useEffect, useRef } from 'react';
import { GameMode, CharacterConfig, EnemyArchetype } from '../../types/game';
import { sounds } from '../../audio/soundManager';
import {
  Play,
  Flame,
  Timer,
  Infinity as InfinityIcon,
  HelpCircle,
  Settings as SettingsIcon,
  Trophy,
  Swords,
  Volume2,
  VolumeX,
  Zap,
  ChevronRight,
  Shield,
  UserCheck,
  Dices,
} from 'lucide-react';

interface MainMenuProps {
  campaignLevel: number;
  selectedCharacter: CharacterConfig;
  onSelectCharacterClick: () => void;
  onStartMode: (mode: GameMode, preferredArchetype?: EnemyArchetype) => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenHighScores: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

interface ModeOption {
  id: GameMode;
  name: string;
  tag: string;
  desc: string;
  icon: React.ElementType;
  badgeColor: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  campaignLevel,
  selectedCharacter,
  onSelectCharacterClick,
  onStartMode,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenHighScores,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('quick');

  const modes: ModeOption[] = [
    {
      id: 'quick',
      name: 'QUICK BRAWL',
      tag: 'INSTANT 1V1',
      desc: 'Fight a rival street combatant right now',
      icon: Swords,
      badgeColor: 'border-cyan-400/50 text-cyan-300',
    },
    {
      id: 'campaign',
      name: 'CAMPAIGN',
      tag: `BOSS 0${campaignLevel}/05`,
      desc: 'Climb the ranks through 5 cyber syndicate bosses',
      icon: Flame,
      badgeColor: 'border-fuchsia-400/50 text-fuchsia-300',
    },
    {
      id: 'time_attack',
      name: 'TIME ATTACK',
      tag: '60 SECONDS',
      desc: 'Speed blitz — score maximum damage before time expires',
      icon: Timer,
      badgeColor: 'border-amber-400/50 text-amber-300',
    },
    {
      id: 'endless',
      name: 'ENDLESS',
      tag: 'INFINITE WAVES',
      desc: 'Survive consecutive rounds against ramping opponents',
      icon: InfinityIcon,
      badgeColor: 'border-purple-400/50 text-purple-300',
    },
  ];

  // Keep stable refs for keyboard navigation
  const onStartModeRef = useRef(onStartMode);
  onStartModeRef.current = onStartMode;

  const onSelectCharacterClickRef = useRef(onSelectCharacterClick);
  onSelectCharacterClickRef.current = onSelectCharacterClick;

  const selectedModeRef = useRef(selectedMode);
  selectedModeRef.current = selectedMode;

  const modesRef = useRef(modes);
  modesRef.current = modes;

  // Keyboard navigation on title screen: Enter / Space to start, Arrow keys to navigate modes, C/F for characters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sounds.playMenuClick();
        onStartModeRef.current(selectedModeRef.current);
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        sounds.playMenuClick();
        onSelectCharacterClickRef.current();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sounds.playMenuHover();
        const currentList = modesRef.current;
        const currentIndex = currentList.findIndex((m: ModeOption) => m.id === selectedModeRef.current);
        const nextIndex = (currentIndex + 1) % currentList.length;
        setSelectedMode(currentList[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sounds.playMenuHover();
        const currentList = modesRef.current;
        const currentIndex = currentList.findIndex((m: ModeOption) => m.id === selectedModeRef.current);
        const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
        setSelectedMode(currentList[prevIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStart = (mode: GameMode = selectedMode) => {
    sounds.playMenuClick();
    onStartMode(mode);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-950 flex flex-col justify-between">
      {/* ============================================================== */}
      {/* LAYER 1: CINEMATIC MULTI-LAYER ARENA BACKGROUND                 */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Arena backdrop image */}
        <img
          src="/src/assets/images/cyber_arena_bg_1790533290965.jpg"
          alt="Cyber Arena Title Screen"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
        />

        {/* Deep cinematic gradient scrim: Dark on left for UI readability, atmospheric on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

        {/* Subtle grid mesh overlay for high-tech arcade finish */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Floating atmospheric embers & neon glare */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-fuchsia-600/15 blur-[120px] pointer-events-none animate-pulse" />

        {/* Drifting embers */}
        <div className="absolute top-16 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-60" />
        <div className="absolute bottom-32 left-1/2 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-50" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-fuchsia-400 rounded-full animate-ping opacity-70" />
      </div>

      {/* ============================================================== */}
      {/* TOP HEADER: COMPACT LOGO (LEFT) | AUDIO & SETTINGS (RIGHT)     */}
      {/* ============================================================== */}
      <header className="relative z-30 w-full px-4 sm:px-6 md:px-10 py-3.5 flex items-center justify-between pointer-events-auto">
        {/* Compact Arcade Brand Emblem */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center"
            style={{ clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)' }}
          >
            <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
              <Swords className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-base sm:text-lg font-black tracking-wider text-white uppercase"
                style={{ fontFamily: "'Chakra Petch', sans-serif" }}
              >
                TYPING <span className="text-cyan-400">FIGHTER</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-widest hidden sm:inline">
                ARCADE 2D
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          {onToggleSound && (
            <button
              onClick={() => {
                sounds.playMenuClick();
                onToggleSound();
              }}
              onMouseEnter={() => sounds.playMenuHover()}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          )}

          {/* High Scores Button */}
          <button
            onClick={() => {
              sounds.playMenuClick();
              onOpenHighScores();
            }}
            onMouseEnter={() => sounds.playMenuHover()}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-yellow-400 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95"
            title="High Scores / Leaderboard"
            aria-label="High Scores"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* How to Play Button */}
          <button
            onClick={() => {
              sounds.playMenuClick();
              onOpenHowToPlay();
            }}
            onMouseEnter={() => sounds.playMenuHover()}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95"
            title="How to Play"
            aria-label="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              sounds.playMenuClick();
              onOpenSettings();
            }}
            onMouseEnter={() => sounds.playMenuHover()}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-fuchsia-400 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95"
            title="Game Settings"
            aria-label="Game Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN VIEWPORT: LEFT ARCADE MENU & RIGHT HERO FIGHTER ARTWORK  */}
      {/* ============================================================== */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between z-20 overflow-hidden">
        {/* ============================================================ */}
        {/* LEFT COLUMN: TITLE, CTA, AND ARCADE MODE SELECTOR           */}
        {/* ============================================================ */}
        <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-start justify-center py-2 z-20">
          {/* Genre Tag */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2 rounded bg-slate-900/90 border border-cyan-500/40 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Zap className="w-3 h-3 text-cyan-400 fill-current" />
            <span>REAL-TIME COMBAT TYPING ENGINE</span>
          </div>

          {/* Game Title: Compact & Premium Arcade Aesthetic */}
          <div className="mb-2">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.92] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              TYPING
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                FIGHTER
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-2 text-xs sm:text-sm font-mono font-black tracking-[0.22em] text-slate-300 flex items-center gap-2">
              <span className="text-cyan-400">TYPE FAST.</span>
              <span className="text-fuchsia-400">FIGHT HARD.</span>
            </p>
          </div>

          {/* Primary CTA: Premium Game-style Start Control */}
          <div className="w-full max-w-sm mt-3 mb-3">
            <button
              onClick={() => handleStart(selectedMode)}
              onMouseEnter={() => sounds.playMenuHover()}
              className="group relative w-full py-3.5 px-5 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-slate-950 font-black text-lg sm:text-xl uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between cursor-pointer border border-cyan-300/60"
              style={{
                fontFamily: "'Chakra Petch', sans-serif",
                clipPath: 'polygon(0% 0%, 96% 0%, 100% 30%, 100% 100%, 4% 100%, 0% 70%)',
              }}
            >
              <div className="flex items-center gap-2.5 text-slate-950">
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                <span>START FIGHT</span>
              </div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-950/90 bg-white/40 px-2 py-0.5 rounded">
                ENTER ↵
              </span>
            </button>
          </div>

          {/* Active Character Showcase Card & Select Button */}
          <div className="w-full max-w-sm mb-3.5 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-11 h-11 rounded-lg overflow-hidden border-2 bg-slate-950 shrink-0 shadow-md"
                style={{ borderColor: selectedCharacter.colorTheme.primary }}
              >
                <img
                  src={selectedCharacter.portrait}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/hero_fighter_art_1790533263676.jpg';
                  }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    FIGHTER
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">
                    {selectedCharacter.maxHp} HP
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 font-bold">
                    {Math.round(selectedCharacter.damageMultiplier * 100)}% ATK
                  </span>
                </div>
                <span
                  className="text-xs sm:text-sm font-black uppercase tracking-wider text-white truncate"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                >
                  {selectedCharacter.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate">
                  {selectedCharacter.archetype} · {selectedCharacter.perk.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playMenuClick();
                onSelectCharacterClick();
              }}
              onMouseEnter={() => sounds.playMenuHover()}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 hover:border-cyan-300 text-cyan-300 hover:text-white text-[11px] font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer shrink-0 active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>ROSTER</span>
            </button>
          </div>

          {/* Compact Arcade Mode Selector */}
          <div className="w-full max-w-sm flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 mb-0.5 uppercase tracking-wider">
              <span>SELECT GAME MODE</span>
              <span className="text-slate-500">▲▼ OR CLICK</span>
            </div>

            {modes.map((m) => {
              const isSelected = selectedMode === m.id;
              const Icon = m.icon;

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sounds.playMenuClick();
                    setSelectedMode(m.id);
                  }}
                  onDoubleClick={() => handleStart(m.id)}
                  onMouseEnter={() => sounds.playMenuHover()}
                  className={`group relative w-full px-3 py-2 rounded-md transition-all duration-150 flex items-center justify-between text-left cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] translate-x-1'
                      : 'bg-slate-950/70 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-xs font-mono font-black ${
                        isSelected ? 'text-cyan-400 animate-pulse' : 'text-slate-600'
                      }`}
                    >
                      {isSelected ? '▶' : '·'}
                    </span>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <div className="flex flex-col truncate">
                      <span
                        className={`text-xs sm:text-sm font-black uppercase tracking-wider truncate ${
                          isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                        style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                      >
                        {m.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 truncate leading-tight">
                        {m.desc}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${m.badgeColor}`}
                  >
                    {m.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CENTER/RIGHT: LARGE DYNAMIC HERO FIGHTER ARTWORK (~40% SCREEN) */}
        {/* ============================================================ */}
        <div className="hidden md:flex md:w-1/2 lg:w-7/12 h-full items-end justify-center relative pb-2">
          {/* Ground Contact Shadow */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 lg:w-96 h-10 bg-black/80 rounded-full blur-xl z-10 pointer-events-none" />

          {/* Neon Ground Reflection beneath boots */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-64 h-8 rounded-full blur-lg z-10 opacity-60 pointer-events-none"
            style={{ backgroundColor: selectedCharacter.colorTheme.primary }}
          />

          {/* Hero Fighter Art Container */}
          <div className="relative z-20 flex flex-col items-center max-h-[82vh]">
            {/* Fighter Tactical HUD Tag */}
            <div className="absolute top-6 right-4 lg:right-12 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] pointer-events-auto">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: selectedCharacter.colorTheme.primary }}
              />
              <div className="flex flex-col text-left">
                <span
                  className="text-xs sm:text-sm font-black tracking-widest text-white uppercase"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                >
                  {selectedCharacter.name} // {selectedCharacter.title}
                </span>
                <span className="text-[10px] font-mono text-cyan-300">
                  {selectedCharacter.archetype} · {selectedCharacter.maxHp} HP · {selectedCharacter.country}
                </span>
              </div>

              <button
                onClick={() => {
                  sounds.playMenuClick();
                  onSelectCharacterClick();
                }}
                className="ml-2 px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold tracking-wider cursor-pointer transition-all active:scale-95"
              >
                SWITCH
              </button>
            </div>

            {/* Fighter Full-Body Illustration with Interactive Hover */}
            <div
              onClick={() => {
                sounds.playMenuClick();
                onSelectCharacterClick();
              }}
              className="relative cursor-pointer group pointer-events-auto"
              title="Click to Switch Fighter"
            >
              <img
                src={selectedCharacter.portrait}
                alt={selectedCharacter.name}
                className="h-[68vh] lg:h-[76vh] w-auto object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] animate-[boxer-bounce_3.2s_ease-in-out_infinite] group-hover:brightness-110 transition-all"
                style={{
                  filter: `drop-shadow(0 0 25px ${selectedCharacter.colorTheme.glow})`,
                }}
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/hero_fighter_art_1790533263676.jpg';
                }}
              />

              {/* Click-to-switch prompt badge on hover */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold whitespace-nowrap shadow-lg">
                CLICK TO CHOOSE FIGHTER
              </div>
            </div>

            {/* Dynamic Rim Lighting Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none h-24 bottom-0 z-30" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM FOOTER STATUS STRIP                                      */}
      {/* ============================================================== */}
      <footer className="relative z-30 w-full px-4 sm:px-6 md:px-10 py-2.5 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-400 pointer-events-auto">
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-bold">SYSTEM READY</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">TYPE TO STRIKE</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden md:inline">[SPACE] UNLEASH SPECIAL</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">[C] CHOOSE FIGHTER</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-slate-500">TYPING FIGHTER 2026</span>
          <span className="text-cyan-400 font-bold">60 FPS</span>
        </div>
      </footer>
    </div>
  );
};
