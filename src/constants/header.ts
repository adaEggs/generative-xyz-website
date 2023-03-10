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
    name: 'Free Inscription',
    route: ROUTE_PATH.FREE_INSCRIPTION,
    activePath: 'free-inscription',
  },
  {
    id: 'menu-9',
    name: 'Airdrop',
    route: ROUTE_PATH.AIRDROP,
    activePath: 'airdrop',
  },
  {
    id: 'menu-10',
    name: 'Authentic Inscription',
    route: ROUTE_PATH.AUTHENTIC_INSCRIPTIONS,
    activePath: 'authentic-inscriptions',
  },
  {
    id: 'menu-11',
    name: 'Developers',
    route: ROUTE_PATH.DEVELOPER,
    activePath: 'developers',
  },
  {
    id: 'menu-12',
    name: 'CryptoArt & NFT Preservation',
    route: ROUTE_PATH.PRESERVE_LANDING,
    activePath: 'preserve-cryptoart',
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
