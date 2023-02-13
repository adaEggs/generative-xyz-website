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
export const MINT_TRANSFER_FEE = 0;

/* eslint-enable @typescript-eslint/no-non-null-assertion */
