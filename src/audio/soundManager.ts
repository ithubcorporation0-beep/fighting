// Pure Web Audio API Sound Synthesizer - 100% reliable, zero external dependencies

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private masterVolume: number = 1.0;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.3;
  private musicInterval: number | null = null;
  private musicStep: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
  }

  private getEffectiveSfxVol(): number {
    return this.sfxVolume * this.masterVolume;
  }

  private getEffectiveMusicVol(): number {
    return this.musicVolume * this.masterVolume;
  }

  // Menu button hover cyber tick
  public playMenuHover() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext safe catch
    }
  }

  // Menu button click
  public playMenuClick() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05); // A5
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Safe
    }
  }

  // Character selection hover sound - high energy arcade selection chime
  public playCharacterSelect() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.07); // D6
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Safe
    }
  }

  // Character lock-in confirm fanfare
  public playCharacterConfirm() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.18);
      });
    } catch {
      // Safe
    }
  }

  // Word Complete chime
  public playWordComplete() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [880, 1174.66].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.22, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.1);
      });
    } catch {
      // Safe
    }
  }

  // Block impact
  public playBlock() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Safe
    }
  }

  // Key press feedback
  public playKeyType() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520 + Math.random() * 80, this.ctx.currentTime);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext safe catch
    }
  }

  // Correct key hit
  public playKeyCorrect() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // AudioContext safe catch
    }
  }

  // Error key
  public playKeyError() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // AudioContext safe catch
    }
  }

  // Punch attack
  public playPunch() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Low punch thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Noise crack
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1000;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(now);
    } catch {
      // AudioContext safe catch
    }
  }

  // Heavy kick / fast attack
  public playHeavyHit() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.22);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // AudioContext safe catch
    }
  }

  // Critical hit
  public playCriticalHit() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High energetic ping
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(1400, now);
      ping.frequency.exponentialRampToValueAtTime(2200, now + 0.1);
      pingGain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.5, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      ping.connect(pingGain);
      pingGain.connect(this.ctx.destination);
      ping.start(now);
      ping.stop(now + 0.25);

      // Heavy explosion thud
      this.playHeavyHit();
    } catch {
      // AudioContext safe catch
    }
  }

  // Hit reaction sound
  public playHit() {
    this.playPunch();
  }

  // Enemy attack telegraph warning sound
  public playTelegraphWarning() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // AudioContext safe catch
    }
  }

  // Combo milestone
  public playCombo(count: number) {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 440;
      const semitone = Math.min(count, 16);
      const freq = baseFreq * Math.pow(2, semitone / 12);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.12);
      gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // AudioContext safe catch
    }
  }

  // Special attack activation
  public playSpecialAttack() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Rising energy sweep
      const charge = this.ctx.createOscillator();
      const chargeGain = this.ctx.createGain();
      charge.type = 'sawtooth';
      charge.frequency.setValueAtTime(220, now);
      charge.frequency.exponentialRampToValueAtTime(980, now + 0.35);
      chargeGain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.4, now);
      chargeGain.gain.linearRampToValueAtTime(this.getEffectiveSfxVol() * 0.7, now + 0.3);
      chargeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      charge.connect(chargeGain);
      chargeGain.connect(this.ctx.destination);
      charge.start(now);
      charge.stop(now + 0.5);

      // Massive bass detonation at 0.3s
      setTimeout(() => {
        if (!this.ctx) return;
        const detTime = this.ctx.currentTime;
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'triangle';
        sub.frequency.setValueAtTime(140, detTime);
        sub.frequency.exponentialRampToValueAtTime(30, detTime + 0.5);
        subGain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.9, detTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, detTime + 0.5);
        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        sub.start(detTime);
        sub.stop(detTime + 0.5);
      }, 300);
    } catch {
      // AudioContext safe catch
    }
  }

  // Victory fanfare
  public playVictory() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const start = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // AudioContext safe catch
    }
  }

  // Defeat sound
  public playDefeat() {
    if (!this.soundEnabled || this.masterVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [293.66, 261.63, 220.0, 174.61]; // D4, C4, A3, F3
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const start = this.ctx.currentTime + idx * 0.18;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(this.getEffectiveSfxVol() * 0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch {
      // AudioContext safe catch
    }
  }

  // Retro arcade background synth beat loop
  public startMusic() {
    this.stopMusic();
    if (!this.musicEnabled || this.masterVolume <= 0) return;

    const bassNotes = [55, 55, 65.41, 73.42, 55, 55, 82.41, 73.42]; // A1, C2, D2, E2
    const stepDuration = 220; // ms

    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled || this.masterVolume <= 0) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const note = bassNotes[this.musicStep % bassNotes.length];
        this.musicStep++;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, now);

        gain.gain.setValueAtTime(this.getEffectiveMusicVol() * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } catch {
        // Safe catch
      }
    }, stepDuration);
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sounds = new SoundManager();
