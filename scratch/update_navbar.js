const fs = require('fs');

const navbarPath = 'd:/colossus/karakushala/frontend/src/components/Navbar.jsx';
let content = fs.readFileSync(navbarPath, 'utf8');

// 1. Import LanguageDropdown
if (!content.includes("import LanguageDropdown")) {
  content = content.replace(
    "import VoiceSearchBar from './VoiceSearchBar';",
    "import VoiceSearchBar from './VoiceSearchBar';\r\nimport LanguageDropdown from './LanguageDropdown';"
  );
  if (!content.includes("import LanguageDropdown")) {
    content = content.replace(
      "import VoiceSearchBar from './VoiceSearchBar';",
      "import VoiceSearchBar from './VoiceSearchBar';\nimport LanguageDropdown from './LanguageDropdown';"
    );
  }
}

// 2. Destructure speakLocalized from useApp
content = content.replace(
  "    showToast,\r\n    t\r\n  } = useApp();",
  "    showToast,\r\n    speakLocalized,\r\n    t\r\n  } = useApp();"
);
content = content.replace(
  "    showToast,\n    t\n  } = useApp();",
  "    showToast,\n    speakLocalized,\n    t\n  } = useApp();"
);

// 3. Update toggleVoice to use speakLocalized
const oldToggleVoiceCRLF = `  const toggleVoice = () => {
    const next = !audioVoiceAssistance;
    setAudioVoiceAssistance(next);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (next) {
        showToast('ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಸಕ್ರಿಯವಾಗಿದೆ (Voice Guidance Enabled)', 'info');
        const u = new SpeechSynthesisUtterance("ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಸಕ್ರಿಯವಾಗಿದೆ. Voice guidance is active for KaraKushala artisan marketplace.");
        u.lang = 'kn-IN';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      } else {
        showToast('Voice guidance turned off', 'info');
      }
    }
  };`;

const newToggleVoice = `  const toggleVoice = () => {
    const next = !audioVoiceAssistance;
    setAudioVoiceAssistance(next);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (next) {
        showToast(t('voiceGuidanceActive'), 'info');
        speakLocalized('voiceGuidanceActive');
      } else {
        showToast(t('voiceGuidanceDisabled'), 'info');
      }
    }
  };`;

content = content.replace(oldToggleVoiceCRLF, newToggleVoice);
content = content.replace(oldToggleVoiceCRLF.replace(/\r\n/g, '\n'), newToggleVoice);

// 4. Mount LanguageDropdown before Voice Guidance Button
const oldControlsCRLF = `          {/* Controls: Mode Switcher, Login, Care & Cart (Always comfortably fits in viewport) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">

            {/* Accessibility Voice Guidance Button */}`;

const newControls = `          {/* Controls: Mode Switcher, Login, Care & Cart (Always comfortably fits in viewport) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">

            {/* Multilingual Selector Dropdown */}
            <LanguageDropdown />

            {/* Accessibility Voice Guidance Button */}`;

content = content.replace(oldControlsCRLF, newControls);
content = content.replace(oldControlsCRLF.replace(/\r\n/g, '\n'), newControls);

// 5. Update Voice button title and label
content = content.replace(
  'title={audioVoiceAssistance ? "Voice Guidance Active (ಧ್ವನಿ ಸಕ್ರಿಯ)" : "Enable Audio Guidance (ಧ್ವನಿ ಸಹಾಯ)"}',
  "title={audioVoiceAssistance ? t('voiceGuidanceEnabledTitle') : t('enableVoiceGuidanceTitle')}"
);
content = content.replace(
  '<span className="hidden 2xl:inline">ಧ್ವನಿ (Audio)</span>',
  '<span className="hidden 2xl:inline">{t(\'voiceGuidance\')}</span>'
);

fs.writeFileSync(navbarPath, content, 'utf8');
console.log('Navbar.jsx updated successfully');
