const fs = require('fs');

const path = 'd:/colossus/karakushala/frontend/src/components/ArtisanLoginModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Destructure currentLanguage, currentLangConfig, speakLocalized, t
content = content.replace(
  "    showToast,\r\n    audioVoiceAssistance \r\n  } = useApp();",
  "    showToast,\r\n    audioVoiceAssistance,\r\n    currentLanguage,\r\n    currentLangConfig,\r\n    speakLocalized,\r\n    t\r\n  } = useApp();"
);
content = content.replace(
  "    showToast,\n    audioVoiceAssistance \n  } = useApp();",
  "    showToast,\n    audioVoiceAssistance,\n    currentLanguage,\n    currentLangConfig,\n    speakLocalized,\n    t\n  } = useApp();"
);

// 2. Update playKannadaAudio to use speakLocalized if available or speakText
content = content.replace(
  `  const playKannadaAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }
  };`,
  `  const playKannadaAudio = (text) => {
    speakLocalized(text, {}, true);
  };`
);

// 3. Update line 277: replace raw SpeechSynthesisUtterance with speakLocalized
const oldRecordAudioCRLF = `    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(\`Recorded \${recordedValue}\`);
      window.speechSynthesis.rate = 0.95;
      window.speechSynthesis.speak(u);
    }`;

const newRecordAudio = `    speakLocalized('artisanHeardFieldVoice', { value: recordedValue });`;

content = content.replace(oldRecordAudioCRLF, newRecordAudio);
content = content.replace(oldRecordAudioCRLF.replace(/\r\n/g, '\n'), newRecordAudio);

// 4. Update line 303: recognition.lang
content = content.replace(
  "      recognition.lang = 'en-IN';",
  "      recognition.lang = currentLangConfig?.sttLocale || (currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ml' ? 'ml-IN' : 'en-IN');"
);

// 5. Update line 382: OTP audio
content = content.replace(
  "playKannadaAudio(`ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ. ಡೆಮೊ ಕೋಡ್ ಒಂದು ಎರಡು ಮೂರು ನಾಲ್ಕು.`);",
  "speakLocalized('artisanOtpSentVoice');"
);

// 6. Update line 524: portal intro audio
content = content.replace(
  'playKannadaAudio("ಕಲಾಕಾರರ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಒಂದು ಕ್ಲಿಕ್ ಡೆಮೊ ಮೂಲಕ ಲಾಗಿನ್ ಆಗಿ ನಿಮ್ಮ ಕಲಾಕೃತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.")',
  "speakLocalized('artisanGuidanceVoice')"
);

// 7. Update VoiceButton titles
content = content.replace(
  "title={`Click to speak ${label} (ಧ್ವನಿ ಮೂಲಕ ಭರ್ತಿ)`}",
  "title={`Click to speak ${label}`}"
);
content = content.replace(
  "<span>Voice (ಧ್ವನಿ)</span>",
  "<span>Voice</span>"
);

fs.writeFileSync(path, content, 'utf8');
console.log('ArtisanLoginModal.jsx updated successfully');
