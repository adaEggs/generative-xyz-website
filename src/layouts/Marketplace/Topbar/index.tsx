import { SOCIALS } from '@constants/common';
import Link from 'next/link';
import React from 'react';
import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import cs from 'classnames';
import SvgInset from '@components/SvgInset';
import { ROUTE_PATH } from '@constants/route-path';
import Image from 'next/image';

const Topbar: React.FC = (): React.ReactElement => {
  return (
    <div className={s.topbar}>
      <div className="container">
        <div className={s.wrapper}>
          <div className={s.left}>
            <p className={s.text}>
              New artist?{' '}
              <Link className={s.startedLink} href={ROUTE_PATH.ARTISTS}>
                Start here.
              </Link>
            </p>
          </div>

          <div className={s.center}>
            <SvgInset
              size={18}
              svgUrl={`${CDN_URL}/icons/ic-shield-star-24x24.svg`}
            />
            <p className={s.centerText}>
              Preserve your valuable Ethereum CryptoArt and NFTs on
              Bitcoin.&nbsp;
              <Link href={ROUTE_PATH.PRESERVE}>
                Learn more &nbsp;
                <Image
                  alt="icon"
                  className={s.arrowIcon}
                  width={14}
                  height={14}
                  src={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                />
              </Link>
            </p>
          </div>

          <div
            className={cs(
              s.right,
              'd-flex align-items-center justify-content-between'
            )}
          >
            <Link
              className={s.socialLink}
              target="_blank"
              href={SOCIALS.discord}
            >
              <SvgInset
                size={18}
                svgUrl={`${CDN_URL}/icons/ic-discord-18x18.svg`}
              />
            </Link>

            <Link
              className={s.socialLink}
              target="_blank"
              href={SOCIALS.twitter}
            >
              <SvgInset
                size={18}
                svgUrl={`${CDN_URL}/icons/ic-twitter-18x18.svg`}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
