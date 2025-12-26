// Language mappings and utilities for voice recognition and text processing

// Supported languages with their codes and names
export const SUPPORTED_LANGUAGES = {
  "en-US": {
    name: "English (US)",
    nativeName: "English",
    flag: "🇺🇸",
    rtl: false,
    voiceSupported: true,
  },
  "en-GB": {
    name: "English (UK)",
    nativeName: "English",
    flag: "🇬🇧",
    rtl: false,
    voiceSupported: true,
  },
  "es-ES": {
    name: "Spanish (Spain)",
    nativeName: "Español",
    flag: "🇪🇸",
    rtl: false,
    voiceSupported: true,
  },
  "es-MX": {
    name: "Spanish (Mexico)",
    nativeName: "Español",
    flag: "🇲🇽",
    rtl: false,
    voiceSupported: true,
  },
  "fr-FR": {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    rtl: false,
    voiceSupported: true,
  },
  "de-DE": {
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    rtl: false,
    voiceSupported: true,
  },
  "it-IT": {
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    rtl: false,
    voiceSupported: true,
  },
  "pt-PT": {
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
    rtl: false,
    voiceSupported: true,
  },
  "pt-BR": {
    name: "Portuguese (Brazil)",
    nativeName: "Português",
    flag: "🇧🇷",
    rtl: false,
    voiceSupported: true,
  },
  "ru-RU": {
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    rtl: false,
    voiceSupported: true,
  },
  "zh-CN": {
    name: "Chinese (Simplified)",
    nativeName: "中文",
    flag: "🇨🇳",
    rtl: false,
    voiceSupported: true,
  },
  "zh-TW": {
    name: "Chinese (Traditional)",
    nativeName: "中文",
    flag: "🇹🇼",
    rtl: false,
    voiceSupported: true,
  },
  "ja-JP": {
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    rtl: false,
    voiceSupported: true,
  },
  "ko-KR": {
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    rtl: false,
    voiceSupported: true,
  },
  "ar-SA": {
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    rtl: true,
    voiceSupported: true,
  },
  "hi-IN": {
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    rtl: false,
    voiceSupported: true,
  },
  "nl-NL": {
    name: "Dutch",
    nativeName: "Nederlands",
    flag: "🇳🇱",
    rtl: false,
    voiceSupported: true,
  },
  "sv-SE": {
    name: "Swedish",
    nativeName: "Svenska",
    flag: "🇸🇪",
    rtl: false,
    voiceSupported: true,
  },
  "no-NO": {
    name: "Norwegian",
    nativeName: "Norsk",
    flag: "🇳🇴",
    rtl: false,
    voiceSupported: true,
  },
  "da-DK": {
    name: "Danish",
    nativeName: "Dansk",
    flag: "🇩🇰",
    rtl: false,
    voiceSupported: true,
  },
  "fi-FI": {
    name: "Finnish",
    nativeName: "Suomi",
    flag: "🇫🇮",
    rtl: false,
    voiceSupported: true,
  },
  "pl-PL": {
    name: "Polish",
    nativeName: "Polski",
    flag: "🇵🇱",
    rtl: false,
    voiceSupported: true,
  },
  "cs-CZ": {
    name: "Czech",
    nativeName: "Čeština",
    flag: "🇨🇿",
    rtl: false,
    voiceSupported: true,
  },
  "hu-HU": {
    name: "Hungarian",
    nativeName: "Magyar",
    flag: "🇭🇺",
    rtl: false,
    voiceSupported: true,
  },
  "tr-TR": {
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    rtl: false,
    voiceSupported: true,
  },
  "th-TH": {
    name: "Thai",
    nativeName: "ไทย",
    flag: "🇹🇭",
    rtl: false,
    voiceSupported: true,
  },
  "vi-VN": {
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: "🇻🇳",
    rtl: false,
    voiceSupported: true,
  },
};

// Common words and phrases in different languages for pronunciation practice
export const PRACTICE_WORDS = {
  "en-US": {
    numbers: [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
    ],
    colors: [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "brown",
      "black",
      "white",
    ],
    animals: [
      "cat",
      "dog",
      "bird",
      "fish",
      "elephant",
      "lion",
      "tiger",
      "bear",
      "rabbit",
      "horse",
    ],
    greetings: [
      "hello",
      "goodbye",
      "please",
      "thank you",
      "excuse me",
      "sorry",
      "yes",
      "no",
    ],
    family: [
      "mother",
      "father",
      "sister",
      "brother",
      "grandmother",
      "grandfather",
      "baby",
      "family",
    ],
  },
  "es-ES": {
    numbers: [
      "uno",
      "dos",
      "tres",
      "cuatro",
      "cinco",
      "seis",
      "siete",
      "ocho",
      "nueve",
      "diez",
    ],
    colors: [
      "rojo",
      "azul",
      "verde",
      "amarillo",
      "naranja",
      "morado",
      "rosa",
      "marrón",
      "negro",
      "blanco",
    ],
    animals: [
      "gato",
      "perro",
      "pájaro",
      "pez",
      "elefante",
      "león",
      "tigre",
      "oso",
      "conejo",
      "caballo",
    ],
    greetings: [
      "hola",
      "adiós",
      "por favor",
      "gracias",
      "perdón",
      "lo siento",
      "sí",
      "no",
    ],
    family: [
      "madre",
      "padre",
      "hermana",
      "hermano",
      "abuela",
      "abuelo",
      "bebé",
      "familia",
    ],
  },
  "fr-FR": {
    numbers: [
      "un",
      "deux",
      "trois",
      "quatre",
      "cinq",
      "six",
      "sept",
      "huit",
      "neuf",
      "dix",
    ],
    colors: [
      "rouge",
      "bleu",
      "vert",
      "jaune",
      "orange",
      "violet",
      "rose",
      "brun",
      "noir",
      "blanc",
    ],
    animals: [
      "chat",
      "chien",
      "oiseau",
      "poisson",
      "éléphant",
      "lion",
      "tigre",
      "ours",
      "lapin",
      "cheval",
    ],
    greetings: [
      "bonjour",
      "au revoir",
      "s'il vous plaît",
      "merci",
      "excusez-moi",
      "désolé",
      "oui",
      "non",
    ],
    family: [
      "mère",
      "père",
      "sœur",
      "frère",
      "grand-mère",
      "grand-père",
      "bébé",
      "famille",
    ],
  },
  "de-DE": {
    numbers: [
      "eins",
      "zwei",
      "drei",
      "vier",
      "fünf",
      "sechs",
      "sieben",
      "acht",
      "neun",
      "zehn",
    ],
    colors: [
      "rot",
      "blau",
      "grün",
      "gelb",
      "orange",
      "lila",
      "rosa",
      "braun",
      "schwarz",
      "weiß",
    ],
    animals: [
      "katze",
      "hund",
      "vogel",
      "fisch",
      "elefant",
      "löwe",
      "tiger",
      "bär",
      "hase",
      "pferd",
    ],
    greetings: [
      "hallo",
      "auf wiedersehen",
      "bitte",
      "danke",
      "entschuldigung",
      "tut mir leid",
      "ja",
      "nein",
    ],
    family: [
      "mutter",
      "vater",
      "schwester",
      "bruder",
      "großmutter",
      "großvater",
      "baby",
      "familie",
    ],
  },
};

// Phonetic mappings for pronunciation checking
export const PHONETIC_MAPPINGS = {
  "en-US": {
    one: ["wʌn", "wan"],
    two: ["tuː", "too"],
    three: ["θriː", "three"],
    four: ["fɔːr", "for"],
    five: ["faɪv", "fayv"],
    hello: ["həˈloʊ", "huh-loh"],
    thank: ["θæŋk", "thank"],
    you: ["juː", "yoo"],
  },
};

// Language-specific text processing rules
export const TEXT_PROCESSING_RULES = {
  "en-US": {
    caseSensitive: false,
    ignorePunctuation: true,
    ignoreArticles: ["a", "an", "the"],
    commonWords: [
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
    ],
    contractions: {
      "don't": "do not",
      "won't": "will not",
      "can't": "cannot",
      "I'm": "I am",
      "you're": "you are",
      "it's": "it is",
      "we're": "we are",
      "they're": "they are",
    },
  },
  "es-ES": {
    caseSensitive: false,
    ignorePunctuation: true,
    ignoreArticles: ["el", "la", "los", "las", "un", "una", "unos", "unas"],
    commonWords: ["y", "o", "pero", "en", "con", "por", "para", "de", "a"],
    contractions: {
      del: "de el",
      al: "a el",
    },
  },
  "fr-FR": {
    caseSensitive: false,
    ignorePunctuation: true,
    ignoreArticles: [
      "le",
      "la",
      "les",
      "un",
      "une",
      "des",
      "du",
      "de la",
      "de l'",
    ],
    commonWords: ["et", "ou", "mais", "dans", "avec", "pour", "de", "à", "sur"],
    contractions: {
      "j'ai": "je ai",
      "c'est": "ce est",
      "n'est": "ne est",
      "qu'il": "que il",
      "s'il": "si il",
    },
  },
  "de-DE": {
    caseSensitive: false,
    ignorePunctuation: true,
    ignoreArticles: [
      "der",
      "die",
      "das",
      "den",
      "dem",
      "des",
      "ein",
      "eine",
      "einen",
      "einem",
      "einer",
    ],
    commonWords: [
      "und",
      "oder",
      "aber",
      "in",
      "mit",
      "für",
      "von",
      "zu",
      "auf",
      "an",
    ],
    contractions: {
      im: "in dem",
      ins: "in das",
      am: "an dem",
      ans: "an das",
      vom: "von dem",
      zum: "zu dem",
      zur: "zu der",
    },
  },
};

// Language direction utilities
export const isRTL = (languageCode) => {
  return SUPPORTED_LANGUAGES[languageCode]?.rtl || false;
};

// Get language display name
export const getLanguageDisplayName = (languageCode, native = false) => {
  const language = SUPPORTED_LANGUAGES[languageCode];
  if (!language) return languageCode;
  return native ? language.nativeName : language.name;
};

// Get language flag emoji
export const getLanguageFlag = (languageCode) => {
  return SUPPORTED_LANGUAGES[languageCode]?.flag || "🌐";
};

// Check if voice recognition is supported for language
export const isVoiceSupported = (languageCode) => {
  return SUPPORTED_LANGUAGES[languageCode]?.voiceSupported || false;
};

// Get browser's preferred language
export const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages?.[0] || "en-US";

  // Check if we support this exact language
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang;
  }

  // Try to find a match with just the language code (ignore country)
  const langCode = browserLang.split("-")[0];
  const matchingLang = Object.keys(SUPPORTED_LANGUAGES).find((key) =>
    key.startsWith(langCode + "-")
  );

  return matchingLang || "en-US"; // Fallback to English (US)
};

// Normalize text for comparison
export const normalizeText = (text, languageCode = "en-US") => {
  if (!text || typeof text !== "string") return "";

  const rules =
    TEXT_PROCESSING_RULES[languageCode] || TEXT_PROCESSING_RULES["en-US"];
  let normalized = text.trim();

  // Convert to lowercase if not case sensitive
  if (!rules.caseSensitive) {
    normalized = normalized.toLowerCase();
  }

  // Remove punctuation if specified
  if (rules.ignorePunctuation) {
    normalized = normalized.replace(
      /[^\w\s\u00C0-\u017F\u0400-\u04FF\u4E00-\u9FFF]/g,
      ""
    );
  }

  // Expand contractions
  if (rules.contractions) {
    Object.entries(rules.contractions).forEach(([contraction, expansion]) => {
      const regex = new RegExp(`\\b${contraction}\\b`, "gi");
      normalized = normalized.replace(regex, expansion);
    });
  }

  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
};

// Compare two texts for pronunciation accuracy
export const compareTexts = (expected, actual, languageCode = "en-US") => {
  const normalizedExpected = normalizeText(expected, languageCode);
  const normalizedActual = normalizeText(actual, languageCode);

  if (normalizedExpected === normalizedActual) {
    return { accuracy: 1.0, match: "exact" };
  }

  // Calculate similarity using Levenshtein distance
  const similarity = calculateSimilarity(normalizedExpected, normalizedActual);

  let match = "none";
  if (similarity >= 0.9) match = "excellent";
  else if (similarity >= 0.8) match = "good";
  else if (similarity >= 0.6) match = "fair";
  else if (similarity >= 0.4) match = "poor";

  return { accuracy: similarity, match };
};

// Calculate text similarity (Levenshtein distance based)
export const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;

  const matrix = Array(str2.length + 1)
    .fill()
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1, // deletion
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i - 1] + 1 // substitution
        );
      }
    }
  }

  const maxLength = Math.max(str1.length, str2.length);
  const distance = matrix[str2.length][str1.length];

  return 1 - distance / maxLength;
};

// Get practice words for a language and category
export const getPracticeWords = (languageCode, category) => {
  const languageWords = PRACTICE_WORDS[languageCode];
  if (!languageWords) return [];

  return languageWords[category] || [];
};

// Get all supported language codes
export const getSupportedLanguageCodes = () => {
  return Object.keys(SUPPORTED_LANGUAGES);
};

// Get languages that support voice recognition
export const getVoiceSupportedLanguages = () => {
  return Object.entries(SUPPORTED_LANGUAGES)
    .filter(([_, config]) => config.voiceSupported)
    .map(([code, _]) => code);
};

// Format language code for speech recognition API
export const formatLanguageForSpeechAPI = (languageCode) => {
  // Some browsers require specific formats
  const mapping = {
    "zh-CN": "zh-Hans-CN",
    "zh-TW": "zh-Hant-TW",
  };

  return mapping[languageCode] || languageCode;
};

// Get alternative pronunciations for a word
export const getAlternativePronunciations = (word, languageCode = "en-US") => {
  const phonetics = PHONETIC_MAPPINGS[languageCode];
  if (!phonetics || !phonetics[word.toLowerCase()]) {
    return [];
  }

  return phonetics[word.toLowerCase()];
};

// Check if a language uses non-Latin script
export const usesNonLatinScript = (languageCode) => {
  const nonLatinLanguages = [
    "ar-SA",
    "zh-CN",
    "zh-TW",
    "ja-JP",
    "ko-KR",
    "hi-IN",
    "th-TH",
    "ru-RU",
  ];
  return nonLatinLanguages.includes(languageCode);
};

export default {
  SUPPORTED_LANGUAGES,
  PRACTICE_WORDS,
  TEXT_PROCESSING_RULES,
  isRTL,
  getLanguageDisplayName,
  getLanguageFlag,
  isVoiceSupported,
  getBrowserLanguage,
  normalizeText,
  compareTexts,
  calculateSimilarity,
  getPracticeWords,
  getSupportedLanguageCodes,
  getVoiceSupportedLanguages,
  formatLanguageForSpeechAPI,
  getAlternativePronunciations,
  usesNonLatinScript,
};
