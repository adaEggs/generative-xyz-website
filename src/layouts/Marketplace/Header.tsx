import AvatarInfo from '@components/AvatarInfo';
import ButtonIcon from '@components/ButtonIcon';
import Link from '@components/Link';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { SOCIALS } from '@constants/common';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import s from '@layouts/Default/HeaderFixed/Header.module.scss';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { formatAddress } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Header.module.scss';
import { getFaucetLink, isTestnet } from '@utils/chain';
import QuickBuy from '@layouts/Marketplace/QuickBuy';
import querystring from 'query-string';
import _isEmpty from 'lodash/isEmpty';
import { MENU_HEADER, RIGHT_MENU } from '@constants/header';
import MenuMobile from '@layouts/Marketplace/MenuMobile';
import { gsap } from 'gsap';
import { isProduction } from '@utils/common';
import GenerativeLogo from '@components/GenerativeLogo';

const LOG_PREFIX = 'MarketplaceHeader';

interface IProp {
  theme?: 'light' | 'dark';
  isShowFaucet?: boolean;
  isDisplay?: boolean;
  isDrops?: boolean;
}

const Header: React.FC<IProp> = ({
  theme = 'light',
  isShowFaucet = false,
  isDisplay = false,
  isDrops = false,
}): React.ReactElement => {
  const { connect, disconnect, walletBalance } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const { query } = router;
  const activePath = router.asPath.split('/')[1];
  const [openProfile, setOpenProfile] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFaucet, _] = useState<boolean>(isShowFaucet);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const refMenu = useRef<HTMLDivElement | null>(null);

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
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const renderProfileHeader = () => {
    return (
      <div>
        <div className={`${styles.username} username`}>
          <Text size="14" fontWeight="medium">
            {user?.displayName || formatAddress(user?.walletAddress)}
          </Text>
          <SvgInset
            svgUrl={`${CDN_URL}/icons/ic-caret-down.svg`}
            className={`${styles.caret_icon} caret_icon`}
          />
        </div>
        <div className={`${styles.price} price`}>
          <Text size="14" fontWeight="regular">
            {walletBalance?.toFixed(4)}
          </Text>
          <SvgInset
            svgUrl={`${CDN_URL}/icons/ic-eth-token.svg`}
            className={`${s.eth_icon} eth_icon`}
          />
        </div>
      </div>
    );
  };

  const ProfileDropdown = () => {
    return (
      <ul className={`${styles.dropdown} dropdown`}>
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

  const showWalletButton = (): boolean => {
    if (!isProduction()) return true;
    if (router.pathname === ROUTE_PATH.ORDER_NOW) {
      return true;
    } else return false;
  };

  useEffect(() => {
    if (refMenu.current) {
      if (isOpenMenu) {
        gsap.to(refMenu.current, { x: 0, duration: 0.6, ease: 'power3.inOut' });
      } else {
        gsap.to(refMenu.current, {
          x: '100%',
          duration: 0.6,
          ease: 'power3.inOut',
        });
      }
    }
  }, [isOpenMenu]);

  return (
    <>
      <header
        ref={refHeader}
        className={`${styles.header} ${styles[theme]} ${
          isOpenMenu ? styles.isMenuOpen : ''
        } ${isDisplay ? styles.isDisplay : ''}`}
      >
        <div className={styles.header_inner}>
          <Container>
            <div className={styles.headerWrapper}>
              <div
                className={`d-flex align-items-center justify-content-between w-100 ${styles.header_row}`}
              >
                <ul className={`${styles.navBar} ${styles[theme]}`}>
                  <li
                    className={cs(
                      activePath === MENU_HEADER[0].activePath && styles.active
                    )}
                    key={`header-${MENU_HEADER[0].id}`}
                  >
                    <Link href={getUrlWithQueryParams(MENU_HEADER[0].route)}>
                      {MENU_HEADER[0].name}
                    </Link>
                  </li>
                  {!isProduction() && (
                    <li
                      className={cs(
                        activePath === MENU_HEADER[3].activePath &&
                          styles.active
                      )}
                      key={`header-${MENU_HEADER[3].id}`}
                    >
                      <Link href={getUrlWithQueryParams(MENU_HEADER[3].route)}>
                        {MENU_HEADER[3].name}
                      </Link>
                    </li>
                  )}
                  {!isProduction() && (
                    <li
                      className={cs(
                        activePath === MENU_HEADER[1].activePath &&
                          styles.active
                      )}
                      key={`header-${MENU_HEADER[1].id}`}
                    >
                      <Link href={getUrlWithQueryParams(MENU_HEADER[1].route)}>
                        {MENU_HEADER[1].name}
                      </Link>
                    </li>
                  )}
                  <li
                    className={cs(
                      activePath === MENU_HEADER[2].activePath && styles.active
                    )}
                    key={`header-${MENU_HEADER[2].id}`}
                  >
                    <Link href={getUrlWithQueryParams(MENU_HEADER[2].route)}>
                      {MENU_HEADER[2].name}
                    </Link>
                  </li>
                </ul>

                <Link
                  className={styles.logo}
                  href={getUrlWithQueryParams(ROUTE_PATH.HOME)}
                >
                  <GenerativeLogo theme={theme} />
                </Link>

                <div className={styles.header_right}>
                  <ul
                    className={`${styles.navBar} ${styles.header_right_links} ${styles[theme]}`}
                  >
                    {!isProduction() && (
                      <li
                        className={cs(
                          activePath === RIGHT_MENU[2].activePath &&
                            styles.active
                        )}
                        key={`header-${RIGHT_MENU[2].id}`}
                      >
                        <Link href={getUrlWithQueryParams(RIGHT_MENU[2].route)}>
                          {RIGHT_MENU[2].name}
                        </Link>
                      </li>
                    )}
                    {!isProduction() && (
                      <li>
                        <a
                          href={SOCIALS.whitepaper}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Whitepaper
                        </a>
                      </li>
                    )}

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
                  {showWalletButton() && (
                    <>
                      {user ? (
                        <div className="position-relative" ref={dropdownRef}>
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
                        <div className={'d-xl-block d-none'}>
                          <ButtonIcon
                            disabled={isConnecting}
                            sizes="small"
                            variants={
                              theme === 'dark' ? 'secondary' : 'primary'
                            }
                            onClick={handleConnectWallet}
                          >
                            {isConnecting ? 'Connecting...' : 'Connect wallet'}
                          </ButtonIcon>
                        </div>
                      )}
                    </>
                  )}

                  <button
                    className={`${styles.btnMenuMobile} ${
                      isOpenMenu ? styles.isOpenMenu : ''
                    }`}
                    onClick={() => setIsOpenMenu(!isOpenMenu)}
                  >
                    <span className={styles.btnMenuMobile_inner}>
                      <SvgInset svgUrl={`${CDN_URL}/icons/ic-close-menu.svg`} />
                      <SvgInset svgUrl={`${CDN_URL}/icons/ic-hamburger.svg`} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </div>
        {isDrops && (
          <div className={styles.topDiscord}>
            Want to launch your art on Bitcoin?
            <a href={SOCIALS.discord} target="_blank" rel="noreferrer">
              {' Join our Discord for direct support.'}
            </a>
          </div>
        )}
      </header>
      {isFaucet && !isProduction() && (
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
        </div>
      )}

      {isDisplay && <QuickBuy />}
      <MenuMobile
        renderProfileHeader={renderProfileHeader}
        ProfileDropdown={ProfileDropdown}
        isConnecting={isConnecting}
        handleConnectWallet={handleConnectWallet}
        ref={refMenu}
        theme={theme}
      />
    </>
  );
};
export default Header;
