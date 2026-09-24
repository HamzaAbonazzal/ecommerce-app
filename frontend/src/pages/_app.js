import "@/styles/globals.css";
import "@/styles/glass.css";
import "@/styles/custom.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Component {...pageProps} />
            <Toaster
              position="top-center"
              toastOptions={{
                className: "toast-glass",
                style: {
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 500,
                },
                success: {
                  iconTheme: { primary: "#10b981", secondary: "#fff" },
                },
                error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
              }}
            />
            <ScrollToTop />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
