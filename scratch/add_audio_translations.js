const fs = require('fs');

const filePath = 'd:/colossus/karakushala/frontend/src/i18n/translations.js';
let content = fs.readFileSync(filePath, 'utf8');

const additions = {
  en: {
    voiceGuidance: 'Audio',
    artisanVoiceNarration: 'Artisan Voice & Provenance Narration',
    listen: 'Listen',
    hearStory: 'Hear Story',
    pause: 'Pause',
    careRecordPromptVoice: 'Please speak your grievance clearly. Recording has started.',
    artisanMetricsVoice: 'Welcome {name}. Your total earnings are {earnings} rupees. Check your new orders here.'
  },
  kn: {
    voiceGuidance: 'ಧ್ವನಿ',
    artisanVoiceNarration: 'ಕಲಾಕಾರರ ಧ್ವನಿ ಮತ್ತು ಕಲಾಕೃತಿಯ ಇತಿಹಾಸ',
    listen: 'ಕೇಳಿ',
    hearStory: 'ಕಥೆ ಕೇಳಿ',
    pause: 'ವಿರಾಮ',
    careRecordPromptVoice: 'ನಿಮ್ಮ ದೂರನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ. ರೆಕಾರ್ಡಿಂಗ್ ಆರಂಭವಾಗಿದೆ.',
    artisanMetricsVoice: 'ನಮಸ್ಕಾರ {name}. ನಿಮ್ಮ ಒಟ್ಟು ಆದಾಯ {earnings} ರೂಪಾಯಿಗಳು. ನಿಮ್ಮ ಹೊಸ ಆರ್ಡರ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.'
  },
  hi: {
    voiceGuidance: 'ध्वनि',
    artisanVoiceNarration: 'कारीगर की आवाज और शिल्प का इतिहास',
    listen: 'सुनें',
    hearStory: 'कहानी सुनें',
    pause: 'रोकें',
    careRecordPromptVoice: 'कृपया अपनी शिकायत स्पष्ट रूप से बोलें। रिकॉर्डिंग शुरू हो गई है।',
    artisanMetricsVoice: 'नमस्ते {name}। आपकी कुल कमाई {earnings} रुपये है। अपने नए ऑर्डर यहां देखें।'
  },
  ml: {
    voiceGuidance: 'ശബ്ദം',
    artisanVoiceNarration: 'കരകൗശല വിദഗ്ദ്ധന്റെ ശബ്ദവും ചരിത്രവും',
    listen: 'കേൾക്കൂ',
    hearStory: 'കഥ കേൾക്കൂ',
    pause: 'താൽക്കാലികമായി നിർത്തുക',
    careRecordPromptVoice: 'ദയവായി നിങ്ങളുടെ പരാതി വ്യക്തമായി പറയുക. റെക്കോർഡിംഗ് ആരംഭിച്ചു.',
    artisanMetricsVoice: 'നമസ്കാരം {name}. താങ്കളുടെ ആകെ വരുമാനം {earnings} രൂപയാണ്. താങ്കളുടെ പുതിയ ഓർഡറുകൾ ഇവിടെ പരിശോധിക്കാം.'
  }
};

for (const [lang, keys] of Object.entries(additions)) {
  const searchAnchor = lang === 'en' ? "voiceListening: 'Listening... Please speak now'," :
                       lang === 'kn' ? "voiceListening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ದಯವಿಟ್ಟು ಮಾತನಾಡಿ'," :
                       lang === 'hi' ? "voiceListening: 'सुन रहे हैं... कृपया अब बोलें'," :
                       "voiceListening: 'ശ്രദ്ധിക്കുന്നു... ദയവായി ഇപ്പോൾ സംസാരിക്കുക',";
  
  const entriesStr = Object.entries(keys)
    .map(([k, v]) => `    ${k}: '${v}',`)
    .join('\r\n');

  if (content.includes(searchAnchor)) {
    content = content.replace(searchAnchor, searchAnchor + '\r\n' + entriesStr);
    console.log('Added audio keys for ' + lang);
  } else {
    console.log('Anchor not found for ' + lang);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('translations.js updated successfully with audio keys');
