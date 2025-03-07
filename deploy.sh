#!/bin/bash
# This script helps Vercel with the deployment process

# Ensure we have the correct Node.js version
export NODE_VERSION=18.17.0

# Make sure tsconfig.json is clean
echo "Ensuring tsconfig.json is clean..."
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "next-env.d.ts",
    "dist/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
EOL

# Verify environment variables
echo "Checking environment variables..."
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
  echo "Warning: NEXT_PUBLIC_FIREBASE_API_KEY is not set."
fi

# Remove package-lock.json if it exists to prevent parsing errors
if [ -f package-lock.json ]; then
  echo "Removing package-lock.json to prevent parsing errors..."
  rm -f package-lock.json
fi

# Create .env file for build if needed
if [ ! -f .env.production ]; then
  echo "Creating .env.production file..."
  touch .env.production
  # Add any necessary production environment variables here
  echo "NEXT_PUBLIC_NODE_ENV=production" >> .env.production
fi

# Set production flags
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Install dependencies
echo "Installing dependencies..."
npm install --production=false

# Build the Next.js app with production optimizations
echo "Building the Next.js app..."
npm run build

# Output success message
echo "Build completed successfully" 