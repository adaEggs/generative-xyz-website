import { isProduction } from '@utils/common';

export const ROUTE_PATH = {
  HOME: '/',
  MARKETPLACE: isProduction()
    ? 'https://testnet.generative.xyz/collect'
    : '/collect',
  CREATE_PROJECT: isProduction()
    ? 'https://testnet.generative.xyz/mint-generative/upload-project'
    : '/mint-generative/upload-project',
  BENEFIT: isProduction()
    ? 'https://testnet.generative.xyz/mint-generative/create'
    : '/create',
  GENERATIVE: '/generative',
  PROFILE: '/profile',
  EDIT_PROFILE: `/profile/edit`,
  SANDBOX: '/sandbox',
  DISPLAY: '/display',
};
