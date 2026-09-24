import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import SEO from "@/components/SEO";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart, mounted } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ===== تعبئة تلقائية إذا المستخدم مسجّل دخول =====
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.name || "",
        customer_email: prev.customer_email || user.email || "",
        customer_phone: prev.customer_phone || user.phone || "",
        customer_address: prev.customer_address || user.address || "",
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error(t("cart.empty"));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await api.post("/orders", payload);
      const { order_id, total } = res.data.data;

      clearCart();
      toast.success(t("checkout.success"));

      router.push({
        pathname: "/order-success",
        query: { id: order_id, total: Number(total).toFixed(2) },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  // تجنّب Hydration mismatch
  if (!mounted) return null;

  // إذا السلة فارغة
  if (items.length === 0) {
    return (
      <Layout>
        <SEO title={t("checkout.title")} noindex />
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
            <h3 className="fw-bold mb-3">{t("cart.empty")}</h3>
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
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="section-title gradient-text mb-1">
              {t("checkout.title")}
            </h1>
            <p className="section-subtitle mb-0">
              {t("checkout.subtitle") || "Complete your order details"}
            </p>
          </div>
          <Link
            href="/cart"
            className="text-decoration-none"
            style={{ color: "var(--text-secondary)" }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            {t("cart.title")}
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* ============ Form ============ */}
            <div className="col-lg-7">
              <div className="glass-card p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <span
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "var(--primary-soft)",
                      color: "var(--primary)",
                      fontSize: "1rem",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                  </span>
                  {t("checkout.customer_info")}
                </h5>

                {user && (
                  <div
                    className="d-flex align-items-center gap-2 mb-4 p-3 rounded"
                    style={{
                      background: "var(--primary-soft)",
                      border: "1px solid rgba(37, 99, 235, 0.2)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <i
                      className="bi bi-check-circle-fill"
                      style={{ color: "var(--primary)" }}
                    ></i>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {t("checkout.autofill_note") ||
                        "Some fields were auto-filled from your account"}
                    </span>
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold small">
                      {t("checkout.name")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      className="form-control"
                      value={form.customer_name}
                      onChange={handleChange}
                      required
                      minLength={2}
                      placeholder="Ahmed Ali"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("checkout.email")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      className="form-control"
                      value={form.customer_email}
                      onChange={handleChange}
                      required
                      placeholder="ahmed@example.com"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("checkout.phone")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      className="form-control"
                      value={form.customer_phone}
                      onChange={handleChange}
                      required
                      placeholder="0999999999"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">
                      {t("checkout.address")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="customer_address"
                      className="form-control"
                      rows={3}
                      value={form.customer_address}
                      onChange={handleChange}
                      required
                      placeholder="Damascus, Syria..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* ============ Summary ============ */}
            <div className="col-lg-5">
              <div
                className="glass-card p-4"
                style={{ position: "sticky", top: 90 }}
              >
                <h5 className="fw-bold mb-4">{t("checkout.order_summary")}</h5>

                <div
                  style={{ maxHeight: 320, overflowY: "auto" }}
                  className="pe-1"
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.image_url ||
                          "https://placehold.co/80x80?text=Item"
                        }
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: "var(--radius-sm)",
                        }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <div
                          className="fw-semibold text-truncate"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {item.name}
                        </div>
                        <small style={{ color: "var(--text-secondary)" }}>
                          ${Number(item.price).toFixed(2)} × {item.quantity}
                        </small>
                      </div>
                      <span className="fw-bold text-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr style={{ borderColor: "var(--border-color)" }} />

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

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      {t("checkout.placing")}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      {t("checkout.place_order")}
                    </>
                  )}
                </button>

                <div
                  className="text-center mt-3 small d-flex align-items-center justify-content-center gap-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <i className="bi bi-shield-check"></i>
                  {t("checkout.secure_note") || "Your data is safe with us"}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
