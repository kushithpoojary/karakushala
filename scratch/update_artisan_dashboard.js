const fs = require('fs');

const path = 'd:/colossus/karakushala/frontend/src/components/ArtisanDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Destructure speakLocalized, t from useApp
content = content.replace(
  "    openCustomerCare,\r\n    audioVoiceAssistance\r\n  } = useApp();",
  "    openCustomerCare,\r\n    audioVoiceAssistance,\r\n    speakLocalized,\r\n    t\r\n  } = useApp();"
);
content = content.replace(
  "    openCustomerCare,\n    audioVoiceAssistance\n  } = useApp();",
  "    openCustomerCare,\n    audioVoiceAssistance,\n    speakLocalized,\n    t\n  } = useApp();"
);

// 2. Replace speakGuidance implementation
const oldSpeakGuidanceCRLF = `  const speakGuidance = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'kn-IN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };`;

const newSpeakGuidance = `  const speakGuidance = () => {
    speakLocalized('artisanMetricsVoice', {
      name: activeArtisan?.name || '',
      earnings: dashboardData?.metrics?.totalEarningsINR || 0
    });
  };`;

content = content.replace(oldSpeakGuidanceCRLF, newSpeakGuidance);
content = content.replace(oldSpeakGuidanceCRLF.replace(/\r\n/g, '\n'), newSpeakGuidance);

// 3. Update the button call
content = content.replace(
  "onClick={() => speakGuidance(`ನಮಸ್ಕಾರ ${activeArtisan.name}. ನಿಮ್ಮ ಒಟ್ಟು ಆದಾಯ ${dashboardData?.metrics?.totalEarningsINR || 0} ರೂಪಾಯಿಗಳು. ನಿಮ್ಮ ಹೊಸ ಆರ್ಡರ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.`)}",
  "onClick={speakGuidance}"
);

content = content.replace('title="Read Dashboard Aloud in Kannada"', 'title="Audio Summary"');
content = content.replace('<span>ಧ್ವನಿ (Listen)</span>', '<span>{t(\'listen\')}</span>');

fs.writeFileSync(path, content, 'utf8');
console.log('ArtisanDashboard.jsx updated successfully');
