/** @type {import('next').NextConfig} */

const path = require('path');
require('dotenv').config();

// Bundle analyzer - optional, install with: npm install --save-dev @next/bundle-analyzer
// Then run with: ANALYZE=true npm run build
let withBundleAnalyzer = (config) => config;
try {
  if (process.env.ANALYZE === 'true') {
    withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
  }
} catch (e) {
  // Bundle analyzer not installed, skip
  console.log('Bundle analyzer not installed. Install with: npm install --save-dev @next/bundle-analyzer');
}

const s3BucketUrl = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || '';
let s3RemotePattern = null;
try {
  if (s3BucketUrl) {
    const parsed = new URL(s3BucketUrl);
    s3RemotePattern = {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      pathname: '/**',
    };
  }
} catch (e) {
  console.warn('Invalid NEXT_PUBLIC_AWS_S3_BUCKET_URL:', s3BucketUrl);
}

const nextConfig = {
  images: {
    remotePatterns: s3RemotePattern ? [s3RemotePattern] : [],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async redirects() {
    return [
      // Basic redirect
      // {
      //   source: '/',
      //   destination: '/home',
      //   permanent: true,
      // },
      {
        source: '/',
        destination: '/summary/overview',
        permanent: true,
      },
      // {
      //   source: '/summary/analytics',
      //   destination: '/summary/analytics',
      //   permanent: true,
      // }
    ];
  },
  env: {
    NEXT_PUBLIC_DEV_PB_BASE_URL: process.env.DEV_PB_BASE_URL,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
