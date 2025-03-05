// This script helps check if your Firebase configuration is correct
// Run this script with: node check-firebase-domains.js

console.log('Checking Firebase configuration...');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Check if Firebase environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_VERCEL_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env.local file');
} else {
  console.log('All required environment variables are set');
}

// Check Firebase configuration
console.log('\nFirebase Configuration:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Vercel URL:', process.env.NEXT_PUBLIC_VERCEL_URL);

// Instructions for checking authorized domains
console.log('\nTo check and update Firebase authorized domains:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log(`2. Select your project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log('3. Go to Authentication > Settings > Authorized domains');
console.log('4. Make sure the following domains are added:');
console.log('   - localhost');
console.log('   - 127.0.0.1');
console.log(`   - ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
console.log(`   - ${process.env.NEXT_PUBLIC_VERCEL_URL}`);

// Instructions for checking Google Cloud Console
console.log('\nTo check Google Cloud Console API settings:');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
console.log(`2. Select your project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log('3. Go to APIs & Services > Credentials');
console.log('4. Find your API key and check the HTTP referrers');
console.log('5. Make sure the following domains are added:');
console.log('   - localhost');
console.log('   - 127.0.0.1');
console.log(`   - ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
console.log(`   - ${process.env.NEXT_PUBLIC_VERCEL_URL}`);

console.log('\nIf you need to update these settings, please follow the instructions above.');
console.log('After updating, rebuild and redeploy your application.'); 