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
    name: 'Artists',
    route: ROUTE_PATH.ARTISTS,
    activePath: 'artists',
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
    name: 'Wallet',
    route: ROUTE_PATH.WALLET,
    activePath: '/wallet',
  },
  {
    id: 'menu-8',
    name: 'Free',
    route: ROUTE_PATH.FREE,
    activePath: 'free',
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
