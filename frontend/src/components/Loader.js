import { useLanguage } from "@/context/LanguageContext";

export default function Loader({ text }) {
  const { t } = useLanguage();
  return (
    <div className="loader-wrapper">
      <div className="text-center">
        <div
          className="spinner-border"
          role="status"
          style={{ color: "var(--primary)" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 mb-0" style={{ color: "var(--text-secondary)" }}>
          {text || t("common.loading")}
        </p>
      </div>
    </div>
  );
}
