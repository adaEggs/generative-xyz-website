import s from 'MenuMobile.module.scss';
import styles from '@layouts/Marketplace/Header.module.scss';
import { MENU_HEADER, RIGHT_MENU } from '@constants/header';
import cs from 'classnames';
import Link from '@components/Link';
import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import querystring from 'query-string';
import { useRouter } from 'next/router';
import { SOCIAL_ICONS } from '@constants/icons';
import { SOCIALS } from '@constants/common';

interface IProp {
  theme: 'theme' | 'dark';
}

export const MenuMobile = ({ theme }: IProp): JSX.Element => {
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
    <div className={s.menuMobile}>
      <ul className={`${styles.navBar} ${styles[theme]}`}>
        {MENU_HEADER?.length > 0 &&
          MENU_HEADER.map(item => (
            <li
              className={cs(activePath === item.activePath && styles.active)}
              key={`header-${item.id}`}
            >
              <Link href={getUrlWithQueryParams(item.route)}>{item.name}</Link>
            </li>
          ))}

        <li>
          <a href={SOCIALS.docs} target={'_blank'} rel="noreferrer">
            Docs
          </a>
        </li>
      </ul>
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
  );
};
