import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameMode,
  GameStatus,
  FighterAction,
  ScreenShakeType,
  EnemyConfig,
  EnemyArchetype,
  FloatingDamage,
  HitEffect,
  GameRunStats,
  GameSettings,
  HighScoreEntry,
  CharacterConfig,
} from '../types/game';
import {
  getEnemyByLevel,
  getRandomEnemy,
  generateWaveEnemy,
  CAMPAIGN_ENEMIES,
  ALL_ENEMIES,
  ARCHETYPE_INFO,
} from '../data/enemies';
import { getWordForDifficulty } from '../data/words';
import { sounds } from '../audio/soundManager';
import {
  loadSettings,
  saveSettings,
  loadHighScores,
  saveHighScore,
  loadCampaignLevel,
  saveCampaignLevel,
  loadSelectedCharacterId,
  saveSelectedCharacterId,
} from '../utils/storage';
import {
  calculateWpm,
  calculateAccuracy,
  evaluateWordCompletion,
} from '../utils/typingMetrics';
import { getCharacterById, PLAYABLE_CHARACTERS } from '../data/characters';

export function useTypingCombat() {
  // Saved data
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [highScores, setHighScores] = useState<HighScoreEntry[]>(loadHighScores);
  const [campaignLevel, setCampaignLevel] = useState<number>(loadCampaignLevel);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(loadSelectedCharacterId);

  const selectedCharacter: CharacterConfig = getCharacterById(selectedCharacterId);

  // Match State
  const [gameStatus, setGameStatus] = useState<GameStatus>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [level, setLevel] = useState<number>(1);
  const [wave, setWave] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Player state initialized with chosen character's HP
  const [playerHp, setPlayerHp] = useState<number>(() => selectedCharacter.maxHp);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(() => selectedCharacter.maxHp);
  const [playerAction, setPlayerAction] = useState<FighterAction>('idle');
  const [specialMeter, setSpecialMeter] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);

  // Enemy state with archetype & shield support
  const [enemy, setEnemy] = useState<EnemyConfig>(() => getEnemyByLevel(1));
  const [enemyHp, setEnemyHp] = useState<number>(() => getEnemyByLevel(1).maxHp);
  const [enemyMaxHp, setEnemyMaxHp] = useState<number>(() => getEnemyByLevel(1).maxHp);
  const [enemyShieldHp, setEnemyShieldHp] = useState<number>(() => getEnemyByLevel(1).shieldHp || 0);
  const [enemyMaxShieldHp, setEnemyMaxShieldHp] = useState<number>(() => getEnemyByLevel(1).shieldHp || 0);
  const [enemyAction, setEnemyAction] = useState<FighterAction>('idle');
  const [enemyAttackProgress, setEnemyAttackProgress] = useState<number>(0);

  // Typing state
  const [currentWord, setCurrentWord] = useState<string>('START');
  const [typedIndex, setTypedIndex] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  // Run Stats
  const [score, setScore] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [incorrectKeystrokes, setIncorrectKeystrokes] = useState<number>(0);
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const [criticalHits, setCriticalHits] = useState<number>(0);
  const [specialAttacksUsed, setSpecialAttacksUsed] = useState<number>(0);

  // Combat Visual FX
  const [screenShake, setScreenShake] = useState<ScreenShakeType>('none');
  const [screenFlash, setScreenFlash] = useState<boolean>(false);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [comboMessage, setComboMessage] = useState<string>('');
  const [scoreBonusText, setScoreBonusText] = useState<string>('');
  const [isEnemyTelegraphing, setIsEnemyTelegraphing] = useState<boolean>(false);
  const [isPlayerInvulnerable, setIsPlayerInvulnerable] = useState<boolean>(false);

  // Timestamps & Refs
  const matchStartTimeRef = useRef<number>(Date.now());
  const wordStartTimeRef = useRef<number>(Date.now());
  const wordHadErrorsRef = useRef<boolean>(false);
  const enemyAttackTimerRef = useRef<number | null>(null);
  const timeAttackIntervalRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const enemyAttackProgressRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number>(Date.now());
  const isTelegraphingRef = useRef<boolean>(false);
  const isExecutingAttackRef = useRef<boolean>(false);
  const isEnemyAttackingRef = useRef<boolean>(false);
  const isPlayerInvulnerableRef = useRef<boolean>(false);

  // Apply sound settings
  useEffect(() => {
    sounds.setSoundEnabled(settings.soundEnabled);
    sounds.setMasterVolume(settings.masterVolume ?? 1.0);
    sounds.setSfxVolume(settings.soundVolume);
    sounds.setMusicEnabled(settings.musicEnabled);
    sounds.setMusicVolume(settings.musicVolume);
    saveSettings(settings);
  }, [settings]);

  // Derived live metrics
  const elapsedSeconds = Math.max(1, (Date.now() - matchStartTimeRef.current) / 1000);
  const liveWpm = calculateWpm(correctKeystrokes, elapsedSeconds);
  const liveAccuracy = calculateAccuracy(correctKeystrokes, totalKeystrokes);

  // Helper: Trigger visual hit effects & floating text
  const addHitEffect = useCallback((type: HitEffect['type'], isEnemyHit: boolean) => {
    const id = `hit-${Date.now()}-${Math.random()}`;
    const x = isEnemyHit ? 52 + (Math.random() * 6 - 3) : 48 + (Math.random() * 6 - 3);
    const y = 48 + (Math.random() * 8 - 4);
    const size = type === 'special' ? 140 : type === 'crit' ? 95 : 65;

    setHitEffects((prev) => [...prev, { id, type, x, y, size }]);
    setTimeout(() => {
      setHitEffects((prev) => prev.filter((h) => h.id !== id));
    }, 400);
  }, []);

  const addFloatingDamage = useCallback(
    (text: string, isCrit: boolean, isEnemy: boolean, isHeal: boolean = false) => {
      const id = `dmg-${Date.now()}-${Math.random()}`;
      const xOffset = Math.random() * 40 - 20;
      const yOffset = Math.random() * 30 - 15;

      setFloatingDamages((prev) => [
        ...prev,
        { id, text, isCrit, isHeal, isEnemy, xOffset, yOffset },
      ]);
      setTimeout(() => {
        setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
      }, 850);
    },
    [],
  );

  const triggerScreenShake = useCallback((type: ScreenShakeType = 'light') => {
    if (settings.reducedMotion) return;
    setScreenShake(type);
    const duration = type === 'special' ? 360 : type === 'heavy' ? 240 : 160;
    setTimeout(() => setScreenShake('none'), duration);
  }, [settings.reducedMotion]);

  const triggerScreenFlash = useCallback(() => {
    if (settings.reducedMotion) return;
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 140);
  }, [settings.reducedMotion]);

  const flashComboMessage = useCallback((msg: string) => {
    if (!msg) return;
    setComboMessage(msg);
    setTimeout(() => {
      setComboMessage((curr) => (curr === msg ? '' : curr));
    }, 700);
  }, []);

  // Set action with auto-reset to idle
  const setPlayerActionTimed = useCallback((action: FighterAction, durationMs = 280) => {
    setPlayerAction(action);
    setTimeout(() => {
      setPlayerAction((curr) => (curr === action ? 'idle' : curr));
    }, durationMs);
  }, []);

  const setEnemyActionTimed = useCallback((action: FighterAction, durationMs = 300) => {
    setEnemyAction(action);
    setTimeout(() => {
      setEnemyAction((curr) => (curr === action ? 'idle' : curr));
    }, durationMs);
  }, []);

  // Setup a new word for player
  const spawnNewWord = useCallback((complexity: EnemyConfig['wordComplexity'], current?: string) => {
    const nextWord = getWordForDifficulty(complexity, current);
    setCurrentWord(nextWord);
    setTypedIndex(0);
    setHasError(false);
    wordHadErrorsRef.current = false;
    wordStartTimeRef.current = Date.now();
  }, []);

  // Handle enemy attack when timer runs out
  const executeEnemyAttack = useCallback(() => {
    if (gameStatus !== 'playing') {
      isEnemyAttackingRef.current = false;
      return;
    }

    // STEP 1: Enemy Anticipation (pulls back arm)
    setEnemyAction('attack');

    setTimeout(() => {
      if (gameStatus !== 'playing') {
        isEnemyAttackingRef.current = false;
        return;
      }

      // STEP 2: Enemy Lunge Strike
      sounds.playHeavyHit();

      setTimeout(() => {
        if (gameStatus !== 'playing') {
          isEnemyAttackingRef.current = false;
          return;
        }

        // STEP 3: Impact on Player
        // If player is within invulnerability grace period, avoid stacking damage
        if (!isPlayerInvulnerableRef.current) {
          const isHeavy = enemy.archetype === 'Heavy';
          const isSpeedster = enemy.archetype === 'Speedster';
          const isAssassin = enemy.archetype === 'Assassin';

          if (isHeavy) {
            triggerScreenShake('special');
            sounds.playHeavyHit();
          } else if (isSpeedster) {
            triggerScreenShake('light');
          } else {
            triggerScreenShake('heavy');
          }
          triggerScreenFlash();

          const rawDamage = enemy.attackDamage;
          const damage = Math.max(1, Math.round(rawDamage * (1 - selectedCharacter.defenseDamageReduction)));
          setPlayerHp((prev) => {
            const nextHp = Math.max(0, prev - damage);
            if (nextHp <= 0) {
              // Player defeated
              setPlayerAction('defeat');
              setEnemyAction('victory');
              sounds.playDefeat();
              setGameStatus('defeat');
            } else {
              setPlayerActionTimed('hit', 320);
            }
            return nextHp;
          });

          const damageTag = isHeavy
            ? `💥 CRUSH! -${damage}`
            : isSpeedster
            ? `⚡ BLITZ! -${damage}`
            : isAssassin
            ? `🗡️ AMBUSH! -${damage}`
            : `-${damage}`;

          addFloatingDamage(damageTag, isHeavy || isAssassin, false);
          addHitEffect(isHeavy ? 'kick' : 'punch', false);

          // Grace period invulnerability for 1.2s so consecutive multi-hits cannot instant-kill
          isPlayerInvulnerableRef.current = true;
          setIsPlayerInvulnerable(true);
          setTimeout(() => {
            isPlayerInvulnerableRef.current = false;
            setIsPlayerInvulnerable(false);
          }, 1200);
        }

        // Reset enemy attack gauge & telegraph
        enemyAttackProgressRef.current = 0;
        setEnemyAttackProgress(0);
        isTelegraphingRef.current = false;
        setIsEnemyTelegraphing(false);

        setTimeout(() => {
          setEnemyAction('idle');
          isEnemyAttackingRef.current = false;
        }, 260);
      }, 90);
    }, 120);
  }, [
    gameStatus,
    enemy,
    addFloatingDamage,
    addHitEffect,
    setEnemyActionTimed,
    setPlayerActionTimed,
    triggerScreenShake,
    triggerScreenFlash,
  ]);

  // Start match
  const startMatch = useCallback(
    (mode: GameMode, levelNumber = 1) => {
      let activeEnemy: EnemyConfig;
      if (mode === 'campaign') {
        activeEnemy = getEnemyByLevel(levelNumber);
      } else if (mode === 'endless') {
        activeEnemy = generateWaveEnemy(levelNumber);
      } else if (mode === 'time_attack') {
        activeEnemy = getRandomEnemy({ minLevel: 2 });
      } else {
        // Quick match randomly selects from the diverse set of enemy archetypes (Heavy, Speedster, Tank, etc.)
        activeEnemy = getRandomEnemy({ excludeId: enemy.id });
      }

      setGameMode(mode);
      setLevel(levelNumber);
      setWave(levelNumber);
      setEnemy(activeEnemy);
      setEnemyHp(activeEnemy.maxHp);
      setEnemyMaxHp(activeEnemy.maxHp);
      setEnemyShieldHp(activeEnemy.shieldHp || 0);
      setEnemyMaxShieldHp(activeEnemy.shieldHp || 0);
      setPlayerHp(selectedCharacter.maxHp);
      setPlayerMaxHp(selectedCharacter.maxHp);
      setSpecialMeter(0);
      setCombo(0);
      setHighestCombo(0);
      setScore(0);
      setTotalKeystrokes(0);
      setCorrectKeystrokes(0);
      setIncorrectKeystrokes(0);
      setWordsCompleted(0);
      setCriticalHits(0);
      setSpecialAttacksUsed(0);
      setIsNewHighScore(false);
      setPlayerAction('idle');
      setEnemyAction('idle');
      enemyAttackProgressRef.current = 0;
      setEnemyAttackProgress(0);
      isTelegraphingRef.current = false;
      setIsEnemyTelegraphing(false);
      isExecutingAttackRef.current = false;
      isEnemyAttackingRef.current = false;
      isPlayerInvulnerableRef.current = false;
      setIsPlayerInvulnerable(false);
      hasSavedScoreRef.current = false;
      setFinalRunStats(null);

      if (mode === 'time_attack') {
        setTimeRemaining(60);
      }

      matchStartTimeRef.current = Date.now();
      lastTickTimeRef.current = Date.now();
      if (levelNumber === 1 && mode === 'campaign') {
        setCurrentWord('OPEN YOUR MIND');
        setTypedIndex(0);
        setHasError(false);
        wordHadErrorsRef.current = false;
        wordStartTimeRef.current = Date.now();
      } else {
        spawnNewWord(activeEnemy.wordComplexity);
      }
      setGameStatus('playing');
    },
    [enemy.id, selectedCharacter.maxHp, spawnNewWord],
  );

  // Re-roll current quick match enemy to another random archetype
  const rerollEnemy = useCallback(
    (preferredArchetype?: EnemyArchetype) => {
      sounds.playMenuClick();
      const newEnemy = getRandomEnemy({ excludeId: enemy.id, archetype: preferredArchetype });
      setEnemy(newEnemy);
      setEnemyHp(newEnemy.maxHp);
      setEnemyMaxHp(newEnemy.maxHp);
      setEnemyShieldHp(newEnemy.shieldHp || 0);
      setEnemyMaxShieldHp(newEnemy.shieldHp || 0);
      flashComboMessage(`NEW CHALLENGER: ${newEnemy.name} [${newEnemy.archetype}]`);
    },
    [enemy.id, flashComboMessage],
  );

  // Keyboard character handling
  const handleCharacterInput = useCallback(
    (rawChar: string) => {
      if (gameStatus !== 'playing' || isExecutingAttackRef.current) return;

      const char = rawChar.toUpperCase();
      const targetChar = currentWord.charAt(typedIndex);

      setTotalKeystrokes((prev) => prev + 1);

      if (char === targetChar) {
        // Correct keystroke!
        sounds.playKeyCorrect();
        setCorrectKeystrokes((prev) => prev + 1);
        setHasError(false);

        // Immediate responsive punch/jab and recoil on keystroke!
        setPlayerActionTimed('punch', 100);
        setEnemyActionTimed('hurt', 90);

        let nextIndex = typedIndex + 1;
        // If the very next character is a space, advance automatically for seamless phrasing
        if (nextIndex < currentWord.length && currentWord.charAt(nextIndex) === ' ') {
          nextIndex += 1;
        }
        setTypedIndex(nextIndex);

        // Check if word completed!
        if (nextIndex >= currentWord.length) {
          isExecutingAttackRef.current = true;

          const duration = Date.now() - wordStartTimeRef.current;
          const hadErrors = wordHadErrorsRef.current;

          // Word evaluation
          const evalResult = evaluateWordCompletion(
            currentWord,
            duration,
            hadErrors,
            combo,
          );

          // Update combo
          const nextCombo = combo + 1;
          setCombo(nextCombo);
          setHighestCombo((prev) => Math.max(prev, nextCombo));

          // Attack classification as specified:
          // Normal word: LIGHT ATTACK
          // Fast word: HEAVY ATTACK
          // Perfect accuracy: CRITICAL ATTACK
          // High combo: COMBO ATTACK
          const isCrit = evalResult.isCrit;
          const isFast = evalResult.tier === 'fast' || evalResult.tier === 'critical';
          const isHighCombo = combo >= 3;

          let attackAction: FighterAction = 'light_attack';
          if (isCrit) {
            attackAction = 'heavy_attack';
          } else if (isHighCombo) {
            attackAction = 'combo_attack';
          } else if (isFast) {
            attackAction = 'heavy_attack';
          } else {
            attackAction = 'light_attack';
          }

          // Word complete chime
          sounds.playWordComplete();

          // ==============================================================
          // COMBAT PACING: Anticipation -> Attack Lunge -> Impact -> Reaction -> Recovery
          // ==============================================================

          // STEP 1: Short Anticipation Windup (0ms - 70ms)
          setPlayerAction('type_ready');

          setTimeout(() => {
            // STEP 2: Attack Animation Lunge (at 70ms)
            setPlayerAction(attackAction);
            if (isCrit) {
              sounds.playCriticalHit();
            } else if (isFast || isHighCombo) {
              sounds.playHeavyHit();
            } else {
              sounds.playPunch();
            }

            // STEP 3: Impact connects at Enemy (at 150ms)
            setTimeout(() => {
              if (isCrit) {
                sounds.playCriticalHit();
                triggerScreenFlash();
                triggerScreenShake('heavy');
                setCriticalHits((prev) => prev + 1);
                addHitEffect('crit', true);
                flashComboMessage('CRITICAL ATTACK!');
              } else if (isHighCombo) {
                sounds.playCombo(nextCombo);
                triggerScreenShake('heavy');
                addHitEffect('kick', true);
                flashComboMessage(`${nextCombo}x COMBO!`);
              } else if (isFast) {
                sounds.playHeavyHit();
                triggerScreenShake('heavy');
                addHitEffect('kick', true);
                if (evalResult.message) flashComboMessage(evalResult.message);
              } else {
                sounds.playPunch();
                triggerScreenShake('light');
                addHitEffect('punch', true);
              }

              // Enemy reaction: Knockback!
              const enemyReaction: FighterAction = isCrit || isFast || isHighCombo ? 'heavy_hit' : 'hit';
              setEnemyActionTimed(enemyReaction, 320);

              // Calculate damage with character perks and multipliers
              const charDamage = Math.max(1, Math.round(evalResult.damage * selectedCharacter.damageMultiplier));

              // Floating damage number
              addFloatingDamage(
                isCrit ? `CRIT! -${charDamage}` : `-${charDamage}`,
                isCrit,
                true,
              );

              // Axel Perk: Combustion Chain (every 5 combo deals bonus 12 fire damage)
              if (selectedCharacter.id === 'axel' && nextCombo > 0 && nextCombo % 5 === 0) {
                setTimeout(() => {
                  sounds.playHeavyHit();
                  addFloatingDamage('🔥 +12 BURN!', true, true);
                  setEnemyHp((hp) => Math.max(0, hp - 12));
                  flashComboMessage('COMBUSTION BLAST!');
                }, 160);
              }

              // Nyx Perk: Shadow Kunai (crit delays enemy attack further)
              if (selectedCharacter.id === 'nyx' && isCrit) {
                enemyAttackProgressRef.current = Math.max(0, enemyAttackProgressRef.current - 20);
                setEnemyAttackProgress(enemyAttackProgressRef.current);
              }

              // Stagger enemy: INTERRUPT enemy attack telegraph!
              enemyAttackProgressRef.current = Math.max(0, enemyAttackProgressRef.current - 40);
              setEnemyAttackProgress(enemyAttackProgressRef.current);
              if (isTelegraphingRef.current) {
                isTelegraphingRef.current = false;
                setIsEnemyTelegraphing(false);
                flashComboMessage('ATTACK INTERRUPTED!');
              }

              // Charge special meter (scaled by character special charge rate)
              const baseMeterGain = isCrit ? 25 : isFast ? 20 : 15;
              const meterGain = Math.round(baseMeterGain * selectedCharacter.specialChargeRate);
              setSpecialMeter((prev) => Math.min(100, prev + meterGain));

              // Add Score (with Kai Phoenix perk bonus if flawless)
              const bonusScoreMultiplier = selectedCharacter.id === 'kai' && !wordHadErrorsRef.current ? 1.15 : 1.0;
              const pointsGained = Math.round(evalResult.scoreGained * bonusScoreMultiplier);
              setScore((prev) => prev + pointsGained);
              setWordsCompleted((prev) => prev + 1);
              setScoreBonusText(`+${pointsGained} PTS`);
              setTimeout(() => {
                setScoreBonusText('');
              }, 800);

              // Apply damage: absorb by shield first if enemy has fortified shield
              let damageToHealth = charDamage;
              if (enemyShieldHp > 0) {
                if (charDamage <= enemyShieldHp) {
                  setEnemyShieldHp((curr) => curr - charDamage);
                  damageToHealth = 0;
                  sounds.playBlock();
                  addFloatingDamage(`SHIELD -${charDamage}`, false, true);
                  flashComboMessage('ARMOR BLOCKED!');
                } else {
                  damageToHealth = charDamage - enemyShieldHp;
                  setEnemyShieldHp(0);
                  sounds.playBlock();
                  addFloatingDamage(`SHIELD BROKEN!`, true, true);
                  flashComboMessage('ARMOR SHATTERED!');
                }
              }

              // Apply remaining damage to enemy health
              setEnemyHp((prev) => {
                const nextHp = Math.max(0, prev - damageToHealth);
                if (nextHp <= 0) {
                  // Enemy defeated!
                  setEnemyAction('defeat');
                  setPlayerAction('victory');
                  sounds.playVictory();

                  if (gameMode === 'campaign') {
                    saveCampaignLevel(level + 1);
                    setCampaignLevel((prevLvl) => Math.max(prevLvl, level + 1));
                    setGameStatus('victory');
                  } else if (gameMode === 'endless') {
                    const nextWave = wave + 1;
                    setWave(nextWave);
                    setLevel(nextWave);
                    const nextEnemy = generateWaveEnemy(nextWave);
                    setEnemy(nextEnemy);
                    setEnemyHp(nextEnemy.maxHp);
                    setEnemyMaxHp(nextEnemy.maxHp);
                    setEnemyShieldHp(nextEnemy.shieldHp || 0);
                    setEnemyMaxShieldHp(nextEnemy.shieldHp || 0);
                    setPlayerHp((curr) => {
                      const healed = Math.min(selectedCharacter.maxHp, curr + 25);
                      addFloatingDamage('+25 HP', false, false, true);
                      return healed;
                    });
                    flashComboMessage(`WAVE ${nextWave}: ${nextEnemy.name} [${nextEnemy.archetype}]`);
                    spawnNewWord(nextEnemy.wordComplexity);
                  } else {
                    setGameStatus('victory');
                  }
                }
                return nextHp;
              });

              // STEP 4: Recovery & Spawn New Word (at 330ms)
              setTimeout(() => {
                setPlayerAction('idle');
                setEnemyHp((currHp) => {
                  if (currHp > 0) {
                    spawnNewWord(enemy.wordComplexity, currentWord);
                  }
                  return currHp;
                });
                isExecutingAttackRef.current = false;
              }, 180);
            }, 80);
          }, 70);
        }
      } else {
        // Incorrect character!
        sounds.playKeyError();
        setIncorrectKeystrokes((prev) => prev + 1);
        setHasError(true);
        wordHadErrorsRef.current = true;

        // Reset/Decrease combo
        if (combo > 0) {
          flashComboMessage('MISS!');
          setCombo(0);
        }

        // Penalty: accelerate enemy attack meter slightly (5%), capped at 85% so mistakes alone don't instant-punch
        enemyAttackProgressRef.current = Math.min(85, enemyAttackProgressRef.current + 5);
        setEnemyAttackProgress(enemyAttackProgressRef.current);
      }
    },
    [
      gameStatus,
      currentWord,
      typedIndex,
      combo,
      enemy,
      gameMode,
      level,
      wave,
      spawnNewWord,
      setPlayerActionTimed,
      setEnemyActionTimed,
      triggerScreenShake,
      triggerScreenFlash,
      addFloatingDamage,
      addHitEffect,
      flashComboMessage,
    ],
  );

  const handleBackspace = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setHasError(false);
  }, [gameStatus]);

  // Special attack activation
  const triggerSpecialAttack = useCallback(() => {
    if (gameStatus !== 'playing' || specialMeter < 100 || isExecutingAttackRef.current) return;
    isExecutingAttackRef.current = true;

    // Fire ultimate special attack!
    sounds.playSpecialAttack();
    triggerScreenFlash();
    triggerScreenShake('special');
    setSpecialAttacksUsed((prev) => prev + 1);

    setPlayerAction('special_attack');

    setTimeout(() => {
      // Connect impact!
      triggerScreenFlash();
      triggerScreenShake('special');
      setEnemyActionTimed('heavy_hit', 600);
      addHitEffect('special', true);

      const baseSpecialDamage = 45 + Math.round(combo * 2);
      const specialDamage = Math.round(baseSpecialDamage * selectedCharacter.damageMultiplier);
      addFloatingDamage(`${selectedCharacter.specialMove.name}! -${specialDamage}`, true, true);
      flashComboMessage(`${selectedCharacter.specialMove.name}!`);

      // Special attack shatters shields completely
      setEnemyShieldHp(0);
      setSpecialMeter(0);
      enemyAttackProgressRef.current = 0;
      setEnemyAttackProgress(0);
      isTelegraphingRef.current = false;
      setIsEnemyTelegraphing(false);
      setScore((prev) => prev + 600);

      setEnemyHp((prev) => {
        const nextHp = Math.max(0, prev - specialDamage);
        if (nextHp <= 0) {
          setEnemyAction('defeat');
          setPlayerAction('victory');
          sounds.playVictory();
          if (gameMode === 'campaign') {
            saveCampaignLevel(level + 1);
            setCampaignLevel((prevLvl) => Math.max(prevLvl, level + 1));
            setGameStatus('victory');
          } else if (gameMode === 'endless') {
            const nextWave = wave + 1;
            setWave(nextWave);
            setLevel(nextWave);
            const nextEnemy = generateWaveEnemy(nextWave);
            setEnemy(nextEnemy);
            setEnemyHp(nextEnemy.maxHp);
            setEnemyMaxHp(nextEnemy.maxHp);
            setEnemyShieldHp(nextEnemy.shieldHp || 0);
            setEnemyMaxShieldHp(nextEnemy.shieldHp || 0);
            setPlayerHp((curr) => Math.min(selectedCharacter.maxHp, curr + 25));
            flashComboMessage(`WAVE ${nextWave}: ${nextEnemy.name} [${nextEnemy.archetype}]`);
            spawnNewWord(nextEnemy.wordComplexity);
          } else {
            setGameStatus('victory');
          }
        }
        return nextHp;
      });

      setTimeout(() => {
        setPlayerAction('idle');
        isExecutingAttackRef.current = false;
      }, 300);
    }, 180);
  }, [
    gameStatus,
    specialMeter,
    combo,
    gameMode,
    level,
    wave,
    selectedCharacter,
    spawnNewWord,
    triggerScreenFlash,
    triggerScreenShake,
    setPlayerActionTimed,
    setEnemyActionTimed,
    addHitEffect,
    addFloatingDamage,
    flashComboMessage,
  ]);

  // Match end stats freeze & save tracking
  const [finalRunStats, setFinalRunStats] = useState<GameRunStats | null>(null);
  const hasSavedScoreRef = useRef<boolean>(false);

  // Stable ref for executeEnemyAttack to avoid game loop restarts
  const executeEnemyAttackRef = useRef(executeEnemyAttack);
  useEffect(() => {
    executeEnemyAttackRef.current = executeEnemyAttack;
  }, [executeEnemyAttack]);

  // Main game loop: updates enemy attack timer and time attack countdown
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    let isRunning = true;
    lastTickTimeRef.current = Date.now();

    const loop = () => {
      if (!isRunning) return;

      const now = Date.now();
      const delta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      // Enemy Attack Timer Tick with dynamic archetype patterns
      if (!isEnemyAttackingRef.current) {
        const speedModifier = selectedCharacter.id === 'yuki' ? 1.15 : 1.0;
        const baseInterval =
          (enemy.attackIntervalMs[settings.difficulty] || 5000) * speedModifier;

        // Dynamic Archetype Attack Pattern Speed
        let patternMultiplier = 1.0;
        const currProgress = enemyAttackProgressRef.current;

        if (enemy.attackPattern === 'accelerating') {
          // Starts steady at 0.6x and ramps up to 1.7x as meter fills
          patternMultiplier = 0.6 + (currProgress / 100) * 1.1;
        } else if (enemy.attackPattern === 'feint') {
          // Hesitates momentarily at 45%-55% then bursts at 2.2x speed
          if (currProgress >= 45 && currProgress < 55) {
            patternMultiplier = 0.2;
          } else if (currProgress >= 55) {
            patternMultiplier = 1.6;
          }
        } else if (enemy.attackPattern === 'blitz') {
          patternMultiplier = 1.25;
        } else if (enemy.attackPattern === 'crushing') {
          patternMultiplier = 0.85;
        } else if (enemy.attackPattern === 'fortified') {
          patternMultiplier = 0.9;
        }

        const progressDelta = (delta / baseInterval) * 100 * patternMultiplier;
        enemyAttackProgressRef.current = Math.min(100, enemyAttackProgressRef.current + progressDelta);

        // Dynamic Telegraph Warning Threshold based on archetype
        const threshold = enemy.telegraphThreshold || 70;
        if (enemyAttackProgressRef.current >= threshold && !isTelegraphingRef.current) {
          isTelegraphingRef.current = true;
          setIsEnemyTelegraphing(true);
          sounds.playTelegraphWarning();
        }

        if (enemyAttackProgressRef.current >= 100) {
          isEnemyAttackingRef.current = true;
          isTelegraphingRef.current = false;
          setIsEnemyTelegraphing(false);
          enemyAttackProgressRef.current = 0;
          setEnemyAttackProgress(0);
          executeEnemyAttackRef.current();
        } else {
          setEnemyAttackProgress(enemyAttackProgressRef.current);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameStatus, enemy, settings.difficulty]);

  // Time Attack mode timer countdown
  useEffect(() => {
    if (gameStatus !== 'playing' || gameMode !== 'time_attack') return;

    timeAttackIntervalRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time expired! Victory if high score or end match
          setGameStatus('victory');
          sounds.playVictory();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timeAttackIntervalRef.current) {
        clearInterval(timeAttackIntervalRef.current);
      }
    };
  }, [gameStatus, gameMode]);

  // Global Keyboard Listener for Typing and Space Special
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameStatus === 'playing') {
          setGameStatus('paused');
        } else if (gameStatus === 'paused') {
          setGameStatus('playing');
        }
        return;
      }

      if (gameStatus !== 'playing') return;

      // Space triggers Special Attack if ready!
      if (e.code === 'Space') {
        if (specialMeter >= 100) {
          e.preventDefault();
          triggerSpecialAttack();
          return;
        } else if (currentWord.charAt(typedIndex) !== ' ') {
          // Prevent window scroll
          e.preventDefault();
          return;
        }
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      // Check single character
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        handleCharacterInput(e.key);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    gameStatus,
    specialMeter,
    currentWord,
    typedIndex,
    triggerSpecialAttack,
    handleBackspace,
    handleCharacterInput,
  ]);

  // Save High Score and Freeze Stats on Match End (Guaranteed Once)
  useEffect(() => {
    if (gameStatus !== 'victory' && gameStatus !== 'defeat') {
      hasSavedScoreRef.current = false;
      return;
    }

    if (hasSavedScoreRef.current) return;
    hasSavedScoreRef.current = true;

    const durationSec = Math.max(1, Math.round((Date.now() - matchStartTimeRef.current) / 1000));
    const finalWpm = calculateWpm(correctKeystrokes, durationSec);
    const finalAccuracy = calculateAccuracy(correctKeystrokes, totalKeystrokes);

    const stats: GameRunStats = {
      score,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      totalKeystrokes,
      correctKeystrokes,
      incorrectKeystrokes,
      wordsCompleted,
      highestCombo,
      currentCombo: combo,
      timeElapsedSeconds: durationSec,
      specialAttacksUsed,
      criticalHits,
    };
    setFinalRunStats(stats);

    const newEntry: HighScoreEntry = {
      id: `score-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mode: gameMode,
      levelReached: level,
      score,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      highestCombo,
    };

    const currentScores = loadHighScores();
    const topCurrentScore = currentScores
      .filter((s) => s.mode === gameMode)
      .reduce((max, s) => Math.max(max, s.score), 0);

    if (score > topCurrentScore && score > 0) {
      setIsNewHighScore(true);
    }

    saveHighScore(newEntry);
    setHighScores(loadHighScores());
  }, [
    gameStatus,
    gameMode,
    level,
    score,
    totalKeystrokes,
    correctKeystrokes,
    incorrectKeystrokes,
    wordsCompleted,
    highestCombo,
    combo,
    specialAttacksUsed,
    criticalHits,
  ]);

  // Final summary stats object (uses frozen finalRunStats once match ends)
  const currentRunStats: GameRunStats = finalRunStats || {
    score,
    wpm: liveWpm,
    accuracy: liveAccuracy,
    totalKeystrokes,
    correctKeystrokes,
    incorrectKeystrokes,
    wordsCompleted,
    highestCombo,
    currentCombo: combo,
    timeElapsedSeconds: elapsedSeconds,
    specialAttacksUsed,
    criticalHits,
  };

  const selectCharacter = useCallback((id: string) => {
    setSelectedCharacterId(id);
    saveSelectedCharacterId(id);
    const newChar = getCharacterById(id);
    setPlayerHp(newChar.maxHp);
    setPlayerMaxHp(newChar.maxHp);
  }, []);

  return {
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
    allCharacters: PLAYABLE_CHARACTERS,
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
    isEnemyTelegraphing,
    floatingDamages,
    hitEffects,
    comboMessage,
    scoreBonusText,
    campaignLevel,
    settings,
    highScores,
    isNewHighScore,
    maxCampaignLevel: CAMPAIGN_ENEMIES.length,
    startMatch,
    handleCharacterInput,
    handleBackspace,
    triggerSpecialAttack,
    pauseGame: () => setGameStatus('paused'),
    resumeGame: () => setGameStatus('playing'),
    restartMatch: () => startMatch(gameMode, level),
    nextLevel: () => startMatch('campaign', level + 1),
    returnToMenu: () => {
      setGameStatus('menu');
      sounds.stopMusic();
    },
    updateSettings: setSettings,
  };
}
