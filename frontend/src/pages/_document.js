import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" dir="ltr" data-theme="light">
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="theme-color"
          content="#2563eb"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#06101f"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Bootstrap LTR */}
        <link
          id="bs-ltr"
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        />

        {/* Bootstrap RTL (disabled by default) */}
        <link
          id="bs-rtl"
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css"
          disabled="disabled"
        />

        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta
          name="theme-color"
          content="#2563eb"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#06101f"
          media="(prefers-color-scheme: dark)"
        />

        {/* Script to prevent flash of wrong theme/direction */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var lang = localStorage.getItem('lang') || 'en';
                  var theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('lang', lang);
                  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                  document.documentElement.setAttribute('data-theme', theme);
                  if (lang === 'ar') {
                    var applyRTL = function(){
                      var ltr = document.getElementById('bs-ltr');
                      var rtl = document.getElementById('bs-rtl');
                      if (ltr && rtl) { ltr.disabled = true; rtl.disabled = false; }
                    };
                    applyRTL();
                    document.addEventListener('DOMContentLoaded', applyRTL);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
