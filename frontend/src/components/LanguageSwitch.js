import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitch() {
  const { lang, toggleLanguage, mounted } = useLanguage();

  if (!mounted) return <div style={{ width: 42, height: 42 }} />;

  return (
    <button
      type="button"
      className="glass-btn"
      onClick={toggleLanguage}
      aria-label="Switch language"
      title={lang === "en" ? "العربية" : "English"}
      style={{ fontSize: "0.85rem", fontWeight: 800 }}
    >
      {lang === "en" ? "ع" : "EN"}
    </button>
  );
}
