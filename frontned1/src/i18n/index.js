// i18n configuration for multi-language support
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Language resources
import enTranslations from "./locales/en.json";
import hiTranslations from "./locales/hi.json";
import teTranslations from "./locales/te.json";
import mrTranslations from "./locales/mr.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  te: {
    translation: teTranslations,
  },
  mr: {
    translation: mrTranslations,
  },
};

// Get saved language from localStorage safely, default to Hindi
const getSavedLanguage = () => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("selectedLanguage") || "hi";
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      return "hi";
    }
  }
  return "hi";
};

const savedLanguage = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "hi", // Default to Hindi if translation missing

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Debug mode for development
  debug: process.env.NODE_ENV === "development",
});

// Save language change to localStorage
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("selectedLanguage", lng);

      // Set document language attribute for accessibility
      document.documentElement.lang = lng;

      // Update page direction if needed (for future RTL support)
      document.documentElement.dir = "ltr";
    } catch (error) {
      console.warn("Failed to save language preference:", error);
    }
  }
});

export default i18n;
