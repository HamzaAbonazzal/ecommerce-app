import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import SEO from "@/components/SEO";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // إذا مسجّل دخول → لا داعي لعرض الصفحة
  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/");
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { role } = await login(form);

      if (role === "admin") {
        toast.success(t("auth.welcome_admin") || "Welcome Admin!");
        router.push("/admin/dashboard");
      } else {
        toast.success(t("auth.welcome_back"));
        router.push(router.query.redirect || "/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO title={t("auth.login")} noindex />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="glass-card p-4 p-md-5 fade-in-up">
              <div className="text-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 20,
                    background: "var(--gradient-primary)",
                    color: "#fff",
                    fontSize: "1.8rem",
                    boxShadow: "0 12px 40px var(--primary-glow)",
                  }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
                <h1
                  className="fw-bold gradient-text mb-2"
                  style={{ fontSize: "1.8rem" }}
                >
                  {t("auth.login_title")}
                </h1>
                <p style={{ color: "var(--text-secondary)" }} className="mb-0">
                  {t("auth.login_subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    {t("auth.email")}
                  </label>
                  <div className="position-relative">
                    <i
                      className="bi bi-envelope position-absolute"
                      style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                        insetInlineStart: 14,
                        color: "var(--text-muted)",
                        pointerEvents: "none",
                      }}
                    ></i>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      autoFocus
                      placeholder="you@example.com"
                      style={{ paddingInlineStart: 40 }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">
                    {t("auth.password")}
                  </label>
                  <div className="position-relative">
                    <i
                      className="bi bi-key position-absolute"
                      style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                        insetInlineStart: 14,
                        color: "var(--text-muted)",
                        pointerEvents: "none",
                      }}
                    ></i>
                    <input
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      placeholder="••••••••"
                      style={{ paddingInlineStart: 40 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      {t("auth.logging_in")}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      {t("auth.login_btn")}
                    </>
                  )}
                </button>
              </form>

              <div
                className="text-center mt-4 pt-4 border-top"
                style={{ borderColor: "var(--border-color)" }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("auth.no_account")}{" "}
                </span>
                <Link
                  href="/register"
                  className="fw-bold text-decoration-none"
                  style={{ color: "var(--primary)" }}
                >
                  {t("auth.sign_up_link")}
                </Link>
              </div>

              {/* تلميح لبيانات الأدمن التجريبية */}
              <div
                className="mt-4 p-3 rounded small text-center"
                style={{
                  background: "var(--primary-soft)",
                  color: "var(--text-secondary)",
                  fontSize: "0.78rem",
                }}
              >
                <i className="bi bi-info-circle me-1"></i>
                Admin demo: <code>admin@shopverse.com</code> /{" "}
                <code>admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
