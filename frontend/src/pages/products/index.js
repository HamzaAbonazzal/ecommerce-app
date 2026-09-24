import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import CategoryFilter from "@/components/CategoryFilter";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import { logError } from "@/lib/logger";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  // مزامنة الفلتر مع URL
  useEffect(() => {
    if (!router.isReady) return;
    const { category: cat, search: s } = router.query;
    if (cat) setCategory(cat);
    if (s) setSearch(s);
  }, [router.isReady, router.query]);

  // تحميل الكاتيجوريات مرة واحدة
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data.data))
      .catch(logError);
  }, []);

  // تحميل المنتجات حسب الفلاتر
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.data);
    } catch (err) {
      logError("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300); // debounce
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleCategorySelect = (slug) => {
    setCategory(slug);
    router.push(
      { pathname: "/products", query: slug ? { category: slug } : {} },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Layout>
      <SEO title={t("products.title")} description={t("products.subtitle")} />

      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="section-title gradient-text">{t("products.title")}</h1>
          <p className="section-subtitle">{t("products.subtitle")}</p>
        </div>

        {/* Search + Sort bar */}
        <div className="glass-card p-3 p-md-4 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-lg-6">
              <div className="position-relative">
                <i
                  className="bi bi-search position-absolute"
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    insetInlineStart: 16,
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                ></i>
                <input
                  type="text"
                  className="glass-input"
                  placeholder={t("products.search_placeholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingInlineStart: 44 }}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label={t("products.sort_by")}
              >
                <option value="newest">{t("products.sort_newest")}</option>
                <option value="price_asc">
                  {t("products.sort_price_asc")}
                </option>
                <option value="price_desc">
                  {t("products.sort_price_desc")}
                </option>
                <option value="name_asc">{t("products.sort_name")}</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-6 text-md-end">
              <span style={{ color: "var(--text-secondary)" }}>
                {products.length} {t("products.results") || "results"}
              </span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          activeSlug={category}
          onSelect={handleCategorySelect}
        />

        {/* Grid */}
        {loading ? (
          <div className="row g-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={i}>
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-card p-5 text-center">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--primary-soft)",
                color: "var(--primary)",
                fontSize: "2rem",
              }}
            >
              <i className="bi bi-search"></i>
            </div>
            <h4 className="fw-bold mb-2">{t("products.no_products")}</h4>
            <p style={{ color: "var(--text-secondary)" }} className="mb-0">
              {t("products.no_products_hint")}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={product.id}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
