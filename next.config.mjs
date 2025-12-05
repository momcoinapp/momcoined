/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@farcaster/auth-kit', '@coinbase/onchainkit'],
  // reactCompiler: true,
};

export default nextConfig;
