import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import { logError } from "@/lib/logger";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isUserAuthenticated,
    loading: authLoading,
    updateProfile,
    deleteAccount,
  } = useAuth();
  const { t, lang } = useLanguage();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  // حماية
  useEffect(() => {
    if (authLoading) return;
    if (!isUserAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [authLoading, isUserAuthenticated, router]);

  // تحميل
  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    }));

    api
      .get("/users/stats")
      .then((res) => setStats(res.data.data))
      .catch(logError)
      .finally(() => setLoading(false));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password) {
      if (!form.current_password) {
        toast.error(
          t("profile.current_required") || "Current password is required",
        );
        return;
      }
      if (form.new_password !== form.confirm_password) {
        toast.error(t("auth.password_mismatch"));
        return;
      }
      if (form.new_password.length < 6) {
        toast.error(t("auth.password_short"));
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      if (form.new_password) {
        payload.current_password = form.current_password;
        payload.new_password = form.new_password;
      }

      await updateProfile(payload);
      toast.success(t("profile.updated") || "Profile updated successfully");
      setForm((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) {
      toast.error(t("profile.password_required") || "Password is required");
      return;
    }
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      toast.success(t("profile.deleted") || "Account deleted");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    } finally {
      setDeleting(false);
      setDeletePassword("");
    }
  };

  if (authLoading || loading || !user) {
    return (
      <Layout>
        <div className="container">
          <Loader />
        </div>
      </Layout>
    );
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(
        lang === "ar" ? "ar-EG" : "en-US",
        { year: "numeric", month: "long" },
      )
    : "—";

  return (
    <Layout>
      <SEO title={t("profile.title")} noindex />

      <div className="container">
        {/* ============ Header ============ */}
        <div className="glass-card p-4 p-md-5 mb-4 fade-in-up">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "var(--gradient-primary)",
                color: "#fff",
                fontSize: "2.5rem",
                fontWeight: 800,
                boxShadow: "0 12px 40px var(--primary-glow)",
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-grow-1">
              <h1
                className="fw-bold mb-1 gradient-text"
                style={{ fontSize: "1.8rem" }}
              >
                {user.name}
              </h1>
              <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
                <i className="bi bi-envelope me-2"></i>
                {user.email}
              </p>
              {memberSince && (
                <span className="badge-soft-primary">
                  <i className="bi bi-calendar3 me-1"></i>
                  {t("profile.member_since") || "Member since"} {memberSince}
                </span>
              )}
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <Link href="/my-orders" className="btn btn-outline-primary">
                <i className="bi bi-receipt me-1"></i>
                {t("auth.my_orders")}
              </Link>
            </div>
          </div>
        </div>

        {/* ============ Stats ============ */}
        {stats && (
          <div className="row g-3 mb-4">
            {[
              {
                value: stats.total,
                label: t("profile.stat_total") || "Total Orders",
                icon: "bi-bag-check",
                color: "var(--primary)",
                bg: "rgba(37,99,235,0.15)",
              },
              {
                value: stats.in_progress,
                label: t("profile.stat_in_progress") || "In Progress",
                icon: "bi-hourglass-split",
                color: "var(--warning)",
                bg: "rgba(245,158,11,0.15)",
              },
              {
                value: stats.delivered,
                label: t("profile.stat_delivered") || "Delivered",
                icon: "bi-check-circle",
                color: "var(--success)",
                bg: "rgba(16,185,129,0.15)",
              },
              {
                value: stats.cancelled,
                label: t("profile.stat_cancelled") || "Cancelled",
                icon: "bi-x-circle",
                color: "var(--danger)",
                bg: "rgba(239,68,68,0.15)",
              },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="glass-card stat-card">
                  <div
                    className="stat-card-icon"
                    style={{ background: s.bg, color: s.color }}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <div>
                    <div className="stat-card-value">{s.value}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="row g-4">
          {/* ============ Edit Form ============ */}
          <div className="col-lg-7">
            <div className="glass-card p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <i
                  className="bi bi-pencil-square"
                  style={{ color: "var(--primary)" }}
                ></i>
                {t("profile.edit_info") || "Edit Information"}
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    {t("auth.name")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    minLength={2}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    {t("auth.email")}
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <hr style={{ borderColor: "var(--border-color)" }} />

                <h6
                  className="fw-bold mb-3 small d-flex align-items-center gap-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <i className="bi bi-truck"></i>
                  {t("profile.shipping_info") || "Shipping Information"}
                </h6>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("checkout.phone")}
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="0999999999"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">
                      {t("checkout.address")}
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Damascus, Syria..."
                    ></textarea>
                  </div>
                </div>

                <div
                  className="small mb-3 p-2 rounded"
                  style={{
                    background: "var(--primary-soft)",
                    color: "var(--text-secondary)",
                    fontSize: "0.78rem",
                  }}
                >
                  <i className="bi bi-info-circle me-1"></i>
                  {t("profile.shipping_note") ||
                    "These details will be used automatically at checkout."}
                </div>

                <hr style={{ borderColor: "var(--border-color)" }} />

                <h6
                  className="fw-bold mb-3 small"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("profile.change_password") || "Change Password (optional)"}
                </h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    {t("profile.current_password") || "Current Password"}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.current_password}
                    onChange={(e) =>
                      setForm({ ...form, current_password: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("profile.new_password") || "New Password"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={form.new_password}
                      onChange={(e) =>
                        setForm({ ...form, new_password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("auth.confirm_password")}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={form.confirm_password}
                      onChange={(e) =>
                        setForm({ ...form, confirm_password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i>
                      {t("admin.save")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ============ Danger Zone ============ */}
          <div className="col-lg-5">
            <div
              className="glass-card p-4"
              style={{ borderColor: "rgba(239, 68, 68, 0.35)" }}
            >
              <h5
                className="fw-bold mb-3 d-flex align-items-center gap-2"
                style={{ color: "var(--danger)" }}
              >
                <i className="bi bi-exclamation-triangle"></i>
                {t("profile.danger_zone") || "Danger Zone"}
              </h5>

              {stats && !stats.canDelete && (
                <div
                  className="p-3 rounded mb-3"
                  style={{
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    fontSize: "0.9rem",
                  }}
                >
                  <i
                    className="bi bi-info-circle me-2"
                    style={{ color: "var(--warning)" }}
                  ></i>
                  {t("profile.cannot_delete_in_progress")}
                </div>
              )}

              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {t("profile.delete_warning")}
              </p>

              <button
                type="button"
                className="btn w-100"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "var(--danger)",
                  border: "1.5px solid rgba(239, 68, 68, 0.4)",
                }}
                onClick={() => setShowDeleteModal(true)}
                disabled={stats && !stats.canDelete}
              >
                <i className="bi bi-trash me-1"></i>
                {t("profile.delete_account") || "Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Delete Modal ============ */}
      {showDeleteModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="custom-modal-content"
            style={{ maxWidth: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="glass-card p-4"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="text-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "var(--danger)",
                    fontSize: "2rem",
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h4 className="fw-bold mb-2">
                  {t("profile.confirm_delete_title")}
                </h4>
                <p style={{ color: "var(--text-secondary)" }}>
                  {t("profile.confirm_delete_desc")}
                </p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                >
                  {t("admin.cancel")}
                </button>
                <button
                  type="button"
                  className="btn flex-grow-1"
                  style={{
                    background: "var(--danger)",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-1"></i>
                      {t("admin.delete")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
