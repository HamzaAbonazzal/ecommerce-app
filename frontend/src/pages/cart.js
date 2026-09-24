import Link from "next/link";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import SEO from "@/components/SEO";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
    mounted,
  } = useCart();
  const { t } = useLanguage();

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <Layout>
        <SEO title={t("cart.title")} noindex />
        <div className="container">
          <div className="glass-card p-5 text-center">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "var(--primary-soft)",
                color: "var(--primary)",
                fontSize: "2.5rem",
              }}
            >
              <i className="bi bi-cart-x"></i>
            </div>
            <h3 className="fw-bold mb-2">{t("cart.empty")}</h3>
            <p style={{ color: "var(--text-secondary)" }} className="mb-4">
              {t("cart.empty_hint")}
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              <i className="bi bi-bag me-2"></i>
              {t("cart.empty_cta")}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <h1 className="section-title gradient-text mb-0">
            {t("cart.title")}
          </h1>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={clearCart}
          >
            <i className="bi bi-trash me-1"></i>
            {t("cart.clear") || "Clear Cart"}
          </button>
        </div>

        <div className="row g-4">
          {/* Items */}
          <div className="col-lg-8">
            <div className="glass-card p-2 p-md-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`d-flex flex-column flex-md-row align-items-md-center gap-3 p-3 ${
                    idx < items.length - 1 ? "border-bottom" : ""
                  }`}
                  style={{ borderColor: "var(--border-color)" }}
                >
                  {/* Image */}
                  <Link href={`/products/${item.id}`} className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.image_url ||
                        `https://placehold.co/120x120?text=Item`
                      }
                      alt={item.name}
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow-1">
                    <Link
                      href={`/products/${item.id}`}
                      className="fw-bold d-block mb-1 text-decoration-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.name}
                    </Link>
                    <span style={{ color: "var(--text-secondary)" }}>
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div
                    className="d-flex align-items-center glass-card"
                    style={{ padding: 4 }}
                  >
                    <button
                      type="button"
                      className="btn btn-sm px-2"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        color: "var(--text-primary)",
                        background: "transparent",
                        border: "none",
                      }}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span
                      className="px-2 fw-bold"
                      style={{ minWidth: 32, textAlign: "center" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm px-2"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.min(item.stock, item.quantity + 1),
                        )
                      }
                      style={{
                        color: "var(--text-primary)",
                        background: "transparent",
                        border: "none",
                      }}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div
                    className="fw-bold text-end"
                    style={{ minWidth: 100, color: "var(--primary)" }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={t("cart.remove")}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <Link
                href="/products"
                className="text-decoration-none"
                style={{ color: "var(--text-secondary)" }}
              >
                <i className="bi bi-arrow-left me-1"></i>
                {t("cart.continue_shopping")}
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div
              className="glass-card p-4"
              style={{ position: "sticky", top: 90 }}
            >
              <h5 className="fw-bold mb-4">{t("checkout.order_summary")}</h5>

              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("cart.subtotal")}
                </span>
                <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("cart.shipping") || "Shipping"}
                </span>
                <span className="fw-semibold text-success">
                  {t("cart.free") || "Free"}
                </span>
              </div>

              <hr style={{ borderColor: "var(--border-color)" }} />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">{t("cart.total")}</span>
                <span
                  className="fw-bold fs-5"
                  style={{
                    background: "var(--gradient-primary)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-lg w-100">
                <i className="bi bi-credit-card me-2"></i>
                {t("cart.checkout")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
