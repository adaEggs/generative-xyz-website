import Link from '@components/Link';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
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
import { MENU_HEADER } from '@constants/header';
import MenuMobile from '@layouts/Marketplace/MenuMobile';
import { gsap } from 'gsap';
import SearchCollection from './SearchCollection';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import Image from 'next/image';

const LOG_PREFIX = 'MarketplaceHeader';

interface IProp {
  theme?: 'light' | 'dark';
  isShowFaucet?: boolean;
  isDisplay?: boolean;
  isDrops?: boolean;
}

const Header: React.FC<IProp> = ({
  theme = 'light',
  isDisplay = false,
}): React.ReactElement => {
  const { connect, disconnect, walletBalance } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const { query } = router;
  const activePath = router.pathname.split('/')[1];
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const refMenu = useRef<HTMLDivElement | null>(null);
  const freeToolsRef = useRef<HTMLLIElement | null>(null);
  const [isOpenFreetools, setIsOpenFreetools] = useState(false);

  const PROFILE_MENU = [
    {
      id: 'view-profile',
      name: 'View Profile',
      onClick: (btcAddress?: string) =>
        router.push(`${ROUTE_PATH.PROFILE}/${btcAddress}`),
    },
    {
      id: 'disconect-wallet',
      name: 'Disconnect wallet',
      onClick: () => {
        disconnect().then(() => {
          router.replace(ROUTE_PATH.HOME);
        });
      },
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

  const handleOpenFreetoolsDropdown = (): void => {
    setIsOpenFreetools(true);
  };

  useOnClickOutside(freeToolsRef, () => setIsOpenFreetools(false));

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
      router.push(ROUTE_PATH.PROFILE);
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

  const renderFreeToolsDropDown = (): React.ReactElement => {
    return (
      <div
        className={cs(styles.freeToolsDropdown, {
          [`${styles.show}`]: isOpenFreetools,
        })}
      >
        <ul className={styles.freeToolList}>
          <li className={cs(styles.freeToolItem, styles.disabled)}>
            <a>
              <Image
                src={`${CDN_URL}/icons/ic-shield-star-34x34.svg`}
                width={34}
                height={34}
                alt="ic-percent-circle"
              />
              <div className={styles.menuContent}>
                <p className={styles.mainText}>{MENU_HEADER[9].name}</p>
                <p className={styles.subText}>
                  Inscribe your existing Ethereum NFTs onto Bitcoin.
                </p>
              </div>
            </a>
          </li>
          <li className={styles.freeToolItem}>
            <Link href={getUrlWithQueryParams(MENU_HEADER[7].route)}>
              <Image
                src={`${CDN_URL}/icons/ic-percent-circle-34x34.svg`}
                width={34}
                height={34}
                alt="ic-percent-circle"
              />
              <div className={styles.menuContent}>
                <p className={styles.mainText}>{MENU_HEADER[7].name}</p>
                <p className={styles.subText}>
                  The easiest way to inscribe anything.
                </p>
              </div>
            </Link>
          </li>
          <li className={styles.freeToolItem}>
            <Link href={getUrlWithQueryParams(MENU_HEADER[5].route)}>
              <Image
                src={`${CDN_URL}/icons/ic-poll-vertical-square-34x34.svg`}
                width={34}
                height={34}
                alt="ic-percent-circle"
              />
              <div className={styles.menuContent}>
                <p className={styles.mainText}>Ordinals Live Feed</p>
                <p className={styles.subText}>
                  Watch the latest inscriptions live.
                </p>
              </div>
            </Link>
          </li>
        </ul>
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
                  onClick={() => {
                    if (item.id !== 'view-profile') {
                      item.onClick(user?.walletAddressBtcTaproot || '');
                    } else {
                      item.onClick();
                    }
                  }}
                  key={item.id}
                >
                  {item.name}
                </li>
              )
          )}
      </ul>
    );
  };

  const refHeader = useRef<HTMLDivElement>(null);

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

  const handleYourVault = () => {
    if (user) {
      router.push(`${ROUTE_PATH.PROFILE}/${user?.walletAddressBtcTaproot}`);
    } else {
      handleConnectWallet();
    }
  };

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
                <div className={styles.header_left}>
                  <Link
                    className={styles.logo}
                    href={getUrlWithQueryParams(ROUTE_PATH.HOME)}
                  >
                    <Text size="24" fontWeight={'semibold'}>
                      Generative
                    </Text>
                  </Link>
                  <ul className={`${styles.navBar} ${styles[theme]}`}>
                    <li
                      className={cs(
                        activePath === MENU_HEADER[0].activePath ||
                          (activePath === '' && styles.active)
                      )}
                      key={`header-${MENU_HEADER[0].id}`}
                    >
                      <Link href={getUrlWithQueryParams(MENU_HEADER[0].route)}>
                        {MENU_HEADER[0].name}
                      </Link>
                    </li>

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

                    <li
                      className={cs(
                        activePath === MENU_HEADER[2].activePath &&
                          styles.active
                      )}
                      key={`header-${MENU_HEADER[2].id}`}
                    >
                      <Link href={getUrlWithQueryParams(MENU_HEADER[2].route)}>
                        {MENU_HEADER[2].name}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className={styles.header_right}>
                  <SearchCollection theme={theme} />

                  <ul className={`${styles.navBar} ${styles[theme]}`}>
                    <li
                      ref={freeToolsRef}
                      onClick={handleOpenFreetoolsDropdown}
                      className={cs(styles.freeTools, {
                        [`${styles.active}`]:
                          activePath === MENU_HEADER[7].activePath,
                      })}
                    >
                      <a>
                        Free tools
                        <SvgInset
                          className={styles.arrowIcon}
                          svgUrl={`${CDN_URL}/icons/ic-chevron-down-20x20.svg`}
                          size={20}
                        />
                      </a>
                      {renderFreeToolsDropDown()}
                    </li>

                    <li
                      className={cs(
                        activePath === MENU_HEADER[8].activePath &&
                          styles.active
                      )}
                    >
                      <Link href={getUrlWithQueryParams(MENU_HEADER[8].route)}>
                        {MENU_HEADER[8].name}
                      </Link>
                    </li>

                    {!!user && (
                      <li
                        className={cs(
                          activePath === 'profile' && styles.active
                        )}
                        key={`header-profile`}
                      >
                        <a
                          className={styles.yourVault}
                          onClick={handleYourVault}
                        >
                          WALLET
                        </a>
                      </li>
                    )}
                    {!user && (
                      <li
                        className={cs(
                          activePath === MENU_HEADER[6].activePath &&
                            styles.active
                        )}
                        key={`header-${MENU_HEADER[6].id}`}
                      >
                        <Link
                          href={getUrlWithQueryParams(MENU_HEADER[6].route)}
                        >
                          {MENU_HEADER[6].name}
                        </Link>
                      </li>
                    )}
                  </ul>

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
      </header>

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
