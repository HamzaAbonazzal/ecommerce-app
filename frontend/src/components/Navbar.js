import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitch from "./LanguageSwitch";

export default function Navbar() {
  const { cartCount } = useCart();
  const { t } = useLanguage();
  const { user, admin, isAuthenticated, isAdmin, displayName, logout } =
    useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // أغلق القوائم عند تغيير الصفحة
  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [router.pathname]);

  const isActive = (path) => router.pathname === path;
  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    closeMenu();
    router.push("/");
  };

  return (
    <nav className="navbar navbar-expand-lg glass-navbar app-navbar">
      <div className="container">
        {/* ================= Brand ================= */}
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">
            <i className="bi bi-bag-heart-fill"></i>
          </span>
          <span className="gradient-text">ShopVerse</span>
        </Link>

        {/* ================= Mobile Toggler ================= */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <i className={`bi ${open ? "bi-x-lg" : "bi-list"} fs-3`}></i>
        </button>

        {/* ================= Menu ================= */}
        <div
          className={`collapse navbar-collapse ${open ? "show" : ""}`}
          id="mainNav"
        >
          {/* ============ Main Links ============ */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                onClick={closeMenu}
              >
                {t("nav.home")}
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/products"
                className={`nav-link ${
                  router.pathname.startsWith("/products") ? "active" : ""
                }`}
                onClick={closeMenu}
              >
                {t("nav.products")}
              </Link>
            </li>

            {/* ---- Admin Panel Link (Admin only) ---- */}
            {isAdmin && (
              <li className="nav-item">
                <Link
                  href="/admin/dashboard"
                  className={`nav-link ${
                    router.pathname.startsWith("/admin") ? "active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  <i className="bi bi-shield-lock me-1"></i>
                  {t("auth.admin_panel")}
                </Link>
              </li>
            )}

            {/* ---- My Orders Link (User only) ---- */}
            {user && (
              <li className="nav-item">
                <Link
                  href="/my-orders"
                  className={`nav-link ${
                    isActive("/my-orders") ? "active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  <i className="bi bi-receipt me-1"></i>
                  {t("auth.my_orders")}
                </Link>
              </li>
            )}
          </ul>

          {/* ============ Right Side Actions ============ */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <LanguageSwitch />
            <ThemeToggle />

            {/* ---- Cart ---- */}
            <Link
              href="/cart"
              id="cart-icon-target"
              className="glass-btn position-relative"
              onClick={closeMenu}
              aria-label="Cart"
            >
              <i className="bi bi-cart3"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* ============ User / Admin Menu ============ */}
            {isAuthenticated ? (
              <div className="position-relative">
                <button
                  type="button"
                  className="glass-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                  title={displayName}
                >
                  <i
                    className={`bi ${
                      isAdmin ? "bi-shield-fill-check" : "bi-person-fill"
                    }`}
                  ></i>
                </button>

                {userMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="position-fixed"
                      style={{ inset: 0, zIndex: 999 }}
                      onClick={() => setUserMenuOpen(false)}
                    />

                    {/* Dropdown */}
                    <div
                      className="glass-card p-2 position-absolute"
                      style={{
                        top: "calc(100% + 10px)",
                        insetInlineEnd: 0,
                        minWidth: 240,
                        zIndex: 1000,
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      {/* ---- Header ---- */}
                      <div
                        className="px-3 py-2 border-bottom mb-1"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        {isAdmin && (
                          <span
                            className="badge-soft-primary mb-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            <i className="bi bi-shield-lock me-1"></i>
                            ADMIN
                          </span>
                        )}
                        <div className="fw-bold small mt-1">
                          {displayName || "User"}
                        </div>
                        <div
                          className="small text-truncate"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {admin?.email || user?.email}
                        </div>
                      </div>

                      {/* ---- Admin Links ---- */}
                      {isAdmin && (
                        <>
                          <Link
                            href="/admin/dashboard"
                            className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                            style={{ color: "var(--text-primary)" }}
                            onClick={() => {
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            <i className="bi bi-speedometer2"></i>
                            {t("admin.dashboard")}
                          </Link>

                          <Link
                            href="/admin/products"
                            className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                            style={{ color: "var(--text-primary)" }}
                            onClick={() => {
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            <i className="bi bi-box-seam"></i>
                            {t("admin.products")}
                          </Link>

                          <Link
                            href="/admin/orders"
                            className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                            style={{ color: "var(--text-primary)" }}
                            onClick={() => {
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            <i className="bi bi-receipt"></i>
                            {t("admin.orders")}
                          </Link>
                        </>
                      )}

                      {/* ---- User Links ---- */}
                      {user && (
                        <>
                          <Link
                            href="/profile"
                            className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                            style={{ color: "var(--text-primary)" }}
                            onClick={() => {
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            <i className="bi bi-person-gear"></i>
                            {t("profile.title") || "My Profile"}
                          </Link>

                          <Link
                            href="/my-orders"
                            className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                            style={{ color: "var(--text-primary)" }}
                            onClick={() => {
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            <i className="bi bi-receipt"></i>
                            {t("auth.my_orders")}
                          </Link>
                        </>
                      )}

                      {/* ---- Divider ---- */}
                      <hr
                        className="my-1"
                        style={{ borderColor: "var(--border-color)" }}
                      />

                      {/* ---- Logout ---- */}
                      <button
                        type="button"
                        className="d-flex align-items-center gap-2 px-3 py-2 rounded w-100 text-start border-0"
                        style={{
                          color: "var(--danger)",
                          background: "transparent",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        }}
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        {t("auth.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary btn-sm px-3"
                onClick={closeMenu}
              >
                <i className="bi bi-person me-1"></i>
                {t("auth.login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
