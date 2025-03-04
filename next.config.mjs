/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we don't generate source maps in production for better performance
  productionBrowserSourceMaps: false,
  
  // Set the output directory for the production build
  distDir: 'dist',
  
  // Use server components where possible for better performance
  reactStrictMode: true,
  
  // Default image domains if we need to fetch images from external sources in the future
  images: {
    domains: [],
  },
};

export default nextConfig; 