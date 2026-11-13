/**
 * Unified Multilingual Speech Synthesis & Voice Selection Service
 * Handles Kannada (kn-IN), Hindi (hi-IN), Malayalam (ml-IN), and English (en-IN)
 */

import { getLanguageByCode } from '../config/languages';

let cachedVoices = [];

// Cache and update voices when browser loads them
function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Find the optimal SpeechSynthesis voice for a given language code
 * @param {string} langCode - e.g. 'kn-IN', 'hi-IN', 'ml-IN', 'en-IN'
 * @returns {SpeechSynthesisVoice|null}
 */
export function getBestVoice(langCode = 'en-IN') {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  const langConfig = getLanguageByCode(langCode);
  const prefixes = langConfig.voicePreferencePrefixes || [langCode.split('-')[0]];

  // 1. Exact match on full locale (e.g., 'kn-IN' or 'kn_IN')
  for (const pref of prefixes) {
    const exactMatch = voices.find(
      v => v.lang && (v.lang.toLowerCase() === pref.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === pref.toLowerCase())
    );
    if (exactMatch) return exactMatch;
  }

  // 2. Prefix match (e.g., voice starts with 'kn' or 'hi' or 'ml')
  const baseLang = langConfig.id; // 'kn', 'hi', 'ml', 'en'
  const prefixMatch = voices.find(
    v => v.lang && v.lang.toLowerCase().startsWith(baseLang.toLowerCase())
  );
  if (prefixMatch) return prefixMatch;

  // 3. Name match for native or localized language names (e.g. 'kannada', 'hindi', 'malayalam')
  const nameKeywords = {
    kn: ['kannada', 'kn-in', 'kannada india'],
    hi: ['hindi', 'hi-in', 'kalpana', 'hemant', 'hindi india'],
    ml: ['malayalam', 'ml-in', 'malayalam india'],
    en: ['india', 'en-in', 'ravi', 'heera', 'english india']
  };

  const keywords = nameKeywords[baseLang] || [];
  for (const kw of keywords) {
    const nameMatch = voices.find(v => v.name && v.name.toLowerCase().includes(kw));
    if (nameMatch) return nameMatch;
  }

  // 4. Fallback to Indian English or first available voice if regional voice pack isn't installed
  const indianVoice = voices.find(v => v.lang && (v.lang.includes('IN') || v.name.toLowerCase().includes('india')));
  if (indianVoice) return indianVoice;

  return voices[0] || null;
}

/**
 * Speak text in the specified language
 * @param {string} text - The spoken text (already localized)
 * @param {string} langCode - e.g. 'kn-IN', 'hi-IN', 'ml-IN', 'en-IN'
 * @param {object} options - { rate, pitch, onEnd, onError }
 * @returns {SpeechSynthesisUtterance|null}
 */
export function speakText(text, langCode = 'en-IN', options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('speechSynthesis is not supported on this platform');
    return null;
  }

  if (!text || !text.trim()) return null;

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterances
  } catch (e) {}

  const utterance = new SpeechSynthesisUtterance(text);
  const langConfig = getLanguageByCode(langCode);

  utterance.lang = langConfig.ttsLang || langCode;
  utterance.rate = options.rate !== undefined ? options.rate : 0.95;
  utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0;

  const matchedVoice = getBestVoice(langCode);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (options.onEnd) {
    utterance.onend = options.onEnd;
  }

  if (options.onError) {
    utterance.onerror = options.onError;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Cancel any ongoing speech synthesis
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}
