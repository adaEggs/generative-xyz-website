import { isProduction, isStaging } from '@utils/common';

export const ROUTE_PATH = {
  HOME: isProduction() ? 'https://generative.xyz' : '/',
  DROPS: '/art-on-bitcoin',
  CREATE_PROJECT: isProduction()
    ? 'https://testnet.generative.xyz/mint-generative/upload-project'
    : '/mint-generative/upload-project',
  BENEFIT: isProduction() ? 'https://testnet.generative.xyz/create' : '/create',
  GENERATIVE: '/generative',
  GENERATIVE_EDIT: '/generative/edit',
  PROFILE: '/profile',
  EDIT_PROFILE: `/profile/edit`,
  SANDBOX: '/sandbox',
  DISPLAY: '/grail',
  ORDER_NOW: isStaging() ? 'https://generative.xyz/order-now' : '/order-now',
  LEADERBOARDS: isProduction()
    ? 'https://testnet.generative.xyz/leaderboards'
    : '/leaderboards',
  DAO: '/dao',
  INCENTIVIZED_TESTNET: isProduction()
    ? 'https://testnet.generative.xyz/incentivized-testnet'
    : '/incentivized-testnet',
  TRADE: '/marketplace',
  LIVE: '/live',
  REFERRAL: '/referral',
  NOT_FOUND: '/404',
  INSCRIBE: '/inscribe',
  CREATE_BTC_PROJECT: '/create',
  GLTF_PREVIEW: '/gltf-preview',
  OBJECT_PREVIEW: '/object-preview',
  SATOSHIS_FREE_MINT: '/satoshis/free',
  SATOSHIS_PAGE: '/satoshis',
  METAMASK_X_ORDINALS: '/metamask-x-ordinals',
  ARTISTS: '/artists',
};

export const STANDALONE_PAGES = [
  ROUTE_PATH.GLTF_PREVIEW,
  ROUTE_PATH.OBJECT_PREVIEW,
];
