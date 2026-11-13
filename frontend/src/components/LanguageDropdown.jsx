import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

export default function LanguageDropdown({ className = "" }) {
  const { currentLanguage, currentLangConfig, setLanguage, SUPPORTED_LANGUAGES } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (langCode) => {
    setLanguage(langCode, true);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-cream-200 hover:bg-cream-300 border border-cream-300 text-stone-800 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 btn-press"
        title="Change Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-terracotta-600 shrink-0" />
        <span className="hidden sm:inline font-semibold">
          {currentLangConfig?.nativeName || 'English'}
        </span>
        <span className="sm:hidden font-semibold">
          {currentLangConfig?.id?.toUpperCase() || 'EN'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-2xl bg-white shadow-2xl border border-cream-300 py-1.5 z-50 animate-scaleUp">
          <div className="px-3.5 py-2 border-b border-cream-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Select Language • ಭಾಷೆ • भाषा • ഭാഷ
          </div>

          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-terracotta-50 text-terracotta-900 font-bold'
                      : 'text-stone-700 hover:bg-cream-100 hover:text-stone-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none">{lang.flag}</span>
                    <div>
                      <div className="leading-tight">{lang.nativeName}</div>
                      <div className="text-[10px] text-stone-400 font-normal">
                        STT: {lang.sttLocale} • TTS: {lang.ttsLang}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-terracotta-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
