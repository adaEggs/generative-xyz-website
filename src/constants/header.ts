import { ROUTE_PATH } from '@constants/route-path';
import { SOCIALS } from '@constants/common';
import { isProduction } from '@utils/common';

export const MENU_HEADER = [
  {
    id: 'menu-2',
    name: 'Art on bitcoin',
    route: ROUTE_PATH.DROPS,
    activePath: 'art-on-bitcoin',
  },
  {
    id: 'menu-1',
    name: 'Create',
    route: ROUTE_PATH.CREATE_BTC_PROJECT,
    activePath: 'create',
  },
  {
    id: 'menu-4',
    name: 'Grail',
    route: ROUTE_PATH.DISPLAY,
    activePath: 'grail',
  },
  {
    id: 'menu-3',
    name: 'Marketplace',
    route: ROUTE_PATH.TRADE,
    activePath: 'marketplace',
  },
  {
    id: 'menu-5',
    name: 'Inscribe for free',
    route: ROUTE_PATH.INSCRIBE,
    activePath: 'inscribe',
  },
  {
    id: 'menu-6',
    name: 'Live',
    route: ROUTE_PATH.LIVE,
    activePath: 'live',
  },
  {
    id: 'menu-7',
    name: 'wallet',
    route: ROUTE_PATH.WALLET,
    activePath: '/wallet',
  },
];

export const RIGHT_MENU = [
  {
    id: 'menu-5',
    name: 'Whitepaper',
    route: SOCIALS.whitepaper,
    activePath: 'whitepaper',
  },
  {
    id: 'menu-6',
    name: 'DisCord',
    route: SOCIALS.discord,
    activePath: 'discord',
  },
  {
    id: 'menu-7',
    name: `${isProduction() ? 'Testnet' : ''} Leaderboard`,
    route: ROUTE_PATH.LEADERBOARDS,
    activePath: 'leaderboards',
  },
];

export const MENU_MOBILE = [...MENU_HEADER, ...RIGHT_MENU];
