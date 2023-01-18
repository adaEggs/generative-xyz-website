import AvatarInfo from '@components/AvatarInfo';
import ButtonIcon from '@components/ButtonIcon';
import Link from '@components/Link';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { LOGO_JPG, SOCIALS } from '@constants/common';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import s from '@layouts/Default/components/HeaderFixed/Header.module.scss';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { formatAddress } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Header.module.scss';
import { getFaucetLink, isTestnet } from '@utils/chain';
import QuickBuy from '@layouts/Marketplace/QuickBuy';
import querystring from 'query-string';
import _isEmpty from 'lodash/isEmpty';

const LOG_PREFIX = 'MarketplaceHeader';

const MENU_HEADER = [
  {
    id: 'menu-4',
    name: 'Display',
    route: ROUTE_PATH.DISPLAY,
    activePath: 'display',
  },
  {
    id: 'menu-1',
    name: 'Create',
    route: ROUTE_PATH.BENEFIT,
    activePath: 'benefit',
  },
  {
    id: 'menu-2',
    name: 'Collect',
    route: ROUTE_PATH.MARKETPLACE,
    activePath: 'marketplace',
  },
];

interface IProp {
  theme?: 'light' | 'dark';
  isShowFaucet?: boolean;
  isDisplay?: boolean;
}

const Header: React.FC<IProp> = ({
  theme = 'light',
  isShowFaucet = false,
  isDisplay = false,
}): React.ReactElement => {
  const { connect, disconnect, walletBalance } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const { query } = router;
  const activePath = router.asPath.split('/')[1];
  const [openProfile, setOpenProfile] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isFaucet, _] = useState<boolean>(isShowFaucet);

  const PROFILE_MENU = [
    {
      id: 'view-profile',
      name: 'View Profile',
      onClick: () => router.push(ROUTE_PATH.PROFILE),
    },
    {
      id: 'disconect-wallet',
      name: 'Disconnect wallet',
      onClick: () => disconnect(),
    },
    {
      id: 'faucet',
      name: 'Get faucet testnet',
      onClick: () => {
        const faucet = getFaucetLink();
        if (faucet) {
          window.open(faucet, '_blank');
        }
      },
    },
  ];

  const getUrlWithQueryParams = (url: string): string => {
    if (_isEmpty(query)) {
      return url;
    }
    return `${url}?${querystring.stringify(query)}`;
  };

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.Debug, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const renderProfileHeader = () => {
    return (
      <div>
        <div className={styles.username}>
          <Text size="14" fontWeight="medium">
            {user.displayName || formatAddress(user.walletAddress)}
          </Text>
          <SvgInset
            svgUrl={`${CDN_URL}/icons/ic-caret-down.svg`}
            className={styles.caret_icon}
          />
        </div>
        <div className={styles.price}>
          <Text size="14" fontWeight="regular">
            {walletBalance?.toFixed(4)}
          </Text>
          <SvgInset
            svgUrl={`${CDN_URL}/icons/ic-eth-token.svg`}
            className={s.eth_icon}
          />
        </div>
      </div>
    );
  };

  const ProfileDropdown = () => {
    return (
      <ul className={styles.dropdown} ref={dropdownRef}>
        {PROFILE_MENU?.length > 0 &&
          PROFILE_MENU.map(
            item =>
              (item.id != 'faucet' || isTestnet()) && (
                <li
                  className="dropdown-item"
                  onClick={item.onClick}
                  key={item.id}
                >
                  {item.name}
                </li>
              )
          )}
      </ul>
    );
  };

  useOnClickOutside(dropdownRef, () => setOpenProfile(false));

  const refHeader = useRef<HTMLDivElement>(null);

  const clickToFaucet = (): void => {
    const faucet = getFaucetLink();
    if (faucet) {
      window.open(faucet, '_blank');
    }
  };

  return (
    <>
      <header ref={refHeader} className={`${styles.header} ${styles[theme]}`}>
        <div className={styles.header_inner}>
          <Container>
            <div className={styles.headerWrapper}>
              <div
                className={`d-flex align-items-center justify-content-between w-100 ${styles.header_row}`}
              >
                <ul className={`${styles.navBar} ${styles[theme]}`}>
                  {MENU_HEADER?.length > 0 &&
                    MENU_HEADER.map(item => (
                      <li
                        className={cs(
                          activePath === item.activePath && styles.active
                        )}
                        key={`header-${item.id}`}
                      >
                        <Link href={getUrlWithQueryParams(item.route)}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>

                <Link
                  className={styles.logo}
                  href={getUrlWithQueryParams(ROUTE_PATH.HOME)}
                >
                  <Image
                    className={styles.header_logo}
                    src={LOGO_JPG[theme]}
                    alt="LOGO_GENERATIVE"
                    width={64}
                    height={64}
                  />
                </Link>

                <div className={styles.header_right}>
                  <ul
                    className={`${styles.navBar} ${styles.header_right_links} ${styles[theme]}`}
                  >
                    <li>
                      <a href={SOCIALS.docs} target="_blank" rel="noreferrer">
                        Docs
                      </a>
                    </li>
                    <li>
                      <a
                        href={SOCIALS.discord}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Discord
                      </a>
                    </li>
                  </ul>
                  {user.id ? (
                    <div className="position-relative">
                      <AvatarInfo
                        imgSrc={user.avatar}
                        width={48}
                        height={48}
                        leftContent={renderProfileHeader()}
                        onClick={() => setOpenProfile(!openProfile)}
                        wrapperStyle={{ cursor: 'pointer' }}
                      />
                      {openProfile && <ProfileDropdown />}
                    </div>
                  ) : (
                    <div className={'d-md-block d-none'}>
                      <ButtonIcon
                        disabled={isConnecting}
                        sizes="small"
                        variants={theme === 'dark' ? 'secondary' : 'primary'}
                        onClick={handleConnectWallet}
                      >
                        {isConnecting ? 'Connecting...' : 'Connect wallet'}
                      </ButtonIcon>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
        {isFaucet && (
          <div className={styles.testNet}>
            <img
              src={`${CDN_URL}/icons/star-shooting-horizontal.svg`}
              alt="star-shooting-horizontal"
            />
            Welcome to Generative testnet! Don’t have ETH for testnet? Request
            some
            <a onClick={clickToFaucet} target="_blank" rel="noreferrer">
              {' here.'}
            </a>
            {/*<button*/}
            {/*  onClick={() => {*/}
            {/*    localStorage.setItem('close_faucet', '1');*/}
            {/*    setIsFaucet(false);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <img src={`${CDN_URL}/icons/x-02.svg`} alt="x-v" />*/}
            {/*</button>*/}
          </div>
        )}
        <div className="divider"></div>
      </header>
      {isDisplay && <QuickBuy />}
    </>
  );
};
export default Header;
