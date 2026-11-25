import type { NextConfig } from "next";

// Menu and profile images are served by the Express API. Allow that origin so
// next/image can optimise them without hard-coding a production hostname.
let apiImagePattern: {
  protocol: "http" | "https";
  hostname: string;
  port: string;
  pathname: string;
} | null = null;

try {
  const apiUrl = new URL(
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7000"
  );
  apiImagePattern = {
    protocol: apiUrl.protocol === "https:" ? "https" : "http",
    hostname: apiUrl.hostname,
    port: apiUrl.port,
    pathname: "/api/images/**",
  };
} catch {
  // Ignore an invalid API URL at build time; the local default still works.
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(apiImagePattern ? [apiImagePattern] : []),
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  cacheComponents: true,
  // Menu and profile images travel through a base64 server action, so allow
  // larger action bodies than the 1MB default. The API enforces the 5MB cap.
  experimental: {
   
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
