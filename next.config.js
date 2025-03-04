/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
  experimental: {
    serverActions: {
      enabled: true
    },
  },
  // Transpile specific modules
  transpilePackages: ['firebase', '@firebase'],
  // Add proper headers for cross-origin access
  async headers() {
    const headers = [
      {
        key: 'Access-Control-Allow-Origin',
        value: process.env.NODE_ENV === 'development' ? '*' : 'https://pixel-wars-ab9f9.firebaseapp.com'
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
      },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'X-Requested-With, Content-Type, Authorization, Accept'
      },
      {
        key: 'Access-Control-Allow-Credentials',
        value: 'true'
      }
    ];

    return [
      {
        source: '/:path*',
        headers
      },
      {
        source: '/api/:path*',
        headers
      }
    ];
  },
  // Development specific settings
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: true,
    typescript: {
      ignoreBuildErrors: true
    }
  }),
  // Force HTTPS in production
  async rewrites() {
    return process.env.NODE_ENV === 'production'
      ? [
          {
            source: '/:path*',
            destination: 'https://pixel-wars-ab9f9.firebaseapp.com/:path*'
          }
        ]
      : []
  }
}

module.exports = nextConfig 