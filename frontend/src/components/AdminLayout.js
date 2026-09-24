import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { removeToken } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitch from "./LanguageSwitch";
import toast from "react-hot-toast";

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const { t } = useLanguage();

  const { logoutAdmin } = useAuth();

  const handleLogout = () => {
    logoutAdmin();
    toast.success(t("admin.logged_out") || "Logged out");
    router.push("/");
  };

  const isActive = (path) => router.pathname === path;

  const navItems = [
    {
      href: "/admin/dashboard",
      icon: "speedometer2",
      label: t("admin.dashboard"),
    },
    { href: "/admin/products", icon: "box-seam", label: t("admin.products") },
    { href: "/admin/orders", icon: "receipt", label: t("admin.orders") },
  ];

  return (
    <div className="admin-wrapper">
      {/* ============ SIDEBAR ============ */}
      <aside className="admin-sidebar glass">
        <div className="admin-sidebar-brand">
          <Link
            href="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "var(--gradient-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <i className="bi bi-bag-heart-fill"></i>
            </span>
            <span className="gradient-text fw-bold">ShopVerse</span>
          </Link>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${isActive(item.href) ? "active" : ""}`}
            >
              <i className={`bi bi-${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-link">
            <i className="bi bi-shop"></i>
            <span>{t("admin.view_store") || "View Store"}</span>
          </Link>
          <button
            type="button"
            className="admin-nav-link"
            onClick={handleLogout}
            style={{ width: "100%", border: "none", background: "transparent" }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>{t("admin.logout")}</span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar glass">
          <div>
            <h1 className="admin-page-title">{title}</h1>
          </div>
          <div className="d-flex align-items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
