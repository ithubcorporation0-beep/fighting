import React, { useState, useEffect, useRef } from 'react';
import { CharacterConfig } from '../../types/game';
import { PLAYABLE_CHARACTERS } from '../../data/characters';
import { sounds } from '../../audio/soundManager';
import { RealisticFighter } from '../fighters/RealisticFighter';
import {
  Zap,
  Shield,
  Flame,
  Target,
  Timer,
  Heart,
  ChevronRight,
  Check,
  Sparkles,
  HelpCircle,
  X,
  Swords,
  Volume2,
} from 'lucide-react';

interface CharacterSelectModalProps {
  selectedCharacterId: string;
  onSelectCharacter: (charId: string) => void;
  onClose: () => void;
  onStartGame?: () => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  selectedCharacterId,
  onSelectCharacter,
  onClose,
  onStartGame,
}) => {
  const [hoveredId, setHoveredId] = useState<string>(selectedCharacterId);
  const [testAction, setTestAction] = useState<'idle' | 'punch' | 'kick' | 'special'>('idle');
  const [justLockedIn, setJustLockedIn] = useState<boolean>(false);

  const activeChar: CharacterConfig =
    PLAYABLE_CHARACTERS.find((c) => c.id === hoveredId) || PLAYABLE_CHARACTERS[0];

  const isCurrentSelection = selectedCharacterId === activeChar.id;

  // Stable references for keyboard events
  const onSelectRef = useRef(onSelectCharacter);
  onSelectRef.current = onSelectCharacter;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const hoveredIdRef = useRef(hoveredId);
  hoveredIdRef.current = hoveredId;

  // Keyboard navigation: Left/Right to browse, Enter to lock in, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        sounds.playMenuClick();
        onCloseRef.current();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIdx = PLAYABLE_CHARACTERS.findIndex((c) => c.id === hoveredIdRef.current);
        const nextIdx = (currentIdx + 1) % PLAYABLE_CHARACTERS.length;
        setHoveredId(PLAYABLE_CHARACTERS[nextIdx].id);
        sounds.playCharacterSelect();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIdx = PLAYABLE_CHARACTERS.findIndex((c) => c.id === hoveredIdRef.current);
        const prevIdx = (currentIdx - 1 + PLAYABLE_CHARACTERS.length) % PLAYABLE_CHARACTERS.length;
        setHoveredId(PLAYABLE_CHARACTERS[prevIdx].id);
        sounds.playCharacterSelect();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLockIn(hoveredIdRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLockIn = (id: string) => {
    sounds.playCharacterConfirm();
    onSelectCharacter(id);
    setJustLockedIn(true);
    setTimeout(() => {
      setJustLockedIn(false);
      if (onStartGame) {
        onStartGame();
      } else {
        onClose();
      }
    }, 600);
  };

  const handleRandomSelect = () => {
    sounds.playCharacterSelect();
    const otherChars = PLAYABLE_CHARACTERS.filter((c) => c.id !== hoveredId);
    const randomPick = otherChars[Math.floor(Math.random() * otherChars.length)];
    setHoveredId(randomPick.id);
  };

  const triggerTestStrike = () => {
    sounds.playPunch();
    setTestAction('punch');
    setTimeout(() => setTestAction('idle'), 250);
  };

  const getPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="w-4 h-4 text-amber-400" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'target':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'timer':
        return <Timer className="w-4 h-4 text-emerald-400" />;
      default:
        return <Heart className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/95 backdrop-blur-md select-none overflow-y-auto animate-[fadeIn_0.18s_ease-out]">
      {/* Background Stage Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/arcade_char_select_bg_1790582804466.jpg"
          alt="Arcade Character Select Arena"
          className="w-full h-full object-cover object-center filter brightness-60 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Main Arcade Character Select Frame */}
      <div className="relative w-full max-w-6xl max-h-[96vh] rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10">
        {/* Top Header Bar */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-indigo-600 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              style={{ clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)' }}
            >
              <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
                <Swords className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg sm:text-2xl font-black uppercase tracking-wider text-white"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                >
                  SELECT <span className="text-cyan-400">YOUR FIGHTER</span>
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  ROSTER: 06 FIGHTERS
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                CHOOSE YOUR WARRIOR · EACH FIGHTER POSSESSES UNIQUE HP, DAMAGE MULTIPLIER & PASSIVE COMBAT PERK
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playMenuClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            aria-label="Close Character Select"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Left Roster Grid | Right Live Fighter Showcase */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* ============================================================ */}
          {/* LEFT: ARCADE CHARACTER ROSTER GRID                           */}
          {/* ============================================================ */}
          <div className="w-full lg:w-5/12 p-3 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950/70 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span>WARRIORS ROSTER</span>
                <span className="text-slate-500">CLICK OR ARROWS</span>
              </div>

              {/* 2x3 Grid of Character Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {PLAYABLE_CHARACTERS.map((char) => {
                  const isHovered = hoveredId === char.id;
                  const isEquipped = selectedCharacterId === char.id;

                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        sounds.playCharacterSelect();
                        setHoveredId(char.id);
                      }}
                      onDoubleClick={() => handleLockIn(char.id)}
                      onMouseEnter={() => {
                        if (hoveredId !== char.id) {
                          sounds.playMenuHover();
                          setHoveredId(char.id);
                        }
                      }}
                      className={`group relative rounded-xl overflow-hidden transition-all duration-150 p-1 flex flex-col items-center cursor-pointer border-2 text-left ${
                        isHovered
                          ? 'border-cyan-400 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.45)] scale-[1.03] z-10'
                          : isEquipped
                          ? 'border-emerald-500/80 bg-slate-900/80'
                          : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Character Avatar Thumbnail */}
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900">
                        <img
                          src={char.portrait}
                          alt={char.name}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/src/assets/images/hero_fighter_art_1790533263676.jpg';
                          }}
                        />

                        {/* Top Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                        {/* Active Equipped Checkmark Tag */}
                        {isEquipped && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-mono font-black flex items-center gap-0.5 shadow-md">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span>EQUIPPED</span>
                          </div>
                        )}

                        {/* HP Badge */}
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-slate-200 text-[9px] font-mono font-bold">
                          {char.maxHp} HP
                        </div>
                      </div>

                      {/* Character Label Details */}
                      <div className="w-full mt-1.5 px-1 pb-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs sm:text-sm font-black uppercase tracking-wider ${
                              isHovered ? 'text-cyan-300' : 'text-white'
                            }`}
                            style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                          >
                            {char.name}
                          </span>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: char.colorTheme.primary }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 truncate">
                          {char.archetype}
                        </span>
                      </div>

                      {/* Cursor Glow Border pulse when selected */}
                      {isHovered && (
                        <div className="absolute inset-0 border-2 border-cyan-400 rounded-xl pointer-events-none animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Random Select + Navigation Controls */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={handleRandomSelect}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>RANDOM SELECT (?)</span>
              </button>

              <div className="text-[10px] font-mono text-slate-500 hidden sm:block">
                [ENTER] TO LOCK IN
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: LIVE FIGHTER INSPECTION & STATS SHOWCASE              */}
          {/* ============================================================ */}
          <div className="w-full lg:w-7/12 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto bg-slate-900/60">
            {/* Fighter Spotlight Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded tracking-widest text-slate-950 uppercase"
                      style={{ backgroundColor: activeChar.colorTheme.primary }}
                    >
                      {activeChar.country}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      // {activeChar.archetype}
                    </span>
                  </div>

                  <h3
                    className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3"
                    style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                  >
                    <span>{activeChar.name}</span>
                    <span className="text-sm sm:text-base font-normal text-slate-400 font-mono tracking-widest">
                      "{activeChar.title}"
                    </span>
                  </h3>
                </div>

                {/* HP & Damage Multiplier Metric */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700 flex flex-col text-right">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">BASE HEALTH</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {activeChar.maxHp} HP
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700 flex flex-col text-right">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">ATK POWER</span>
                    <span className="text-base font-black text-cyan-400 font-mono">
                      {Math.round(activeChar.damageMultiplier * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Panel: Full Artwork / Animated Fighter Sprite Preview + Bio */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center">
                {/* Visual Artwork & Live Animated Stance */}
                <div className="md:col-span-5 flex flex-col items-center justify-center relative p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  {/* Subtle rim aura */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-20 blur-xl pointer-events-none"
                    style={{ backgroundColor: activeChar.colorTheme.primary }}
                  />

                  {/* Fighter Live Animated Stance */}
                  <div className="relative py-2 z-10 flex items-center justify-center">
                    <RealisticFighter
                      type="player"
                      action={testAction}
                      reducedMotion={false}
                    />
                  </div>

                  {/* Test Attack Strike Button */}
                  <button
                    onClick={triggerTestStrike}
                    className="mt-2 text-[10px] font-mono font-bold text-cyan-300 hover:text-white px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>TEST ATTACK STRIKE</span>
                  </button>
                </div>

                {/* Tactical Stats & Combat Profile */}
                <div className="md:col-span-7 flex flex-col gap-3">
                  {/* Stats Gauges (Power, Speed, Defense, Special) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      COMBAT CAPABILITIES
                    </span>

                    {/* Stat Row: Power */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold w-18">POWER</span>
                      <div className="flex-1 mx-2 flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((seg) => (
                          <div
                            key={seg}
                            className={`flex-1 rounded-sm ${
                              seg <= activeChar.stats.power
                                ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-rose-400 font-bold">{activeChar.stats.power}/5</span>
                    </div>

                    {/* Stat Row: Speed */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold w-18">SPEED</span>
                      <div className="flex-1 mx-2 flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((seg) => (
                          <div
                            key={seg}
                            className={`flex-1 rounded-sm ${
                              seg <= activeChar.stats.speed
                                ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.7)]'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-cyan-400 font-bold">{activeChar.stats.speed}/5</span>
                    </div>

                    {/* Stat Row: Defense */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold w-18">DEFENSE</span>
                      <div className="flex-1 mx-2 flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((seg) => (
                          <div
                            key={seg}
                            className={`flex-1 rounded-sm ${
                              seg <= activeChar.stats.defense
                                ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.7)]'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-amber-400 font-bold">{activeChar.stats.defense}/5</span>
                    </div>

                    {/* Stat Row: Special */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold w-18">SPECIAL</span>
                      <div className="flex-1 mx-2 flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((seg) => (
                          <div
                            key={seg}
                            className={`flex-1 rounded-sm ${
                              seg <= activeChar.stats.special
                                ? 'bg-fuchsia-400 shadow-[0_0_6px_rgba(217,70,239,0.7)]'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-fuchsia-400 font-bold">{activeChar.stats.special}/5</span>
                    </div>
                  </div>

                  {/* Signature Perk Banner */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 shrink-0">
                      {getPerkIcon(activeChar.perk.iconName)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-cyan-300 font-black uppercase">
                          PASSIVE PERK:
                        </span>
                        <span className="text-xs font-bold text-white uppercase">
                          {activeChar.perk.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        {activeChar.perk.desc}
                      </p>
                    </div>
                  </div>

                  {/* Signature Special Move */}
                  <div className="p-2.5 rounded-lg bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest block">
                        SIGNATURE ULTIMATE
                      </span>
                      <span
                        className="text-xs font-black uppercase text-white"
                        style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                      >
                        {activeChar.specialMove.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                      {activeChar.specialMove.inputHint}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flavor Battle Quote */}
              <div className="p-2.5 rounded-lg bg-slate-950/50 border-l-2 border-cyan-400 italic text-xs text-slate-300 font-mono">
                "{activeChar.flavorQuote}"
              </div>
            </div>

            {/* Bottom Primary Action: Lock In Fighter Button */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">STATUS:</span>
                {isCurrentSelection ? (
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    CURRENTLY EQUIPPED
                  </span>
                ) : (
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    READY TO LOCK IN
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playMenuClick();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  CANCEL
                </button>

                <button
                  onClick={() => handleLockIn(activeChar.id)}
                  disabled={justLockedIn}
                  className={`relative px-6 py-3 rounded-lg text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-lg transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer ${
                    justLockedIn
                      ? 'bg-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)]'
                      : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  }`}
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                >
                  {justLockedIn ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>FIGHTER LOCKED IN!</span>
                    </>
                  ) : (
                    <>
                      <Swords className="w-4 h-4 fill-current" />
                      <span>{isCurrentSelection ? 'CONFIRM FIGHTER' : `CHOOSE ${activeChar.name}`}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
