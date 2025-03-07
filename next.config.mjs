/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure Socket.io works with Next.js
  webpack: (config) => {
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    });
    return config;
  },
  // Ensure proper transpilation
  transpilePackages: ["react-zoom-pan-pinch"],
  // Increase build timeout if needed
  experimental: {
    serverComponentsExternalPackages: ["socket.io", "socket.io-client"],
  },
};

export default nextConfig; 