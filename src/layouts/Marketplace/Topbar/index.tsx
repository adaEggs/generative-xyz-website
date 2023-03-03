import { SOCIALS } from '@constants/common';
import Link from 'next/link';
import React from 'react';
import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import cs from 'classnames';
import SvgInset from '@components/SvgInset';

const Topbar: React.FC = (): React.ReactElement => {
  return (
    <div className={s.topbar}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className={s.left}>
            <p className={s.text}>
              New artist?{' '}
              <Link
                className={s.startedLink}
                target="_blank"
                href={SOCIALS.docsForArtist}
              >
                Start here.
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