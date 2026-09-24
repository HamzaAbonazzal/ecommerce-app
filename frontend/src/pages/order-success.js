import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";

export default function OrderSuccess() {
  const router = useRouter();
  const { id, total } = router.query;
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="glass-card p-5 text-center fade-in-up">
              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "var(--gradient-primary)",
                  color: "#fff",
                  fontSize: "3rem",
                  boxShadow: "0 12px 40px rgba(99, 102, 241, 0.4)",
                }}
              >
                <i className="bi bi-check-lg"></i>
              </div>

              <h1 className="fw-bold mb-3 gradient-text">
                {t("order.success_title")}
              </h1>

              <p
                className="mb-4"
                style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}
              >
                {t("order.success_message")}
              </p>

              <div className="glass-card p-4 mb-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className="small mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("order.order_number")}
                    </div>
                    <div className="fw-bold fs-5">#{id || "—"}</div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="small mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("order.total")}
                    </div>
                    <div
                      className="fw-bold fs-5"
                      style={{
                        background: "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ${total || "0.00"}
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/products" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-bag me-2"></i>
                {t("order.continue_shopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
