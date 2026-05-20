import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** 親ディレクトリに別の lockfile があると Turbopack が誤ったルートを推定するため、このリポジトリを明示する */
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      { source: "/cases", destination: "/experience", permanent: true },
      { source: "/case-studies", destination: "/experience", permanent: true },
      {
        source: "/case-studies/:path*",
        destination: "/experience",
        permanent: true,
      },
      { source: "/demo/list", destination: "/experience", permanent: true },
      { source: "/demo", destination: "/experience", permanent: true },
      {
        source: "/lp/chuken-enterprise-v2.html",
        destination: "/lp/chuken-enterprise-v2",
        permanent: false,
      },
    ];
  },
  async headers() {
    const defaultCsp =
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self'; connect-src 'self' https://*.sanity.io wss:; frame-ancestors 'none';";
    const lpCsp =
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none';";

    return [
      {
        source: "/lp/:path*",
        headers: [{ key: "Content-Security-Policy", value: lpCsp }],
      },
      {
        source: "/((?!lp/).*)",
        headers: [{ key: "Content-Security-Policy", value: defaultCsp }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
