/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Global
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV!;
export const APP_LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL!;
export const APP_MAX_FILESIZE = process.env.NEXT_PUBLIC_MAX_FILESIZE!;
export const NETWORK_CHAIN_ID: number = parseInt(
  process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID!,
  10
);
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL!;
export const GENERATIVE_EXPLORER_URL =
  process.env.NEXT_PUBLIC_GENERATIVE_EXPLORER!;
export const APP_TOKEN_SYMBOL = 'GEN';
export const SERVICE_FEE = 2.5 / 100;
export const CHUNK_SIZE = 32 * 1024 * 1024; // MB

// Discount
export const PRINTS_REQUIRED_TO_DISCOUNT = 5000;
export const NFT_REQUIRED_TO_DISCOUNT = 1;

// API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
export const GN_API_BASE_URL = process.env.NEXT_PUBLIC_GN_API_URL ?? '';

// DAO
export const GEN_REQUIRE_TO_VOTE = 1;
export const SECONDS_PER_BLOCK = parseInt(
  process.env.NEXT_PUBLIC_SECONDS_PER_BLOCK!,
  10
);

// Report
export const REPORT_COUNT_THRESHOLD = 3;

// Mint tool
export const MINT_TOOL_MAX_FILE_SIZE = 0.38;
export const MINT_TRANSFER_FEE = 18000;
export const SANDBOX_BTC_IMAGE_SIZE_LIMIT = 380; // kb
export const SANDBOX_BTC_NON_IMAGE_SIZE_LIMIT = 3000; // kb
export const MIN_MINT_BTC_PROJECT_PRICE = 0;

// Category
export const CATEGORY_SELECT_BLACKLIST =
  process.env.NEXT_PUBLIC_CATEGORY_SELECT_BLACKLIST;

// Mempool
export const MEMPOOL_API_URL = 'https://mempool.space/api/v1';
export const BINANCE_API_URL = 'https://api.binance.com/api/v3';

// AA tracking config
export const AA_BASE_URL =
  'https://autonomous-analytics-qffztaoryq-uc.a.run.app/api/v1';
export const AA_CLIENT_TOKEN = process.env.NEXT_PUBLIC_AA_CLIENT_TOKEN!;
export const AA_PLATFORM = 'web';

// RAPI config
export const RAPI_URL = 'https://telize-v1.p.rapidapi.com/geoip';
export const RAPI_HOST = 'telize-v1.p.rapidapi.com';
export const RAPID_CLIENT_TOKEN = process.env.NEXT_PUBLIC_RAPID_CLIENT_TOKEN!;

// Ordinals
export const HOST_ORDINALS_EXPLORER = 'https://dev.generativeexplorer.com';

export const GLB_COLLECTION_ID = process.env.NEXT_PUBLIC_GLB_COLLECTION_ID!;

// Datadog config
export const DD_APP_ID = process.env.NEXT_PUBLIC_DD_APP_ID!;
export const DD_CLIENT_TOKEN = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN!;
export const DD_SITE = 'datadoghq.com';
export const DD_SERVICE = process.env.NEXT_PUBLIC_DD_SERVICE!;
export const ENABLE_DD = process.env.NEXT_PUBLIC_ENABLE_DD! === 'true';

// Firebase config
export const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
export const FIREBASE_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
export const FIREBASSE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
export const FIREBASE_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID;
export const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
export const FIREBASE_MESSAGING_VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY;

/* eslint-enable @typescript-eslint/no-non-null-assertion */

export const THOR_SWAP_API_URL = 'https://thornode.ninerealms.com/thorchain';
