import Link from "next/link";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";

export default function ServerError() {
  const { t } = useLanguage();

  return (
    <Layout>
      <SEO title="500 — Server Error" noindex />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div
              className="glass-card p-5 text-center fade-in-up"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <div className="aurora" style={{ opacity: 0.4 }}></div>

              <div className="position-relative">
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
                  500
                </h1>

                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "var(--danger)",
                    fontSize: "2.2rem",
                  }}
                >
                  <i className="bi bi-exclamation-triangle"></i>
                </div>

                <h2 className="fw-bold mb-3" style={{ fontSize: "1.8rem" }}>
                  {t("errors.500_title") || "Something Went Wrong"}
                </h2>

                <p
                  className="mb-4 mx-auto"
                  style={{
                    color: "var(--text-secondary)",
                    maxWidth: 480,
                    fontSize: "1.05rem",
                  }}
                >
                  {t("errors.500_message") ||
                    "Our servers hit a snag. We're working on it — please try again in a moment."}
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg px-4"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    {t("errors.retry") || "Try Again"}
                  </button>
                  <Link
                    href="/"
                    className="btn btn-outline-primary btn-lg px-4"
                  >
                    <i className="bi bi-house-door me-2"></i>
                    {t("errors.go_home") || "Go Home"}
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
