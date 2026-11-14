import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakText, stopSpeech } from '../utils/speechService';

export default function AudioStoryPlayer({ storyText, artisanName, craftTitle }) {
  const { currentLanguage, currentLangConfig, t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
    }
    return () => {
      stopPlayback();
    };
  }, []);

  const defaultStoryByLang = {
    en: `Namaskara! This authentic piece is handcrafted by ${artisanName || 'our master artisan'}. Every stitch and lattice motif represents generations of sacred craft tradition in Karnataka.`,
    kn: `ನಮಸ್ಕಾರ! ಈ ನೈಜ ಕಲಾಕೃತಿಯನ್ನು ನಮ್ಮ ಕಲಾಕಾರರಾದ ${artisanName || 'ಕರ್ನಾಟಕದ ಮಾಸ್ಟರ್ ನೇಯ್ಗೆದಾರರು'} ಕೈಯಾರೆ ರಚಿಸಿದ್ದಾರೆ. ಪ್ರತಿಯೊಂದು ಹೊಲಿಗೆ ಮತ್ತು ವಿನ್ಯಾಸವು ಕರ್ನಾಟಕದ ಪವಿತ್ರ ಕರಕುಶಲ ಪರಂಪರೆಯನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ.`,
    hi: `नमस्ते! इस प्रामाणिक कलाकृति को हमारे शिल्पकार ${artisanName || 'मास्टर कारीगर'} ने तैयार किया है। प्रत्येक सिलाई और रूपांकन कर्नाटक की पवित्र शिल्प परंपरा को दर्शाता है।`,
    ml: `നമസ്കാരം! ഈ ആധികാരിക കരകൗശല ഉൽപ്പന്നം ${artisanName || 'കരകൗശല വിദഗ്ദ്ധൻ'} സ്വന്തം കൈകളാൽ നിർമ്മിച്ചതാണ്. ഓരോ തുന്നലും രൂപകൽപ്പനയും കർണാടകയുടെ പവിത്രമായ പാരമ്പര്യത്തെ പ്രതിനിധീകരിക്കുന്നു.`
  };

  const activeLangKey = currentLanguage?.startsWith('kn') ? 'kn' :
                        currentLanguage?.startsWith('hi') ? 'hi' :
                        currentLanguage?.startsWith('ml') ? 'ml' : 'en';

  const narrationText = (activeLangKey === 'en' && storyText) 
    ? storyText 
    : (defaultStoryByLang[activeLangKey] || defaultStoryByLang.en);

  const startPlayback = () => {
    stopSpeech();

    speakText(narrationText, currentLanguage, {
      rate: 0.95,
      pitch: 1.0,
      onEnd: () => stopPlayback(),
      onError: () => stopPlayback()
    });

    setIsPlaying(true);
    setProgress(0);

    const totalSeconds = Math.max(10, Math.round(narrationText.length / 14));
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
    stopSpeech();
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
              <span>{t('artisanVoiceNarration') || 'Artisan Voice & Provenance Narration'}</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-semibold">
                {t('listen') || 'Listen'}
              </span>
            </h4>
            <p className="text-[11px] text-stone-500">
              {artisanName ? `${artisanName}'s weaving heritage story` : 'Authentic craft heritage story'}
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
              <span>{t('pause') || 'Pause'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('hearStory') || 'Hear Story'}</span>
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
