/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      {
        protocol: "https",
        hostname: "hyfeaseyueuhknopsqpk.supabase.co",
        pathname: "storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "hyfeaseyueuhknopsqpk.supabase.co" },
    ],
  },
};

export default nextConfig;
