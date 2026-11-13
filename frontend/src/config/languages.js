/**
 * Central Language Configuration for KaraKushala
 * Config-driven multilingual support for Audio Features (STT / TTS) and UI.
 * Adding any new language takes a single entry here.
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en-IN',
    id: 'en',
    displayName: 'English',
    nativeName: 'English',
    sttLocale: 'en-IN',
    ttsLang: 'en-IN',
    voicePreferencePrefixes: ['en-IN', 'en_IN', 'en-GB', 'en-US', 'en'],
    fontClass: 'font-sans',
    flag: '🇮🇳'
  },
  {
    code: 'kn-IN',
    id: 'kn',
    displayName: 'Kannada',
    nativeName: 'ಕನ್ನಡ (Kannada)',
    sttLocale: 'kn-IN',
    ttsLang: 'kn-IN',
    voicePreferencePrefixes: ['kn-IN', 'kn_IN', 'kn'],
    fontClass: 'font-kannada',
    flag: '🟡'
  },
  {
    code: 'hi-IN',
    id: 'hi',
    displayName: 'Hindi',
    nativeName: 'हिन्दी (Hindi)',
    sttLocale: 'hi-IN',
    ttsLang: 'hi-IN',
    voicePreferencePrefixes: ['hi-IN', 'hi_IN', 'hi'],
    fontClass: 'font-devanagari',
    flag: '🇮🇳'
  },
  {
    code: 'ml-IN',
    id: 'ml',
    displayName: 'Malayalam',
    nativeName: 'മലയാളം (Malayalam)',
    sttLocale: 'ml-IN',
    ttsLang: 'ml-IN',
    voicePreferencePrefixes: ['ml-IN', 'ml_IN', 'ml'],
    fontClass: 'font-malayalam',
    flag: '🌴'
  }
];

export const DEFAULT_LANGUAGE_CODE = 'en-IN';

export function getLanguageByCode(code) {
  if (!code) return SUPPORTED_LANGUAGES[0];
  const clean = code.trim().toLowerCase();
  return (
    SUPPORTED_LANGUAGES.find(
      l => l.code.toLowerCase() === clean || l.id.toLowerCase() === clean
    ) || SUPPORTED_LANGUAGES[0]
  );
}
