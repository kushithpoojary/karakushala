import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export default function AudioStoryPlayer({ storyText, artisanName, craftTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const speechRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setHasSpeechSupport(true);
    }
    return () => {
      stopPlayback();
    };
  }, []);

  const narrationText = storyText || `Namaskara! This authentic piece is handcrafted by ${artisanName}. Every stitch and lattice motif represents generations of sacred craft tradition in Karnataka.`;

  const startPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Pick an Indian English or available voice if found
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
      if (indianVoice) utterance.voice = indianVoice;

      utterance.onend = () => {
        stopPlayback();
      };

      utterance.onerror = () => {
        stopPlayback();
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    setIsPlaying(true);
    setProgress(0);

    const totalSeconds = Math.max(12, Math.round(narrationText.length / 15));
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed += 0.5;
      const pct = Math.min(100, Math.round((elapsed / totalSeconds) * 100));
      setProgress(pct);
      if (pct >= 100) {
        stopPlayback();
      }
    }, 500);
  };

  const stopPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 via-cream-100 to-amber-50 rounded-2xl border border-amber-200/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-900 flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-amber-800" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <span>Artisan Voice & Provenance Narration</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                ಕೇಳಿ (Listen)
              </span>
            </h4>
            <p className="text-[11px] text-stone-500">
              Narrated story of {artisanName}'s weaving heritage
            </p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isPlaying
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-amber-500 hover:bg-amber-600 text-stone-950 hover:text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Hear Story</span>
            </>
          )}
        </button>
      </div>

      {/* Animated Audio Waveform Bars */}
      <div className="flex items-center gap-1 h-6 my-2 px-1">
        {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 85, 40, 65, 90, 55, 30].map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${
              isPlaying ? 'bg-amber-600' : 'bg-amber-200'
            }`}
            style={{
              height: isPlaying ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.6)))}%` : '20%',
              animation: isPlaying ? `pulse 0.8s ease-in-out infinite ${i * 0.05}s` : 'none'
            }}
          />
        ))}
      </div>

      {/* Progress Bar & Quote */}
      <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[11px] italic text-stone-600 mt-2 line-clamp-2">
        "{narrationText}"
      </p>
    </div>
  );
}
