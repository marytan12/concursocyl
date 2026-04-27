import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "datosabiertos.jcyl.es",
        pathname: "/web/jcyl/binarios/**",
      },
    ],
  },
};

export default nextConfig;
