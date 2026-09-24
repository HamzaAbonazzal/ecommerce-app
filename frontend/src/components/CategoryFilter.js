import { useLanguage } from "@/context/LanguageContext";

export default function CategoryFilter({ categories, activeSlug, onSelect }) {
  const { t } = useLanguage();

  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      <button
        type="button"
        className={`btn btn-sm px-3 rounded-pill ${
          !activeSlug ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onSelect("")}
      >
        {t("products.all_categories")}
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`btn btn-sm px-3 rounded-pill ${
            activeSlug === cat.slug ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name}
          {cat.product_count > 0 && (
            <span className="ms-2 small opacity-75">({cat.product_count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
