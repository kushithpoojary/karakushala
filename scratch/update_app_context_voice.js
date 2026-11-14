const fs = require('fs');

const path = 'd:/colossus/karakushala/frontend/src/context/AppContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldVoiceCRLF = `    if ('speechSynthesis' in window && audioVoiceAssistance) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(\`ನಮಸ್ಕಾರ \${artisan.name}. ಕಲಾಕಾರರ ಖಾತೆಗೆ ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.\`);
      u.lang = 'kn-IN';
      window.speechSynthesis.speak(u);
    }`;

const newVoice = `    if (audioVoiceAssistance) {
      speakLocalized('artisanLoginGreetingVoice', { name: artisan.name });
    }`;

content = content.replace(oldVoiceCRLF, newVoice);
content = content.replace(oldVoiceCRLF.replace(/\r\n/g, '\n'), newVoice);

fs.writeFileSync(path, content, 'utf8');
console.log('AppContext.jsx updated successfully with localized artisan login voice');
