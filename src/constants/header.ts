import { ROUTE_PATH } from '@constants/route-path';
import { SOCIALS } from '@constants/common';
import { isProduction } from '@utils/common';

export const MENU_HEADER = [
  {
    id: 'menu-2',
    name: 'Drops',
    route: ROUTE_PATH.DROPS,
    activePath: 'drops',
  },
  {
    id: 'menu-1',
    name: 'Create',
    route: ROUTE_PATH.BENEFIT,
    activePath: 'benefit',
  },
  {
    id: 'menu-4',
    name: 'Display',
    route: ROUTE_PATH.DISPLAY,
    activePath: 'display',
  },
  {
    id: 'menu-3',
    name: 'Marketplace',
    route: ROUTE_PATH.TRADE,
    activePath: 'marketplace',
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
