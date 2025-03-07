/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com https://*.firebase.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://*.firebase.com https://*.firebaseio.com;
              connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com;
              frame-src 'self' https://*.firebaseapp.com https://*.firebase.com;
              font-src 'self';
              object-src 'none';
              frame-ancestors 'self' https://pixel-wars-ab9f9.firebaseapp.com https://pixel-pqtnsvfbm-outlndrrs-projects.vercel.app https://*.vercel.app;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ];
  },
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  transpilePackages: ['firebase', '@firebase'],
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  productionBrowserSourceMaps: true
}

module.exports = nextConfig 