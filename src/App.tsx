import React, { useState } from 'react';
import { useTypingCombat } from './hooks/useTypingCombat';
import { BattleHUD, CombatDashboard } from './components/arena/GameHUD';
import { GameArena } from './components/arena/GameArena';
import { TypingArea } from './components/arena/TypingArea';
import { VirtualKeyboard } from './components/arena/VirtualKeyboard';
import { MainMenu } from './components/modals/MainMenu';
import { PauseMenu } from './components/modals/PauseMenu';
import { GameOverModal } from './components/modals/GameOverModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { HowToPlayModal } from './components/modals/HowToPlayModal';
import { HighScoresModal } from './components/modals/HighScoresModal';
import { CharacterSelectModal } from './components/modals/CharacterSelectModal';
import { Keyboard } from 'lucide-react';

export default function App() {
  const {
    gameStatus,
    gameMode,
    level,
    wave,
    timeRemaining,
    currentWord,
    typedIndex,
    hasError,
    playerHp,
    playerMaxHp,
    playerAction,
    isPlayerInvulnerable,
    specialMeter,
    selectedCharacter,
    selectedCharacterId,
    selectCharacter,
    allCharacters,
    enemy,
    enemyHp,
    enemyMaxHp,
    enemyShieldHp,
    enemyMaxShieldHp,
    enemyAction,
    enemyAttackProgress,
    rerollEnemy,
    combo,
    liveWpm,
    liveAccuracy,
    score,
    currentRunStats,
    screenShake,
    screenFlash,
    floatingDamages,
    hitEffects,
    comboMessage,
    scoreBonusText,
    isEnemyTelegraphing,
    campaignLevel,
    settings,
    highScores,
    isNewHighScore,
    maxCampaignLevel,
    startMatch,
    handleCharacterInput,
    handleBackspace,
    triggerSpecialAttack,
    pauseGame,
    resumeGame,
    restartMatch,
    nextLevel,
    returnToMenu,
    updateSettings,
  } = useTypingCombat();

  // Modal visibility states
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showHighScores, setShowHighScores] = useState<boolean>(false);
  const [showCharacterSelect, setShowCharacterSelect] = useState<boolean>(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState<boolean>(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768);
  });

  const isSpecialReady = specialMeter >= 100;

  return (
    <div className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between select-none selection:bg-cyan-500 selection:text-black">
      {/* ============================================================== */}
      {/* 1. TITLE SCREEN (Cinematic Fullscreen Arcade Main Menu)        */}
      {/* ============================================================== */}
      {gameStatus === 'menu' ? (
        <MainMenu
          campaignLevel={campaignLevel}
          selectedCharacter={selectedCharacter}
          onSelectCharacterClick={() => setShowCharacterSelect(true)}
          onStartMode={(mode) => startMatch(mode)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHighScores={() => setShowHighScores(true)}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            updateSettings({
              ...settings,
              soundEnabled: !settings.soundEnabled,
            })
          }
        />
      ) : (
        /* ============================================================== */
        /* 2. BATTLE SCREEN (Clear Vertical Composition: HUD/Arena/Ground/Input) */
        /* ============================================================== */
        <main className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-950 select-none">
          {/* ============================================================ */}
          {/* TOP BATTLE HUD (~12-14% Screen Height)                       */}
          {/* ============================================================ */}
          <div className="shrink-0 z-40 w-full">
            <BattleHUD
              playerHp={playerHp}
              playerMaxHp={playerMaxHp}
              playerName={selectedCharacter.name}
              playerTitle={selectedCharacter.title}
              playerColor={selectedCharacter.colorTheme.primary}
              enemy={enemy}
              enemyHp={enemyHp}
              enemyMaxHp={enemyMaxHp}
              enemyShieldHp={enemyShieldHp}
              enemyMaxShieldHp={enemyMaxShieldHp}
              level={level}
              combo={combo}
              enemyAttackProgress={enemyAttackProgress}
              isEnemyTelegraphing={isEnemyTelegraphing}
              isPlayerInvulnerable={isPlayerInvulnerable}
              gameMode={gameMode}
              onRerollEnemy={gameMode === 'quick' ? () => rerollEnemy() : undefined}
              onPause={pauseGame}
              onOpenSettings={() => setShowSettings(true)}
            />
          </div>

          {/* ============================================================ */}
          {/* FIGHTING ARENA (~56-60% Screen Height)                       */}
          {/* Elevated Fighters standing firmly on Perspective Floor        */}
          {/* ============================================================ */}
          <div className="flex-1 relative w-full overflow-hidden min-h-0">
            <GameArena
              playerAction={playerAction}
              characterId={selectedCharacter.id}
              enemy={enemy}
              enemyAction={enemyAction}
              screenShake={screenShake}
              screenFlash={screenFlash}
              floatingDamages={floatingDamages}
              hitEffects={hitEffects}
              comboMessage={comboMessage}
              reducedMotion={settings.reducedMotion}
              isEnemyTelegraphing={isEnemyTelegraphing}
              isPlayerInvulnerable={isPlayerInvulnerable}
            />
          </div>

          {/* ============================================================ */}
          {/* TYPING INTERFACE & COMBAT DASHBOARD (~26-30% Screen Height)  */}
          {/* Strictly BELOW the fighting ground — Zero Character Overlap   */}
          {/* ============================================================ */}
          <div className="shrink-0 z-30 w-full flex flex-col items-center justify-end pb-2 sm:pb-3 px-3 gap-1.5 sm:gap-2">
            {/* Compact Typing Area */}
            <TypingArea
              currentWord={currentWord}
              typedIndex={typedIndex}
              hasError={hasError}
              onCharacterInput={handleCharacterInput}
              onBackspace={handleBackspace}
              isActive={gameStatus === 'playing'}
              scoreBonusText={scoreBonusText}
            />

            {/* Arcade Combat Dashboard: WPM / Accuracy / Score / Special */}
            <CombatDashboard
              wpm={liveWpm}
              accuracy={liveAccuracy}
              score={score}
              specialMeter={specialMeter}
              onTriggerSpecial={triggerSpecialAttack}
            />

            {/* On-Screen Keypad for Touch / Mobile Devices */}
            <div className="flex flex-col items-center w-full">
              <button
                type="button"
                onClick={() => setShowVirtualKeyboard((v) => !v)}
                className="text-[9px] sm:text-[10px] font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)] transition-all cursor-pointer mb-0.5 select-none"
              >
                <Keyboard className="w-3 h-3 text-cyan-400" />
                <span className="font-bold tracking-wider">{showVirtualKeyboard ? 'HIDE TOUCH KEYPAD' : 'SHOW TOUCH KEYPAD'}</span>
              </button>

              {showVirtualKeyboard && (
                <VirtualKeyboard
                  onKey={handleCharacterInput}
                  onBackspace={handleBackspace}
                  onSpecial={triggerSpecialAttack}
                  isSpecialReady={isSpecialReady}
                />
              )}
            </div>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* MODAL OVERLAYS (Preserved & Styled as Arcade Dialogs)          */}
      {/* ============================================================== */}

      {/* Pause Menu Overlay */}
      {gameStatus === 'paused' && (
        <PauseMenu
          onResume={resumeGame}
          onRestart={restartMatch}
          onChangeCharacter={() => setShowCharacterSelect(true)}
          onOpenSettings={() => setShowSettings(true)}
          onMainMenu={returnToMenu}
        />
      )}

      {/* Victory / Defeat Screen Overlay */}
      {(gameStatus === 'victory' || gameStatus === 'defeat') && (
        <GameOverModal
          isVictory={gameStatus === 'victory'}
          mode={gameMode}
          level={level}
          maxCampaignLevel={maxCampaignLevel}
          stats={currentRunStats}
          enemyName={enemy.name}
          enemyArchetype={enemy.archetype}
          isNewHighScore={isNewHighScore}
          onNextLevel={nextLevel}
          onPlayAgain={restartMatch}
          onChangeCharacter={() => setShowCharacterSelect(true)}
          onMainMenu={returnToMenu}
        />
      )}

      {/* Character Selection Modal Overlay */}
      {showCharacterSelect && (
        <CharacterSelectModal
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={(charId) => selectCharacter(charId)}
          onClose={() => setShowCharacterSelect(false)}
          onStartGame={
            gameStatus === 'menu'
              ? () => {
                  setShowCharacterSelect(false);
                  startMatch(gameMode);
                }
              : undefined
          }
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* How To Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* High Scores Leaderboard Modal */}
      {showHighScores && (
        <HighScoresModal
          scores={highScores}
          onClose={() => setShowHighScores(false)}
        />
      )}
    </div>
  );
}
