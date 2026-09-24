import Link from "next/link";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <Layout>
      <SEO title="404 — Page Not Found" noindex />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div
              className="glass-card p-5 text-center fade-in-up"
              style={{ position: "relative", overflow: "hidden" }}
            >
              {/* Aurora */}
              <div className="aurora" style={{ opacity: 0.4 }}></div>

              <div className="position-relative">
                {/* Big 404 */}
                <h1
                  className="fw-bold mb-3"
                  style={{
                    fontSize: "clamp(5rem, 15vw, 10rem)",
                    lineHeight: 1,
                    background: "var(--gradient-hero)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.05em",
                  }}
                >
                  404
                </h1>

                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    fontSize: "2.2rem",
                  }}
                >
                  <i className="bi bi-compass"></i>
                </div>

                <h2 className="fw-bold mb-3" style={{ fontSize: "1.8rem" }}>
                  {t("errors.404_title") || "Page Not Found"}
                </h2>

                <p
                  className="mb-4 mx-auto"
                  style={{
                    color: "var(--text-secondary)",
                    maxWidth: 480,
                    fontSize: "1.05rem",
                  }}
                >
                  {t("errors.404_message") ||
                    "The page you're looking for doesn't exist or has been moved."}
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Link href="/" className="btn btn-primary btn-lg px-4">
                    <i className="bi bi-house-door me-2"></i>
                    {t("errors.go_home") || "Go Home"}
                  </Link>
                  <Link
                    href="/products"
                    className="btn btn-outline-primary btn-lg px-4"
                  >
                    <i className="bi bi-bag me-2"></i>
                    {t("nav.products")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
