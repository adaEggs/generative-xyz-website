import { isProduction, isStaging } from '@utils/common';

export const ROUTE_PATH = {
  HOME: isStaging() ? 'https://generative.xyz' : '/',
  COLLECTIONS: '/collections',
  CREATE_PROJECT: isProduction()
    ? 'https://testnet.generative.xyz/mint-generative/upload-project'
    : '/mint-generative/upload-project',
  BENEFIT: isProduction() ? 'https://testnet.generative.xyz/create' : '/create',
  GENERATIVE: '/generative',
  GENERATIVE_EDIT: '/generative/edit',
  PROFILE: '/profile',
  EDIT_PROFILE: `/profile/edit`,
  SANDBOX: '/sandbox',
  DISPLAY: isStaging() ? 'https://generative.xyz' : '/display',
  ORDER_NOW: isStaging() ? 'https://generative.xyz/order-now' : '/order-now',
  LEADERBOARDS: isProduction()
    ? 'https://testnet.generative.xyz/leaderboards'
    : '/leaderboards',
  DAO: '/dao',
  INCENTIVIZED_TESTNET: isProduction()
    ? 'https://testnet.generative.xyz/incentivized-testnet'
    : '/incentivized-testnet',
  TRADE: '/inscriptions',
  REFERRAL: '/referral',
  NOT_FOUND: '/404',
  INSCRIBE: '/inscribe',
  CREATE_BTC_PROJECT: '/create',
};
