/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'community.cloudflare.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'steamcommunity-a.akamaihd.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
      }
    ],
  },
};

export default nextConfig;
