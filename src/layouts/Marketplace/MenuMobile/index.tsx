import ButtonIcon from '@components/ButtonIcon';
import Link from '@components/Link';
import SvgInset from '@components/SvgInset';
import { SOCIALS } from '@constants/common';
import { MENU_HEADER, RIGHT_MENU } from '@constants/header';
import { SOCIAL_ICONS } from '@constants/icons';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { isProduction } from '@utils/common';
import cs from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import querystring from 'query-string';
import React, { ForwardedRef, ReactNode } from 'react';
import s from './MenuMobile.module.scss';

interface IProp {
  theme?: 'light' | 'dark';
  isConnecting: boolean;
  handleConnectWallet: () => void;
  renderProfileHeader: () => ReactNode;
  ProfileDropdown: () => ReactNode;
}

const MenuMobile = React.forwardRef(
  (
    {
      theme,
      isConnecting,
      handleConnectWallet,
      renderProfileHeader,
      ProfileDropdown,
    }: IProp,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const router = useRouter();
    const { query } = router;
    const activePath = router.asPath.split('/')[1];
    const user = useAppSelector(getUserSelector);

    const getUrlWithQueryParams = (url: string): string => {
      if (_isEmpty(query)) {
        return url;
      }
      return `${url}?${querystring.stringify(query)}`;
    };

    // const showWalletButton = (): boolean => {
    //   if (!isProduction()) return true;
    //   if (router.pathname === ROUTE_PATH.ORDER_NOW) {
    //     return true;
    //   } else return false;
    // };

    return (
      <div ref={ref} className={`${s.menuMobile} ${s[theme || 'light']}`}>
        <div className={s.menuMobile_inner}>
          <ul className={`${s.navBar}`}>
            <li
              className={cs(
                activePath === MENU_HEADER[0].activePath && s.active
              )}
              key={`header-${MENU_HEADER[0].id}`}
            >
              <Link href={getUrlWithQueryParams(MENU_HEADER[0].route)}>
                {MENU_HEADER[0].name}
              </Link>
            </li>
            {
              <li
                className={cs(
                  activePath === MENU_HEADER[3].activePath && s.active
                )}
                key={`header-${MENU_HEADER[3].id}`}
              >
                <Link href={getUrlWithQueryParams(MENU_HEADER[3].route)}>
                  {MENU_HEADER[3].name}
                </Link>
              </li>
            }
            <li
              className={cs(
                activePath === MENU_HEADER[2].activePath && s.active
              )}
              key={`header-${MENU_HEADER[2].id}`}
            >
              <Link href={getUrlWithQueryParams(MENU_HEADER[2].route)}>
                {MENU_HEADER[2].name}
              </Link>
            </li>
            <li
              className={cs(
                activePath === MENU_HEADER[4].activePath && s.active
              )}
              key={`header-${MENU_HEADER[4].id}`}
            >
              <Link
                className={
                  MENU_HEADER[4].activePath === 'inscribe' ? s.inscribe : ''
                }
                href={getUrlWithQueryParams(MENU_HEADER[4].route)}
              >
                {MENU_HEADER[4].name}
              </Link>
            </li>
            {!isProduction() && (
              <li
                className={cs(
                  activePath === RIGHT_MENU[2].activePath && s.active
                )}
                key={`header-${RIGHT_MENU[2].id}`}
              >
                <a
                  href={getUrlWithQueryParams(RIGHT_MENU[2].route)}
                  target={'_blank'}
                  rel="noreferrer"
                >
                  {RIGHT_MENU[2].name}
                </a>
              </li>
            )}

            {!isProduction() && (
              <li>
                <a href={SOCIALS.whitepaper} target={'_blank'} rel="noreferrer">
                  Whitepaper
                </a>
              </li>
            )}
          </ul>
          <div className={`${s.menuMobile_bottom} ${user ? s.hasUser : ''}`}>
            {/* {showWalletButton() && ( */}
            <div className={`${s.connectWallet}`}>
              {user ? (
                <div className="position-relative">
                  {renderProfileHeader()}
                  {ProfileDropdown()}
                </div>
              ) : (
                <div className={s.menuMobile_bottom_cta}>
                  <ButtonIcon
                    disabled={isConnecting}
                    sizes="medium"
                    variants={theme === 'dark' ? 'secondary' : 'primary'}
                    onClick={handleConnectWallet}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect wallet'}
                  </ButtonIcon>
                </div>
              )}
            </div>
            {/* )} */}

            <ul className={s.menuMobile_bottom_socials}>
              <li>
                <a href={SOCIALS.twitter} target={'_blank'} rel="noreferrer">
                  <SvgInset svgUrl={SOCIAL_ICONS.discrod} />
                </a>
              </li>
              <li>
                <a href={SOCIALS.twitter} target={'_blank'} rel="noreferrer">
                  <SvgInset svgUrl={SOCIAL_ICONS.twitter} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
