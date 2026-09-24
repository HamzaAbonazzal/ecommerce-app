import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import { logError } from "@/lib/logger";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isUserAuthenticated, loading: authLoading } = useAuth();
  const { items, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { t, lang } = useLanguage();

  const [tab, setTab] = useState("orders"); // 'orders' | 'cart'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // حماية الصفحة
  useEffect(() => {
    if (authLoading) return;
    if (!isUserAuthenticated) {
      router.replace("/login?redirect=/my-orders");
      return;
    }
    api
      .get("/users/orders")
      .then((res) => setOrders(res.data.data))
      .catch(logError)
      .finally(() => setLoading(false));
  }, [isUserAuthenticated, authLoading, router]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container">
          <Loader />
        </div>
      </Layout>
    );
  }

  const inProgressOrders = orders.filter((o) =>
    ["pending", "confirmed", "shipped"].includes(o.status),
  );

  return (
    <Layout>
      <SEO title={t("auth.my_orders")} noindex />

      <div className="container">
        {/* ============ Header ============ */}
        <div className="mb-4">
          <h1 className="section-title gradient-text mb-1">
            {t("auth.my_orders")}
          </h1>
          <p className="section-subtitle mb-0">
            {user?.name} — {orders.length} {t("auth.order_count")}
          </p>
        </div>

        {/* ============ Tabs ============ */}
        <div className="glass-card p-2 mb-4 d-flex gap-2 flex-wrap">
          <button
            type="button"
            className={`btn flex-grow-1 flex-sm-grow-0 ${
              tab === "orders" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTab("orders")}
          >
            <i className="bi bi-receipt me-1"></i>
            {t("orders.tab_orders") || "My Orders"}
            <span className="badge bg-light text-dark ms-2">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            className={`btn flex-grow-1 flex-sm-grow-0 ${
              tab === "cart" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTab("cart")}
          >
            <i className="bi bi-cart3 me-1"></i>
            {t("orders.tab_cart") || "Cart (Draft)"}
            <span className="badge bg-light text-dark ms-2">
              {items.length}
            </span>
          </button>
        </div>

        {/* ============ TAB: Orders ============ */}
        {tab === "orders" && (
          <>
            {orders.length === 0 ? (
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
                  <i className="bi bi-receipt"></i>
                </div>
                <h4 className="fw-bold mb-2">{t("auth.no_orders")}</h4>
                <Link href="/products" className="btn btn-primary mt-3">
                  <i className="bi bi-bag me-2"></i>
                  {t("auth.browse_products")}
                </Link>
              </div>
            ) : (
              <>
                {/* بادج الطلبات قيد المعالجة */}
                {inProgressOrders.length > 0 && (
                  <div
                    className="glass-card p-3 mb-3 d-flex align-items-center gap-2"
                    style={{
                      borderColor: "rgba(245, 158, 11, 0.35)",
                      background: "rgba(245, 158, 11, 0.08)",
                    }}
                  >
                    <i
                      className="bi bi-hourglass-split"
                      style={{ color: "var(--warning)", fontSize: "1.2rem" }}
                    ></i>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {inProgressOrders.length}{" "}
                      {t("orders.in_progress_note") ||
                        "order(s) currently in progress"}
                    </span>
                  </div>
                )}

                <div className="glass-card p-0 overflow-hidden">
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t("admin.date")}</th>
                          <th>{t("cart.total")}</th>
                          <th>{t("admin.status")}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id}>
                            <td className="fw-bold">#{o.id}</td>
                            <td style={{ color: "var(--text-secondary)" }}>
                              {formatDate(o.created_at)}
                            </td>
                            <td className="fw-bold">
                              ${Number(o.total).toFixed(2)}
                            </td>
                            <td>
                              <span
                                className={`status-badge status-${o.status}`}
                              >
                                {t(`status.${o.status}`)}
                              </span>
                            </td>
                            <td>
                              <Link
                                href={`/order-success?id=${o.id}&total=${Number(
                                  o.total,
                                ).toFixed(2)}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-eye me-1"></i>
                                {t("admin.view") || "View"}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ============ TAB: Cart ============ */}
        {tab === "cart" && (
          <>
            {items.length === 0 ? (
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
                <h4 className="fw-bold mb-2">{t("cart.empty")}</h4>
                <p style={{ color: "var(--text-secondary)" }}>
                  {t("cart.empty_hint")}
                </p>
                <Link href="/products" className="btn btn-primary mt-2">
                  <i className="bi bi-bag me-2"></i>
                  {t("cart.empty_cta")}
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {/* Items list */}
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
                        <Link
                          href={`/products/${item.id}`}
                          className="flex-shrink-0"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              item.image_url ||
                              `https://placehold.co/120x120?text=Item`
                            }
                            alt={item.name}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: "var(--radius-sm)",
                            }}
                          />
                        </Link>

                        <div className="flex-grow-1 min-w-0">
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

                        <div
                          className="d-flex align-items-center glass-card"
                          style={{ padding: 4 }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm px-2"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
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

                        <div
                          className="fw-bold text-end"
                          style={{ minWidth: 90, color: "var(--primary)" }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

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
                </div>

                {/* Summary */}
                <div className="col-lg-4">
                  <div
                    className="glass-card p-4"
                    style={{ position: "sticky", top: 90 }}
                  >
                    <h5 className="fw-bold mb-4">
                      {t("checkout.order_summary")}
                    </h5>

                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: "var(--text-secondary)" }}>
                        {t("cart.subtotal")}
                      </span>
                      <span className="fw-semibold">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
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

                    <Link
                      href="/checkout"
                      className="btn btn-primary btn-lg w-100"
                    >
                      <i className="bi bi-credit-card me-2"></i>
                      {t("cart.checkout")}
                    </Link>

                    <div
                      className="text-center mt-3 small"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      {t("orders.cart_note") ||
                        "This is a draft — complete it at checkout"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
