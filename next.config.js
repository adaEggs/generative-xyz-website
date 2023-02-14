// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const removeImports = require('next-remove-imports')();

const path = require('path');

const baseSecurityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
];

/** @type {import('next').NextConfig} */
module.exports = removeImports(
  withBundleAnalyzer({
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `frame-ancestors 'self' https://ordinals.com https://ordinals-explorer.generative.xyz; frame-src 'self' https://ordinals.com https://ordinals-explorer.generative.xyz;`,
            },
            ...baseSecurityHeaders,
          ],
        },
        {
          source: '/sw.js',
          headers: [
            {
              key: 'service-worker-allowed',
              value: '/',
            },
          ],
        },
        {
          source: '/caching.sw.js',
          headers: [
            {
              key: 'service-worker-allowed',
              value: '/',
            },
          ],
        },
        {
          source: '/sandbox/preview.html',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `frame-ancestors 'self' https://ordinals.com; frame-src 'self' https://ordinals.com;`,
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'require-corp',
            },
          ],
        },
      ];
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ipfs.io',
        },
        {
          protocol: 'https',
          hostname: 'cloudflare-ipfs.com',
        },

        {
          protocol: 'https',
          hostname: 'storage.googleapis.com',
        },
        {
          protocol: 'https',
          hostname: '**.generative.xyz',
        },
      ],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
      prependData: `@import "@styles/_variables.scss";
      @import "@styles/_themes/_mixins.scss";
      @import "@styles/_themes/_variables.scss";
    `,
    },
  })
);
