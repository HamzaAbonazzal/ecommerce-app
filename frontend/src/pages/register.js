import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import SEO from "@/components/SEO";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error(t("auth.password_mismatch"));
      return;
    }
    if (form.password.length < 6) {
      toast.error(t("auth.password_short"));
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success(t("auth.welcome_new"));
      router.push("/");
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
          <div className="col-md-7 col-lg-6">
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
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h1
                  className="fw-bold gradient-text mb-2"
                  style={{ fontSize: "1.8rem" }}
                >
                  {t("auth.register_title")}
                </h1>
                <p style={{ color: "var(--text-secondary)" }} className="mb-0">
                  {t("auth.register_subtitle")}
                </p>
              </div>

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
                    autoFocus
                    minLength={2}
                    placeholder="Ahmed Ali"
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
                    placeholder="you@example.com"
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("auth.password")}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      minLength={6}
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
                      value={form.confirm}
                      onChange={(e) =>
                        setForm({ ...form, confirm: e.target.value })
                      }
                      required
                      minLength={6}
                      placeholder="••••••••"
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
                      {t("auth.registering")}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check-fill me-2"></i>
                      {t("auth.register_btn")}
                    </>
                  )}
                </button>
              </form>

              <div
                className="text-center mt-4 pt-4 border-top"
                style={{ borderColor: "var(--border-color)" }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("auth.have_account")}{" "}
                </span>
                <Link
                  href="/login"
                  className="fw-bold text-decoration-none"
                  style={{ color: "var(--primary)" }}
                >
                  {t("auth.sign_in_link")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
