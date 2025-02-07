import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // אפשר טעינה חופשית ללא אופטימיזציה
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

};

export default withNextIntl(nextConfig);
