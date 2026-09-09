import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/customer/bookings",
        destination: "/customer/jobs",
        permanent: false,
      },
      {
        source: "/customer/report",
        destination: "/customer/jobs/new",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
