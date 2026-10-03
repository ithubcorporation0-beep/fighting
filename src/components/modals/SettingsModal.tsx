import React from 'react';
import { GameSettings } from '../../types/game';
import { X, Volume2, VolumeX, Music, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleChange = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.35)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2
              className="text-xl font-black uppercase text-white tracking-wider"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              SETTINGS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-4">
          {/* Master Volume */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-slate-200">Master Volume</span>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                {Math.round(settings.masterVolume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => handleChange('masterVolume', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Sound FX Toggle & Volume */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-sm font-semibold text-slate-200">Sound Effects</span>
              </div>
              <button
                onClick={() => handleChange('soundEnabled', !settings.soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {settings.soundEnabled && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-mono text-slate-500 w-12">VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => handleChange('soundVolume', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan-400 w-8 text-right">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Music Toggle */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Music className={`w-4 h-4 ${settings.musicEnabled ? 'text-fuchsia-400' : 'text-slate-500'}`} />
                <span className="text-sm font-semibold text-slate-200">Arcade Synth Pulse</span>
              </div>
              <button
                onClick={() => handleChange('musicEnabled', !settings.musicEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  settings.musicEnabled ? 'bg-fuchsia-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {settings.musicEnabled && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-mono text-slate-500 w-12">VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.musicVolume}
                  onChange={(e) => handleChange('musicVolume', parseFloat(e.target.value))}
                  className="w-full accent-fuchsia-400 cursor-pointer"
                />
                <span className="text-xs font-mono text-fuchsia-400 w-8 text-right">
                  {Math.round(settings.musicVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Difficulty Segmented Control */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-slate-200">Combat Difficulty</span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['easy', 'normal', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleChange('difficulty', diff)}
                  className={`py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${
                    settings.difficulty === diff
                      ? 'bg-fuchsia-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Reduced Motion</span>
                <span className="text-[11px] text-slate-500">Disable camera shake and flash</span>
              </div>
            </div>
            <button
              onClick={() => handleChange('reducedMotion', !settings.reducedMotion)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.reducedMotion ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
        >
          CONFIRM & CLOSE
        </button>
      </div>
    </div>
  );
};
