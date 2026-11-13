import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VoiceSearchBar({ searchQuery, onSearchChange, className = "" }) {
  const { showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const onSearchChangeRef = useRef(onSearchChange);
  const showToastRef = useRef(showToast);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Default to Indian English, handles Indian accents smoothly

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const clean = transcript.replace(/[.,!?]/g, '').trim();
          onSearchChangeRef.current?.(clean);
          showToastRef.current?.(`🎙️ Heard: "${clean}"`, 'success');

          // Audio confirmation
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Searching for ${clean}`);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
          }
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showToast('Microphone access was denied. Please allow microphone in browser.', 'warning');
        } else if (event.error === 'no-speech') {
          showToast('No speech detected. Please speak clearly into the microphone.', 'info');
        } else {
          showToast('Could not recognize voice. Please try typing.', 'info');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!speechSupported) {
      showToast('Speech Recognition not supported in this browser. Please try Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        showToast('🎙️ Listening... Speak now (ಮಾತನಾಡಿ)', 'info');
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const quickPills = [
    'Kasuti Saree',
    'Beedu Lamp',
    'Coconut Diya',
    'Peacock Tapestry',
    'Wind Chime',
    'Navalgund'
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center w-full">
        {/* Search Icon */}
        <span className="absolute left-3.5 text-stone-400 pointer-events-none">
          <Search className="w-4 h-4 text-terracotta-600" />
        </span>

        {/* Input */}
        <input
          type="text"
          placeholder={isListening ? "Listening... ಮಾತನಾಡಿ (e.g. Kasuti saree)..." : "Search Kasuti saree, Beedu lamp, Dharwad tapestry, Diya..."}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full bg-white border rounded-full py-2.5 pl-10 pr-20 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 shadow-inner transition-all ${
            isListening
              ? 'border-red-500 ring-2 ring-red-400/50 bg-red-50/30'
              : 'border-cream-300 focus:border-terracotta-500'
          }`}
        />

        {/* Action Buttons inside Input */}
        <div className="absolute right-2 flex items-center gap-1">
          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice Search Microphone Button */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`p-2 rounded-full transition-all flex items-center justify-center ${
              isListening
                ? 'bg-red-600 text-white animate-bounce shadow-md'
                : 'bg-terracotta-100 hover:bg-terracotta-200 text-terracotta-700'
            }`}
            title={isListening ? "Listening... Click to stop" : "Voice Search (ಧ್ವನಿ ಹುಡುಕಾಟ) - Speak into mic"}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Listening Status Indicator Banner */}
      {isListening && (
        <div className="mt-1.5 px-3 py-1 bg-red-100 border border-red-300 rounded-xl flex items-center justify-between text-[11px] text-red-900 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="font-bold">Listening to your voice... Speak clearly (ಮಾತನಾಡಿ)</span>
          </div>
          <span className="text-[10px] text-red-700 font-medium">Say e.g. "Kasuti Saree" or "Lamp"</span>
        </div>
      )}
    </div>
  );
}
