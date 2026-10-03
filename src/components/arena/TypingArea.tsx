import React, { useRef, useEffect } from 'react';

interface TypingAreaProps {
  currentWord: string;
  typedIndex: number;
  hasError: boolean;
  onCharacterInput: (char: string) => void;
  onBackspace: () => void;
  isActive: boolean;
  scoreBonusText?: string;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  currentWord,
  typedIndex,
  hasError,
  onCharacterInput,
  onBackspace,
  isActive,
  scoreBonusText,
}) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Keep hidden input focused for mobile virtual keyboards & click to refocus
  useEffect(() => {
    if (isActive) {
      hiddenInputRef.current?.focus();
    }
  }, [isActive, currentWord]);

  const handleContainerClick = () => {
    if (isActive) {
      hiddenInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      onBackspace();
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key === ' ') {
        if (currentWord.charAt(typedIndex) === ' ') {
          e.preventDefault();
          onCharacterInput(' ');
        }
        return;
      }
      e.preventDefault();
      onCharacterInput(e.key);
    }
  };

  const words = currentWord.split(' ');
  let runningCharIndex = 0;

  return (
    <div
      onClick={handleContainerClick}
      className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center select-none cursor-text z-30"
    >
      {/* Hidden input for mobile keyboard access and auto-focus */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute w-0 h-0 pointer-events-auto"
        autoCapitalize="characters"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        onKeyDown={handleKeyDown}
        disabled={!isActive}
        aria-label="Combat Typing Input"
      />

      {/* Floating score feedback popup when a word is completed */}
      {scoreBonusText && (
        <div className="absolute -top-6 pointer-events-none animate-[damage-float_0.8s_ease-out_forwards] font-mono font-black text-yellow-300 text-sm md:text-base drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] z-40">
          {scoreBonusText}
        </div>
      )}

      {/* Compact Combat Typing Console Panel (Reduced Height by ~25%, 80-85% Opacity) */}
      <div className="relative w-full flex flex-col items-center justify-center px-4 py-2 sm:py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        {/* Subtle Neon Top Edge Accent */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        {/* Word Title Target Header */}
        <div className="flex items-center gap-2 mb-1.5 text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-400 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>TRANSMIT COMBAT PHRASE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Letter Tiles (Completed: Neon Cyan, Current: Illuminated White + Brackets, Remaining: Dim) */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3.5 gap-y-1">
          {words.map((word, wordIdx) => {
            const wordStartIndex = runningCharIndex;
            runningCharIndex += word.length + 1;

            return (
              <div key={`word-${wordIdx}`} className="flex items-center gap-1 sm:gap-1.5">
                {word.split('').map((char, charOffset) => {
                  const globalIndex = wordStartIndex + charOffset;
                  const isTyped = globalIndex < typedIndex;
                  const isCurrent = globalIndex === typedIndex;

                  return (
                    <div
                      key={`char-${globalIndex}-${char}`}
                      className={`relative flex items-center justify-center min-w-[24px] w-6.5 h-8.5 xs:w-7 xs:h-9 sm:w-8.5 sm:h-10.5 md:w-10 md:h-12 rounded-lg font-black text-sm xs:text-base sm:text-xl md:text-2xl transition-all duration-100 select-none ${
                        isTyped
                          ? 'bg-gradient-to-b from-cyan-300 via-cyan-400 to-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.85)] scale-95 border-b-2 border-cyan-700'
                          : isCurrent
                          ? hasError
                            ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,1)] scale-105 -translate-y-0.5 animate-[shake_0.15s_ease-in-out_2] border-2 border-white'
                            : 'bg-white text-slate-950 shadow-[0_0_25px_rgba(255,255,255,1),0_0_12px_rgba(56,189,248,0.9)] scale-105 -translate-y-0.5 border-2 border-cyan-400 ring-2 ring-cyan-400/40 animate-pulse'
                          : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                      }`}
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                      }}
                    >
                      {char}

                      {/* Active Bracket Frame under Current Target Key */}
                      {isCurrent && !hasError && (
                        <div className="absolute -bottom-1.5 w-full flex items-center justify-center">
                          <div className="w-3.5 h-0.5 bg-cyan-400 rounded-full animate-ping" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="mt-1.5 flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-mono text-slate-400">
          <span>TYPE TO STRIKE</span>
          <span className="text-slate-600">·</span>
          <span>[BACKSPACE] TO CLEAR</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400 font-bold">[SPACE] FOR SPECIAL</span>
        </div>
      </div>
    </div>
  );
};
