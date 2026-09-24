import { createContext, useContext, useEffect, useState } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

const translations = { en, ar };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") || "en";
    setLang(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isRTL = lang === "ar";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);

    // تبديل ملف Bootstrap المناسب
    const ltr = document.getElementById("bs-ltr");
    const rtl = document.getElementById("bs-rtl");
    if (ltr && rtl) {
      if (isRTL) {
        ltr.disabled = true;
        rtl.disabled = false;
      } else {
        ltr.disabled = false;
        rtl.disabled = true;
      }
    }
  }, [lang, mounted]);

  const toggleLanguage = () => setLang((l) => (l === "en" ? "ar" : "en"));

  // t('nav.home') → string
  const t = (key) => {
    const keys = key.split(".");
    let value = translations[lang];
    for (const k of keys) value = value?.[k];
    return value ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        isRTL: lang === "ar",
        mounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
