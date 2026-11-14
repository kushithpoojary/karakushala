const fs = require('fs');

const path = 'd:/colossus/karakushala/frontend/src/components/CustomerCareModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Destructure speakLocalized, t from useApp
content = content.replace(
  "    showToast,\r\n    audioVoiceAssistance \r\n  } = useApp();",
  "    showToast,\r\n    audioVoiceAssistance,\r\n    speakLocalized,\r\n    t\r\n  } = useApp();"
);
content = content.replace(
  "    showToast,\n    audioVoiceAssistance \n  } = useApp();",
  "    showToast,\n    audioVoiceAssistance,\n    speakLocalized,\n    t\n  } = useApp();"
);

// 2. Update line 90: rec.lang
content = content.replace(
  "      rec.lang = 'en-IN'; // Indian English / Regional handling",
  "      rec.lang = currentLangConfig?.sttLocale || (currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ml' ? 'ml-IN' : 'en-IN');"
);

// 3. Replace speakKannada
const oldSpeakKannadaCRLF = `  // Audio Guidance in Kannada
  const speakKannada = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };`;

const newSpeakKannada = `  // Central Spoken Guidance
  const speakKannada = (text) => {
    speakLocalized(text, {}, true);
  };`;

content = content.replace(oldSpeakKannadaCRLF, newSpeakKannada);
content = content.replace(oldSpeakKannadaCRLF.replace(/\r\n/g, '\n'), newSpeakKannada);

// 4. Update prompt voice
content = content.replace(
  'speakKannada("ನಿಮ್ಮ ದೂರನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ. ರೆಕಾರ್ಡಿಂಗ್ ಆರಂಭವಾಗಿದೆ.");',
  "speakLocalized('careRecordPromptVoice');"
);

content = content.replace(
  "speakKannada(`ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ದೂರು ಸಂಖ್ಯೆ ${ticketId} ದಾಖಲಾಗಿದೆ. ನಮ್ಮ ಗ್ರಾಹಕ ಸೇವಾ ತಂಡ ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲಿದೆ.`);",
  "speakLocalized('careTicketCreatedVoice', { ticketId });"
);

// 5. Clean up hardcoded Kannada strings
content = content.replace(
  "showToast('🎙️ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಆರಂಭವಾಗಿದೆ (Voice recording started)...', 'info');",
  "showToast('🎙️ Voice recording started...', 'info');"
);
content = content.replace(
  "showToast('✓ ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಆಗಿದೆ! Voice message saved.', 'success');",
  "showToast('✓ Voice message recorded & saved.', 'success');"
);
content = content.replace(
  "<span>Start Voice Recording (ಮಾತನಾಡಿ)</span>",
  "<span>Start Voice Recording</span>"
);

fs.writeFileSync(path, content, 'utf8');
console.log('CustomerCareModal.jsx updated successfully');
