#!/bin/bash
# This script helps Vercel with the deployment process

# Ensure we have the correct Node.js version
export NODE_VERSION=18.17.0

# Install dependencies
npm install

# Build the Next.js app
npm run build

# Output success message
echo "Build completed successfully" 