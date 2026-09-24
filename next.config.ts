import type { NextConfig } from "next";

/**
 * Routing between the Aureus marketing site (Next.js) and the
 * Aureus dashboard (standalone Vite app, kept in a separate folder).
 *
 * Modes:
 *
 *  1) LOCAL / SEPARATE-DOMAIN (default) — clean 307 redirect:
 *     `/dashboard/*`  →  `NEXT_PUBLIC_DASHBOARD_URL`
 *     (defaults to http://localhost:5173 locally; set the production
 *     dashboard origin when deployed separately, e.g.
 *     https://dashboard.yoursite.com).
 *     A true redirect means the Vite app serves its own HTML and assets
 *     natively — no 404s, no MIME-type errors, HMR intact in dev.
 *
 *  2) SAME-ORIGIN SUBPATH / VERUVEL-STYLE PROXY (opt-in) — set
 *     `DASHBOARD_PROXY_ORIGIN` to the public site origin AND deploy the Vite
 *     app with `VITE_BASE=/dashboard/`. Next.js then REWRITES `/dashboard/*`
 *     to that origin so the whole dashboard stays on one domain.
 *
 * The two modes are mutually exclusive — proxy mode disables the redirects.
 */
const nextConfig: NextConfig = {
  async redirects() {
    // Proxy mode handles /dashboard itself; do not also redirect.
    if (process.env.DASHBOARD_PROXY_ORIGIN) return [];

    const dashboardUrl =
      process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:5173";

    return [
      {
        source: "/dashboard",
        destination: dashboardUrl,
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: `${dashboardUrl}/:path*`,
        permanent: false,
      },
    ];
  },

  async rewrites() {
    const origin = process.env.DASHBOARD_PROXY_ORIGIN || "";
    if (!origin) return [];

    return [
      {
        source: "/dashboard/:path*",
        destination: `${origin}/dashboard/:path*`,
      },
    ];
  },
};

export default nextConfig;