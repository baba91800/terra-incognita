/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Cela permet de construire le site même s'il y a des erreurs de types
    ignoreBuildErrors: true,
  },
  eslint: {
    // Cela ignore les erreurs de style pendant la construction
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
