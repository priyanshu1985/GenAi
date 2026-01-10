// Language Switcher Component - Clean and minimal design
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe, FaChevronDown } from "react-icons/fa";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Available languages with their display names
  const languages = [
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
  ];

  // Handle language change
  const changeLanguage = async (languageCode) => {
    if (isUpdating) return; // Prevent double clicks

    try {
      setIsUpdating(true);

      // Change i18n language
      await i18n.changeLanguage(languageCode);

      // Save to localStorage (handled by i18n config)
      localStorage.setItem("selectedLanguage", languageCode);

      // Update user language in Supabase (if user is logged in)
      await updateUserLanguagePreference(languageCode);

      // Close dropdown
      setIsOpen(false);

      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error("Error changing language:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update user language preference in backend/Supabase
  const updateUserLanguagePreference = async (languageCode) => {
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") return;

      // Get current user from localStorage or context
      const userDataString = localStorage.getItem("userData") || "{}";
      let userData = {};

      try {
        userData = JSON.parse(userDataString);
      } catch (parseError) {
        console.warn("Failed to parse user data:", parseError);
        return;
      }

      if (userData.id) {
        const apiUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          "";

        const response = await fetch(`${apiUrl}/api/user/language`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": languageCode,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            language: languageCode,
            userId: userData.id,
          }),
        });

        if (!response.ok) {
          console.warn("Failed to update language preference in backend");
        } else {
          console.log("✅ Language preference updated in backend");
        }
      }
    } catch (error) {
      console.warn("Error updating user language preference:", error);
    }
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative inline-block text-left">
      {/* Language Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          isUpdating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label={t("language.select")}
      >
        <FaGlobe className="text-gray-500" />
        <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
          {currentLanguage.name}
        </span>
        <span className="sm:hidden text-lg">{currentLanguage.flag}</span>
        <FaChevronDown
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          size={12}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1" role="menu">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  disabled={isUpdating}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center space-x-3 transition-colors ${
                    i18n.language === language.code
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                  role="menuitem"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="flex-1">{language.name}</span>
                  {i18n.language === language.code && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                  {isUpdating && i18n.language === language.code && (
                    <span className="text-xs">🔄</span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                {t("language.select") || "Select Language"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
