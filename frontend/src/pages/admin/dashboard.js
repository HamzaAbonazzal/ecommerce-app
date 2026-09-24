import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import AdminRoute from "@/components/AdminRoute";
import Loader from "@/components/Loader";
import api from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { logError } from "@/lib/logger";
import SEO from "@/components/SEO";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data.data))
      .catch(logError)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          label: t("admin.stats_products"),
          value: stats.products,
          icon: "box-seam",
          color: "#6366f1",
          bg: "rgba(99,102,241,0.15)",
        },
        {
          label: t("admin.stats_orders"),
          value: stats.orders,
          icon: "receipt",
          color: "#ec4899",
          bg: "rgba(236,72,153,0.15)",
        },
        {
          label: t("admin.stats_pending"),
          value: stats.pending_orders,
          icon: "clock-history",
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.15)",
        },
        {
          label: t("admin.stats_revenue"),
          value: `$${Number(stats.revenue).toFixed(2)}`,
          icon: "currency-dollar",
          color: "#10b981",
          bg: "rgba(16,185,129,0.15)",
        },
        {
          label: t("admin.stats_low_stock"),
          value: stats.low_stock,
          icon: "exclamation-triangle",
          color: "#ef4444",
          bg: "rgba(239,68,68,0.15)",
        },
      ]
    : [];

  return (
    <AdminRoute>
      <AdminLayout title={t("admin.dashboard")}>
        <SEO title="Admin Dashboard" noindex />
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Welcome */}
            <div className="glass-card p-4 mb-4 fade-in-up">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "var(--gradient-primary)",
                    color: "#fff",
                    fontSize: "1.5rem",
                  }}
                >
                  <i className="bi bi-hand-thumbs-up-fill"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-1">
                    {t("admin.welcome_back") || "Welcome back!"}
                  </h4>
                  <p
                    className="mb-0"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("admin.welcome_sub") ||
                      "Here's what's happening with your store today."}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-3 g-md-4">
              {cards.map((card, i) => (
                <div className="col-12 col-sm-6 col-xl-4" key={card.label}>
                  <div
                    className={`glass-card stat-card fade-in-up delay-${(i % 4) + 1}`}
                  >
                    <div
                      className="stat-card-icon"
                      style={{ background: card.bg, color: card.color }}
                    >
                      <i className={`bi bi-${card.icon}`}></i>
                    </div>
                    <div>
                      <div className="stat-card-value">{card.value}</div>
                      <div className="stat-card-label">{card.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="glass-card p-4 mt-4">
              <h5 className="fw-bold mb-3">
                {t("admin.quick_actions") || "Quick Actions"}
              </h5>
              <div className="d-flex flex-wrap gap-2">
                <Link href="/admin/products" className="btn btn-primary">
                  <i className="bi bi-plus-lg me-1"></i>
                  {t("admin.add_product")}
                </Link>
                <Link href="/admin/orders" className="btn btn-outline-primary">
                  <i className="bi bi-receipt me-1"></i>
                  {t("admin.orders")}
                </Link>
                <Link href="/" className="btn btn-outline-primary">
                  <i className="bi bi-shop me-1"></i>
                  {t("admin.view_store") || "View Store"}
                </Link>
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
