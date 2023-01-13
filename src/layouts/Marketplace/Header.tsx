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
import { getScrollTop } from '@helpers/common';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import s from '@layouts/Default/components/HeaderFixed/Header.module.scss';
import { useAppSelector } from '@redux';
import { disabledMenuSelector } from '@redux/general/selector';
import { getUserSelector } from '@redux/user/selector';
import { formatAddress } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styles from './Header.module.scss';
import { getFaucetLink, isTestnet } from '@utils/chain';
import QuickBuy from '@layouts/Marketplace/QuickBuy';

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
  const activePath = router.asPath.split('/')[1];
  const [openProfile, setOpenProfile] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isFaucet, _] = useState<boolean>(isShowFaucet);
  const [isHide, setIsHide] = useState<boolean>(false);

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
          <Text size="14" fontWeight="semibold">
            {user.displayName || formatAddress(user.walletAddress)}
          </Text>
          <SvgInset
            svgUrl={`${CDN_URL}/icons/ic-caret-down.svg`}
            className={styles.caret_icon}
          ></SvgInset>
        </div>
        <div className={styles.price}>
          {walletBalance?.toFixed(4)}
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
  const refData = useRef({
    scrollCurrent: 0,
    isHide: false,
    disabled: false,
    lock: false,
  });
  const disabledMenu = useSelector(disabledMenuSelector);

  const hideMenu = () => {
    refData.current.isHide = true;
    gsap.killTweensOf(refHeader.current);
    gsap.to(refHeader.current, {
      y: '-105%',
      duration: 0.6,
      ease: 'power3.out',
    });
    setIsHide(true);
  };

  const showMenu = () => {
    refData.current.isHide = false;
    setIsHide(false);
    gsap.killTweensOf(refHeader.current);
    gsap.to(refHeader.current, { y: '0%', duration: 0.6, ease: 'power3.out' });
  };

  const onWinScrolling = () => {
    if (refData.current.lock) return;
    const scrollTop = getScrollTop();
    if (scrollTop - refData.current.scrollCurrent > 0 && scrollTop > 100) {
      if (!refData.current.isHide) {
        hideMenu();
      }
    } else {
      if (refData.current.isHide) {
        showMenu();
      }
    }

    if (refHeader.current) {
      if (scrollTop > 100) {
        refHeader.current.classList.add(s['is-scrolling']);
      } else {
        refHeader.current.classList.remove(s['is-scrolling']);
      }
    }
    refData.current.scrollCurrent = scrollTop;
  };

  useEffect(() => {
    // const lcStoreFaucet = localStorage.getItem('close_faucet');
    // setIsFaucet(!lcStoreFaucet && isShowFaucet);
    // setIsFaucet(true);

    window.addEventListener('scroll', onWinScrolling);
    return () => {
      if (refHeader.current)
        refHeader.current.classList.remove(s['is-scrolling']);
      window.removeEventListener('scroll', onWinScrolling);
    };
  }, []);

  useEffect(() => {
    refData.current.lock = disabledMenu;
    if (disabledMenu) {
      hideMenu();
    }
    return () => {
      refData.current.lock = false;
      showMenu();
    };
  }, [disabledMenu]);

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
                        <Link href={item.route}>{item.name}</Link>
                      </li>
                    ))}
                </ul>

                <Link className={styles.logo} href={ROUTE_PATH.HOME}>
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
                        Connect wallet
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
      {isDisplay && <QuickBuy isShow={isHide && !disabledMenu} />}
    </>
  );
};
export default Header;
