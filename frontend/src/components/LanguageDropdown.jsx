import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Check, ChevronDown, Languages } from 'lucide-react';

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
        className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300/90 text-stone-900 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 btn-press"
        title="Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക"
        aria-expanded={isOpen}
      >
        <Languages className="w-4 h-4 text-terracotta-600 shrink-0" />
        <span className="font-semibold select-none flex items-center gap-1">
          <span className="text-sm">{currentLangConfig?.flag}</span>
          <span className="hidden xs:inline">{currentLangConfig?.nativeName || 'English'}</span>
          <span className="xs:hidden">{currentLangConfig?.id?.toUpperCase() || 'EN'}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-cream-300 py-2 z-50 animate-scaleUp">
          <div className="px-4 py-2 border-b border-cream-200 flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            <span>Select Language</span>
            <span className="text-terracotta-600 font-semibold">ಭಾಷೆ • भाषा • ഭാഷ</span>
          </div>

          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-amber-100/80 text-amber-950 font-bold border-l-4 border-terracotta-600'
                      : 'text-stone-700 hover:bg-cream-100 hover:text-stone-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg select-none">{lang.flag}</span>
                    <div>
                      <div className="leading-tight font-bold">{lang.nativeName}</div>
                      <div className="text-[10px] text-stone-500 font-normal mt-0.5">
                        Audio & Text • {lang.sttLocale}
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
