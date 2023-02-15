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
export const APP_TOKEN_SYMBOL = 'GEN';
export const SERVICE_FEE = 2.5 / 100;

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

// Mint tool
export const MINT_TOOL_MAX_FILE_SIZE = 1;
export const MINT_TRANSFER_FEE = 16000;
export const SANDBOX_BTC_FILE_SIZE_LIMIT = 400; // kb
export const MIN_MINT_BTC_PROJECT_PRICE = 0;

// Mempool
export const MEMPOOL_API_URL = 'https://mempool.space/api/v1';

// AA tracking config
export const AA_BASE_URL =
  'https://autonomous-analytics-qffztaoryq-uc.a.run.app/api/v1';
export const AA_CLIENT_TOKEN = process.env.NEXT_PUBLIC_AA_CLIENT_TOKEN!;
export const AA_PLATFORM = 'web';

// RAPI config
export const RAPI_URL = 'https://telize-v1.p.rapidapi.com/geoip';
export const RAPI_HOST = 'telize-v1.p.rapidapi.com';
export const RAPID_CLIENT_TOKEN = process.env.NEXT_PUBLIC_RAPID_CLIENT_TOKEN!;

/* eslint-enable @typescript-eslint/no-non-null-assertion */
