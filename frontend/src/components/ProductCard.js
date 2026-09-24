import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { flyToCart } from "@/lib/flyToCart";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const productUrl = `/products/${product.id}`;

  // ============ زر الإضافة ============
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || adding) return;

    setAdding(true);
    addToCart(product, 1);

    // ✨ أطلق أنيميشن الطيران
    flyToCart(e.currentTarget);

    toast.success(t("products.added_to_cart"));

    // ارجع الزر لحالته بعد 1.2 ثانية
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <div className="glass-card glass-card-hover h-100 d-flex flex-column product-card">
      {/* ============ Image (Link) ============ */}
      <Link href={productUrl} className="d-block text-decoration-none">
        <div
          className="position-relative overflow-hidden"
          style={{
            aspectRatio: "4/3",
            borderTopLeftRadius: "var(--radius-lg)",
            borderTopRightRadius: "var(--radius-lg)",
            background: "var(--bg-subtle)",
            cursor: "pointer",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              product.image_url ||
              `https://placehold.co/400x300?text=${encodeURIComponent(
                product.name,
              )}`
            }
            alt={product.name}
            className="w-100 h-100 product-card-img"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />

          {/* Category badge */}
          {product.category_name && (
            <span
              className="badge-soft-primary position-absolute"
              style={{
                top: 12,
                [lang === "ar" ? "right" : "left"]: 12,
                backdropFilter: "blur(10px)",
              }}
            >
              {product.category_name}
            </span>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(2px)",
              }}
            >
              <span
                className="badge bg-danger px-3 py-2"
                style={{ fontSize: "0.8rem" }}
              >
                {t("products.out_of_stock")}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ============ Body ============ */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        {/* Title (Link) */}
        <Link href={productUrl} className="text-decoration-none">
          <h6
            className="fw-bold mb-2 line-clamp-2"
            style={{
              color: "var(--text-primary)",
              minHeight: 48,
              lineHeight: "1.4",
              cursor: "pointer",
            }}
          >
            {product.name}
          </h6>
        </Link>

        {/* Description */}
        <p
          className="small mb-3 line-clamp-2 flex-grow-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {product.description || "—"}
        </p>

        {/* Footer: Price + Add Button */}
        <div className="d-flex align-items-center justify-content-between mt-auto gap-2">
          <div>
            <span
              className="fw-bold fs-5"
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* ✅ الزر الآن خارج Link تماماً */}
          <button
            type="button"
            className={`btn-add-cart ${adding ? "is-adding" : ""}`}
            disabled={isOutOfStock}
            onClick={handleAdd}
            aria-label={t("products.add_to_cart")}
          >
            <span className="btn-add-cart-icon">
              <i className={adding ? "bi bi-check-lg" : "bi bi-bag-plus"}></i>
            </span>
            <span className="btn-add-cart-text d-none d-sm-inline">
              {adding
                ? t("products.added") || "Added!"
                : t("products.add_to_cart")}
            </span>

            {/* نقطة طيران مصغّرة كخلفية */}
            {adding && <span className="btn-add-cart-ripple"></span>}
          </button>
        </div>
      </div>
    </div>
  );
}
