/**
 * Dynamic Content Translation Utility for Craft Stories & Dynamic Text
 * Ensures output audio matches the selected language (kn, hi, ml, en)
 */

import { getTranslation } from '../i18n/translations';

/**
 * Translate or adapt a craft story into the selected language
 * @param {string} originalText - The English database narration or story
 * @param {string} artisanName - The artisan's name
 * @param {string} craftTitle - The product title
 * @param {string} category - Craft category (Kasuti Embroidery, Beedu Craft, Coastal Wood & Shell)
 * @param {string} langCode - 'kn-IN', 'hi-IN', 'ml-IN', 'en-IN'
 */
export function getLocalizedCraftStory(originalText, artisanName, craftTitle, category, langCode = 'en-IN') {
  const langKey = (langCode || 'en-IN').split('-')[0].toLowerCase();

  // If language is English, return original narration or standard fallback
  if (langKey === 'en') {
    return originalText || `Namaskara! This authentic piece is handcrafted by ${artisanName || 'master artisans'}. Every stitch and lattice motif represents generations of sacred craft tradition in Karnataka.`;
  }

  // Multilingual translations for craft categories & narratives
  if (langKey === 'kn') {
    // Kannada
    if (category?.includes('Kasuti') || craftTitle?.includes('Kasuti') || craftTitle?.includes('Saree')) {
      return `ನಮಸ್ಕಾರ! ಈ ಅದ್ಭುತ ಕಸೂತಿ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಧಾರವಾಡದ ಮಾಸ್ಟರ್ ಕಲಾಕಾರರು'} ನೂಲಿನ ಎಣಿಕೆಯ ಪವಿತ್ರ ವಿಧಾನದಲ್ಲಿ ಕೈಯಾರೆ ರಚಿಸಿದ್ದಾರೆ. ಗೋಪುರ, ರಥ ಮತ್ತು ಕಮಲದ ವಿನ್ಯಾಸಗಳು ಶತಮಾನಗಳ ಕರ್ನಾಟಕದ ಪರಂಪರೆಯನ್ನು ಸಾರುತ್ತವೆ. ಪ್ರತಿಯೊಂದು ಹೊಲಿಗೆಯೂ ಶುದ್ಧ ಕೈಕೆಲಸವಾಗಿದೆ.`;
    }
    if (category?.includes('Beedu') || craftTitle?.includes('Beedu') || craftTitle?.includes('Lamp')) {
      return `ನಮಸ್ಕಾರ! ಉಡುಪಿಯ ಕರಾವಳಿ ಪರಂಪರೆಯ ಈ ಪವಿತ್ರ ಬೀಡು ಬೆತ್ತದ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಗಣೇಶ್ ದೇವಡಿಗ'} ಯಾವುದೇ ಮೊಳೆಗಳಿಲ್ಲದೆ ನೈಸರ್ಗಿಕವಾಗಿ ನೇಯ್ದಿದ್ದಾರೆ. ಇದರ ಜ್ಯಾಮಿತೀಯ ಬೆಳಕಿನ ವಿನ್ಯಾಸವು ದೇವಸ್ಥಾನದ ಮಂಗಳಕರ ಪರಿಸರವನ್ನು ಮನೆಯೊಳಗೆ ತರುತ್ತದೆ.`;
    }
    if (category?.includes('Wood') || category?.includes('Shell') || craftTitle?.includes('Diya')) {
      return `ನಮಸ್ಕಾರ! ಉತ್ತರ ಕನ್ನಡದ ಕಡಲತೀರದ ತೆಂಗಿನ ಚಿಪ್ಪು ಮತ್ತು ನೈಸರ್ಗಿಕ ಮರದಿಂದ ಈ ವಿಶಿಷ್ಟ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಮಾಸ್ಟರ್ ಕುಶಲಕರ್ಮಿಗಳು'} ನೈಸರ್ಗಿಕ ಎಣ್ಣೆ ಮತ್ತು ನದಿಯ ಮರಳಿನಿಂದ ಹೊಳಪು ನೀಡಿ ತಯಾರಿಸಿದ್ದಾರೆ. ಪರಿಸರಸ್ನೇಹಿ ಮತ್ತು ಚಿರಸ್ಥಾಯಿ ಕಲೆಯಾಗಿದೆ.`;
    }
    return `ನಮಸ್ಕಾರ! ಈ ಅಸಲಿ ಕರಕುಶಲ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಕರ್ನಾಟಕದ ಕಲಾಕಾರರು'} ಅತ್ಯಂತ ಶ್ರದ್ಧೆಯಿಂದ ಕೈಯಾರೆ ನಿರ್ಮಿಸಿದ್ದಾರೆ. ನಿಮ್ಮ ಪ್ರತಿಯೊಂದು ಖರೀದಿಯೂ ಗ್ರಾಮೀಣ ಕಲಾ ಕುಟುಂಬಗಳಿಗೆ ನೇರವಾಗಿ ತಲುಪುತ್ತದೆ.`;
  }

  if (langKey === 'hi') {
    // Hindi
    if (category?.includes('Kasuti') || craftTitle?.includes('Kasuti') || craftTitle?.includes('Saree')) {
      return `नमस्ते! यह प्रामाणिक कसूती कढ़ाई कलाकृति ${artisanName || 'मास्टर शिल्पकार'} द्वारा धागों की बारीक गिनती से हाथ से तैयार की गई है। इसके मंदिर, रथ और कमल के रूपांकन सदियों पुरानी कर्नाटक की समृद्ध परंपरा को दर्शाते हैं।`;
    }
    if (category?.includes('Beedu') || craftTitle?.includes('Beedu') || craftTitle?.includes('Lamp')) {
      return `नमस्ते! उडुपी की तटीय परंपरा की यह पवित्र बीडू बेंत कलाकृति ${artisanName || 'गणेश देवडिगा'} द्वारा बिना किसी कील के प्राकृतिक रूप से बुनी गई है। इसके ज्यामितीय पैटर्न घर में एक शांत और दिव्य वातावरण लाते हैं।`;
    }
    if (category?.includes('Wood') || category?.includes('Shell') || craftTitle?.includes('Diya')) {
      return `नमस्ते! उत्तर कन्नड़ के समुद्री तटों के नारियल के खोल और प्राकृतिक लकड़ी से यह कलाकृति ${artisanName || 'कारीगरों'} द्वारा तैयार की गई है। इसे प्राकृतिक तेलों से पॉलिश किया गया है जो पर्यावरण के अनुकूल है।`;
    }
    return `नमस्ते! यह प्रामाणिक हस्तशिल्प ${artisanName || 'कर्नाटक के कारीगरों'} द्वारा पूरी निष्ठा से बनाया गया है। आपकी खरीदारी सीधे ग्रामीण कारीगर परिवारों को सशक्त बनाती है।`;
  }

  if (langKey === 'ml') {
    // Malayalam
    if (category?.includes('Kasuti') || craftTitle?.includes('Kasuti') || craftTitle?.includes('Saree')) {
      return `നമസ്കാരം! കസൂതി എംബ്രോയിഡറിയിൽ തീർത്ത ഈ വിശിഷ്ട കലാസൃഷ്ടി ${artisanName || 'വിദഗ്ദ്ധ കരകൗശലത്തൊഴിലാളി'} നൂലുകൾ എണ്ണി കൈകൊണ്ട് നെയ്തതാണ്. ക്ഷേത്ര ഗോപുരങ്ങളുടെയും രഥങ്ങളുടെയും രൂപങ്ങൾ കർണാടകയുടെ സമ്പന്നമായ പാരമ്പര്യത്തെ വിളിച്ചോതുന്നു.`;
    }
    if (category?.includes('Beedu') || craftTitle?.includes('Beedu') || craftTitle?.includes('Lamp')) {
      return `നമസ്കാരം! ഉഡുപ്പിയുടെ തീരദേശ പാരമ്പര്യമായ ഈ വിശുദ്ധ ബീഡു ചൂരൽ ശില്പം ${artisanName || 'ഗണേഷ് ദേവഡിഗ'} ആണികളൊന്നും ഉപയോഗിക്കാതെ സ്വാഭാവികമായി നെയ്തെടുത്തതാണ്. ഇതിന്റെ ജ്യാമിതീയ ഡിസൈൻ വീടുകളിൽ ദൈവിക വെളിച്ചം പരത്തുന്നു.`;
    }
    if (category?.includes('Wood') || category?.includes('Shell') || craftTitle?.includes('Diya')) {
      return `നമസ്കാരം! ഉത്തര കന്നഡ തീരത്തെ ചിരട്ടയും തടിയും ഉപയോഗിച്ച് ${artisanName || 'കരകൗശല വിദഗ്ദ്ധർ'} നിർമ്മിച്ചതാണ് ഈ ഉൽപ്പന്നം. പ്രകൃതിദത്ത എണ്ണകൾ പുരട്ടി പോളിഷ് ചെയ്ത പരിസ്ഥിതി സൗഹൃദ സൃഷ്ടിയാണിത്.`;
    }
    return `നമസ്കാരം! കർണാടകയിലെ പരമ്പരാഗത കരകൗശല വിദഗ്ദ്ധർ ${artisanName || 'കലാകാരന്മാർ'} ഭക്തിയോടെ നിർമ്മിച്ചതാണ് ഈ വിശിഷ്ട സൃഷ്ടി. നിങ്ങളുടെ ഓരോ വാങ്ങലും ഗ്രാമീണ കുടുംബങ്ങൾക്ക് തുണയാകുന്നു.`;
  }

  return originalText;
}
