const fs = require('fs');

const path = 'd:/colossus/karakushala/frontend/src/components/GuidedListingForm.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Destructure speakLocalized from useApp
content = content.replace(
  "  const { formatINR, showToast, currentLanguage, currentLangConfig, t } = useApp();",
  "  const { formatINR, showToast, currentLanguage, currentLangConfig, speakLocalized, t } = useApp();"
);

// 2. Replace lines 118-134
const oldFeedbackCRLF = `    // Audio feedback announcement in selected regional language
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const feedbackPhrases = {
          kn: \`ದಾಖಲಿಸಲಾಗಿದೆ: \${recordedValue}\`,
          hi: \`दर्ज किया गया: \${recordedValue}\`,
          ml: \`രേഖപ്പെടുത്തി: \${recordedValue}\`,
          en: \`Recorded: \${recordedValue}\`
        };
        const textToSpeak = feedbackPhrases[currentLanguage] || feedbackPhrases.en;
        const u = new SpeechSynthesisUtterance(textToSpeak);
        u.lang = currentLangConfig?.ttsVoice || 'en-IN';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }`;

const newFeedback = `    // Audio feedback announcement in selected regional language
    speakLocalized('artisanHeardFieldVoice', { value: recordedValue });`;

content = content.replace(oldFeedbackCRLF, newFeedback);
content = content.replace(oldFeedbackCRLF.replace(/\r\n/g, '\n'), newFeedback);

// 3. Update VoiceInputButton text and titles
content = content.replace(
  "title={`Click to speak ${fieldKey} in Kannada/English (ಧ್ವನಿ ಮೂಲಕ ಭರ್ತಿ)`}",
  "title={`Click to speak ${fieldKey}`}"
);
content = content.replace(
  '<span className="text-[11px]">Listening (ಮಾತನಾಡಿ)...</span>',
  '<span className="text-[11px]">Listening...</span>'
);
content = content.replace(
  '<span className="text-[11px]">Voice (ಧ್ವನಿ)</span>',
  '<span className="text-[11px]">Voice</span>'
);
content = content.replace(
  'showToast(`🎙️ Listening for ${fieldName} (${fieldLabelKannada})... ಮಾತನಾಡಿ`, \'info\');',
  'showToast(`🎙️ Listening for ${fieldName}... Speak now`, \'info\');'
);
content = content.replace(
  '<strong>ಧ್ವನಿ ಇನ್ಪುಟ್ ಸಕ್ರಿಯವಾಗಿದೆ (Voice Input Active):</strong>',
  '<strong>Voice Input Active:</strong>'
);

fs.writeFileSync(path, content, 'utf8');
console.log('GuidedListingForm.jsx updated successfully');
