const fs = require('fs');

const path = 'd:/colossus/karakushala/frontend/src/components/CheckoutModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Destructure speakLocalized, t
content = content.replace(
  "    audioVoiceAssistance\r\n  } = useApp();",
  "    audioVoiceAssistance,\r\n    speakLocalized,\r\n    t\r\n  } = useApp();"
);
content = content.replace(
  "    audioVoiceAssistance\n  } = useApp();",
  "    audioVoiceAssistance,\n    speakLocalized,\n    t\n  } = useApp();"
);

// 2. Replace playConfirmationChime
const oldChimeCRLF = `  // Play audio confirmation chime if speech is supported
  const playConfirmationChime = (text) => {
    if ('speechSynthesis' in window && audioVoiceAssistance) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };`;

const newChime = `  // Central Spoken Order Confirmation
  const playConfirmationChime = (key) => {
    if (audioVoiceAssistance) {
      speakLocalized(key);
    }
  };`;

content = content.replace(oldChimeCRLF, newChime);
content = content.replace(oldChimeCRLF.replace(/\r\n/g, '\n'), newChime);

// 3. Update calls in order placement
content = content.replace(
  "playConfirmationChime('ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಡೆಲಿವರಿ ಸಮಯದಲ್ಲಿ ಹಣ ಪಾವತಿಸಿ.');",
  "playConfirmationChime('orderPlacedCodVoice');"
);
content = content.replace(
  "playConfirmationChime('ಧನ್ಯವಾದಗಳು! ಯುಪಿಐ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ.');",
  "playConfirmationChime('orderPlacedUpiVoice');"
);

fs.writeFileSync(path, content, 'utf8');
console.log('CheckoutModal.jsx updated successfully');
