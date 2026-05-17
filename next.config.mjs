/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "attm-backend-main-gvzubr.laravel.cloud",
      },
    ],
  },
}

export default nextConfig