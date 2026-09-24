import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import { logError } from "@/lib/logger";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => {
        logError("Failed to load product:", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    toast.success(t("products.added_to_cart"));
  };

  // ============ Loading ============
  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="row g-5">
            {/* Image skeleton */}
            <div className="col-lg-6">
              <div
                className="skeleton"
                style={{ aspectRatio: "1", borderRadius: "var(--radius-lg)" }}
              ></div>
            </div>
            {/* Info skeleton */}
            <div className="col-lg-6">
              <div
                className="skeleton mb-3"
                style={{ height: 24, width: 120 }}
              ></div>
              <div
                className="skeleton mb-3"
                style={{ height: 44, width: "85%" }}
              ></div>
              <div
                className="skeleton mb-4"
                style={{ height: 36, width: 140 }}
              ></div>
              <div
                className="skeleton mb-2"
                style={{ height: 16, width: "100%" }}
              ></div>
              <div
                className="skeleton mb-2"
                style={{ height: 16, width: "90%" }}
              ></div>
              <div
                className="skeleton mb-4"
                style={{ height: 16, width: "70%" }}
              ></div>
              <div
                className="skeleton"
                style={{ height: 56, width: "100%", borderRadius: 10 }}
              ></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ============ Not found ============
  if (!product) {
    return (
      <Layout>
        <SEO title={t("product.not_found")} noindex />
        <div className="container">
          <div className="glass-card p-5 text-center">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                color: "var(--danger)",
                fontSize: "2rem",
              }}
            >
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h3 className="fw-bold mb-3">{t("product.not_found")}</h3>
            <Link href="/products" className="btn btn-primary">
              <i className="bi bi-arrow-left me-2"></i>
              {t("product.back")}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <Layout>
      <SEO
        title={product.name}
        description={product.description || ""}
        image={product.image_url}
        type="product"
        product={product}
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav
          className="mb-4 d-flex align-items-center flex-wrap gap-2"
          style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
        >
          <Link href="/" className="text-decoration-none">
            <i className="bi bi-house-door me-1"></i>
            {t("nav.home")}
          </Link>
          <i className="bi bi-chevron-right small"></i>
          <Link href="/products" className="text-decoration-none">
            {t("nav.products")}
          </Link>
          <i className="bi bi-chevron-right small"></i>
          <span
            className="text-truncate"
            style={{ color: "var(--text-primary)", maxWidth: 200 }}
          >
            {product.name}
          </span>
        </nav>

        <div className="row g-5">
          {/* ============ Image ============ */}
          <div className="col-lg-6">
            <div
              className="glass-card overflow-hidden position-relative"
              style={{ aspectRatio: "1" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  product.image_url ||
                  `https://placehold.co/600x600?text=${encodeURIComponent(
                    product.name,
                  )}`
                }
                alt={product.name}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />

              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span className="badge bg-danger px-4 py-3 fs-6">
                    <i className="bi bi-x-circle me-1"></i>
                    {t("products.out_of_stock")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ============ Info ============ */}
          <div className="col-lg-6">
            {product.category_name && (
              <Link
                href={`/products?category=${product.category_slug}`}
                className="badge-soft-primary mb-3 d-inline-block text-decoration-none"
              >
                <i className="bi bi-tag me-1"></i>
                {product.category_name}
              </Link>
            )}

            <h1 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>
              {product.name}
            </h1>

            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
              <h2
                className="fw-bold mb-0"
                style={{
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "2.2rem",
                }}
              >
                ${Number(product.price).toFixed(2)}
              </h2>

              {isOutOfStock ? (
                <span className="badge bg-danger px-3 py-2">
                  <i className="bi bi-x-circle me-1"></i>
                  {t("products.out_of_stock")}
                </span>
              ) : (
                <span className="badge bg-success px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  {t("products.in_stock")} ({product.stock})
                </span>
              )}
            </div>

            <div className="glass-card p-4 mb-4">
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
                <i
                  className="bi bi-file-text"
                  style={{ color: "var(--primary)" }}
                ></i>
                {t("product.description")}
              </h6>
              <p className="mb-0" style={{ color: "var(--text-secondary)" }}>
                {product.description || "—"}
              </p>
            </div>

            {/* Quantity + Add */}
            {!isOutOfStock && (
              <div className="d-flex flex-column flex-sm-row gap-3">
                <div
                  className="d-flex align-items-center glass-card"
                  style={{ padding: 6 }}
                >
                  <button
                    type="button"
                    className="btn btn-sm px-3"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      color: "var(--text-primary)",
                      background: "transparent",
                      border: "none",
                    }}
                    aria-label="Decrease quantity"
                  >
                    <i className="bi bi-dash-lg"></i>
                  </button>
                  <span
                    className="px-3 fw-bold"
                    style={{ minWidth: 44, textAlign: "center" }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm px-3"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    style={{
                      color: "var(--text-primary)",
                      background: "transparent",
                      border: "none",
                    }}
                    aria-label="Increase quantity"
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg flex-grow-1"
                  onClick={handleAdd}
                >
                  <i className="bi bi-bag-plus me-2"></i>
                  {t("product.add_to_cart")}
                </button>
              </div>
            )}

            {/* Back link */}
            <div className="mt-4">
              <Link
                href="/products"
                className="text-decoration-none d-inline-flex align-items-center gap-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <i
                  className={`bi bi-arrow-${lang === "ar" ? "right" : "left"}`}
                ></i>
                {t("product.back")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
