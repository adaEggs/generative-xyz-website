import s from './MenuMobile.module.scss';
import { MENU_HEADER } from '@constants/header';
import cs from 'classnames';
import Link from '@components/Link';
import React, { ForwardedRef } from 'react';
import _isEmpty from 'lodash/isEmpty';
import querystring from 'query-string';
import { useRouter } from 'next/router';
import { SOCIAL_ICONS } from '@constants/icons';
import { SOCIALS } from '@constants/common';
import ButtonIcon from '@components/ButtonIcon';

interface IProp {
  theme?: 'light' | 'dark';
  isConnecting: boolean;
  handleConnectWallet: () => void;
}

const MenuMobile = React.forwardRef(
  (
    { theme, isConnecting, handleConnectWallet }: IProp,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const router = useRouter();
    const { query } = router;
    const activePath = router.asPath.split('/')[1];

    const getUrlWithQueryParams = (url: string): string => {
      if (_isEmpty(query)) {
        return url;
      }
      return `${url}?${querystring.stringify(query)}`;
    };

    return (
      <div ref={ref} className={`${s.menuMobile} ${s[theme || 'light']}`}>
        <div className={s.menuMobile_inner}>
          <ul className={`${s.navBar}`}>
            {MENU_HEADER?.length > 0 &&
              MENU_HEADER.map(item => (
                <li
                  className={cs(activePath === item.activePath && s.active)}
                  key={`header-${item.id}`}
                >
                  <Link href={getUrlWithQueryParams(item.route)}>
                    {item.name}
                  </Link>
                </li>
              ))}

            <li>
              <a href={SOCIALS.docs} target={'_blank'} rel="noreferrer">
                Docs
              </a>
            </li>
          </ul>
          <div className={s.connectWallet}>
            <ButtonIcon
              disabled={isConnecting}
              sizes="small"
              variants={theme === 'dark' ? 'secondary' : 'primary'}
              onClick={handleConnectWallet}
            >
              {isConnecting ? 'Connecting...' : 'Connect wallet'}
            </ButtonIcon>
          </div>
          <ul>
            <li>
              <a href={SOCIALS.twitter} target={'_blank'} rel="noreferrer">
                <img src={SOCIAL_ICONS.discrod} alt="discrod" />
              </a>
            </li>
            <li>
              <a href={SOCIALS.twitter} target={'_blank'} rel="noreferrer">
                <img src={SOCIAL_ICONS.twitter} alt="twitter" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
);

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
