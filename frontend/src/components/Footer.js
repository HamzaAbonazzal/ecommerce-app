import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--gradient-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <i className="bi bi-bag-heart-fill"></i>
              </span>
              <span className="gradient-text fs-4 fw-bold">ShopVerse</span>
            </div>
            <p style={{ maxWidth: 420 }} className="mb-0">
              {t("footer.about")}
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h6 className="mb-3">{t("footer.links")}</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <Link href="/">{t("nav.home")}</Link>
              </li>
              <li>
                <Link href="/products">{t("nav.products")}</Link>
              </li>
              <li>
                <Link href="/cart">{t("nav.cart")}</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-3">
            <h6 className="mb-3">{t("footer.contact")}</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <i className="bi bi-envelope me-2"></i>
                hello@shopverse.com
              </li>
              <li>
                <i className="bi bi-telephone me-2"></i>
                +963 999 999 999
              </li>
            </ul>
          </div>
        </div>

        <hr
          className="my-4"
          style={{ borderColor: "var(--border-color)", opacity: 0.6 }}
        />

        <div
          className="text-center small d-flex align-items-center justify-content-center gap-1"
          style={{ color: "var(--text-muted)" }}
        >
          © {year} ShopVerse. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
