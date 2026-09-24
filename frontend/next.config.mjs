/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // اجعل الـ build أسرع
  swcMinify: true,
  // تجنّب مشاكل ESLint أثناء النشر
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
