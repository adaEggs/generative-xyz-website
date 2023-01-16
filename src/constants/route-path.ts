import { isProduction, isStaging } from '@utils/common';

export const ROUTE_PATH = {
  HOME: isStaging() ? 'https://generative.xyz' : '/',
  MARKETPLACE: isProduction()
    ? 'https://testnet.generative.xyz/collect'
    : '/collect',
  CREATE_PROJECT: isProduction()
    ? 'https://testnet.generative.xyz/mint-generative/upload-project'
    : '/mint-generative/upload-project',
  BENEFIT: isProduction() ? 'https://testnet.generative.xyz/create' : '/create',
  GENERATIVE: '/generative',
  PROFILE: '/profile',
  EDIT_PROFILE: `/profile/edit`,
  SANDBOX: '/sandbox',
  DISPLAY: isStaging() ? 'https://generative.xyz' : '/display',
  ORDER_NOW: isStaging() ? 'https://generative.xyz/order-now' : '/order-now',
};
