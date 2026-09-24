import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import { logError } from "@/lib/logger";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products?sort=newest"),
          api.get("/categories"),
        ]);

        setProducts(prodRes.data.data.slice(0, 8));
        setCategories(catRes.data.data);
      } catch (err) {
        logError("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <SEO title={t("home.hero_title")} description={t("home.hero_subtitle")} />

      {/* ============ HERO ============ */}
      <section className="hero-section">
        <div className="aurora"></div>
        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge-soft-primary mb-3 d-inline-block fade-in-up">
                <i className="bi bi-stars me-1"></i>
                {t("home.hero_badge") || "New Collection 2026"}
              </span>
              <h1 className="hero-title fade-in-up delay-1">
                {t("home.hero_title").split(" ").slice(0, 1).join(" ")}{" "}
                <span className="gradient-text">
                  {t("home.hero_title").split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className="hero-subtitle mt-4 fade-in-up delay-2">
                {t("home.hero_subtitle")}
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 mt-4 fade-in-up delay-3 justify-content-center justify-content-lg-start">
                <Link href="/products" className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-bag me-2"></i>
                  {t("home.shop_now")}
                </Link>
                <a
                  href="#categories"
                  className="btn btn-outline-primary btn-lg px-4"
                >
                  {t("home.browse_categories")}
                </a>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div className="position-relative float-anim">
                <div
                  className="glass-card p-5 text-center"
                  style={{ aspectRatio: "1" }}
                >
                  <div className="d-flex align-items-center justify-content-center h-100 flex-column">
                    <i
                      className="bi bi-bag-heart-fill"
                      style={{
                        fontSize: "6rem",
                        background: "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    ></i>
                    <h3 className="mt-4 fw-bold gradient-text">ShopVerse</h3>
                    <p
                      className="mb-0"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Premium • Simple • Beautiful
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="container mt-5">
        <div className="row g-4">
          {[
            { icon: "truck", key: "fast_shipping" },
            { icon: "shield-check", key: "secure_payment" },
            { icon: "star", key: "premium_quality" },
          ].map((item, i) => (
            <div className="col-md-4" key={item.key}>
              <div className={`glass-card p-4 h-100 fade-in-up delay-${i + 1}`}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "var(--primary-soft)",
                      color: "var(--primary)",
                      fontSize: "1.4rem",
                    }}
                  >
                    <i className={`bi bi-${item.icon}`}></i>
                  </div>
                  <h5 className="mb-0 fw-bold">{t(`home.${item.key}`)}</h5>
                </div>
                <p className="mb-0" style={{ color: "var(--text-secondary)" }}>
                  {t(`home.${item.key}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      {categories.length > 0 && (
        <section className="container mt-5 pt-4" id="categories">
          <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="section-title mb-1">{t("home.categories")}</h2>
              <p className="section-subtitle mb-0">
                {t("home.categories_subtitle") || "Find what you love"}
              </p>
            </div>
          </div>

          <div className="row g-3">
            {categories.map((cat, i) => (
              <div className="col-6 col-md-3" key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="text-decoration-none"
                >
                  <div
                    className={`glass-card glass-card-hover p-4 text-center fade-in-up delay-${
                      (i % 4) + 1
                    }`}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 18,
                        background: "var(--gradient-primary)",
                        color: "#fff",
                        fontSize: "1.6rem",
                      }}
                    >
                      <i className="bi bi-grid-3x3-gap-fill"></i>
                    </div>
                    <h6
                      className="fw-bold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {cat.name}
                    </h6>
                    <small style={{ color: "var(--text-muted)" }}>
                      {cat.product_count} {t("home.items") || "items"}
                    </small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="container mt-5 pt-4">
        <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="section-title mb-1">
              {t("home.featured_products")}
            </h2>
            <p className="section-subtitle mb-0">
              {t("home.featured_subtitle") || "Handpicked just for you"}
            </p>
          </div>
          <Link href="/products" className="btn btn-outline-primary">
            {t("home.view_all")}
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        {loading ? (
          <div className="row g-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
