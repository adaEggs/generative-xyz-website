import React from 'react';
import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Link from 'next/link';
import { ROUTE_PATH } from '@constants/route-path';
import Image from 'next/image';
import cs from 'classnames';

const Airdrop: React.FC = (): React.ReactElement => {
  return (
    <div className={s.airdrop}>
      <div className="container">
        <div className={s.headerInfo}>
          <p className={s.phaseText}>Phase 1</p>
          <h1 className={s.headerTitle}>Generative First Airdrop</h1>
          <p className={s.headerDescription}>
            To celebrate this historic milestone, we&apos;re airdropping keys to
            unlock boxes that contain $ART tokens to early supporters of the art
            movement on the Bitcoin network.
          </p>
          <p className={s.headerDescription}>
            Let&apos;s launch a new collection or mint an artwork to receive the
            keys.
          </p>
          <div className={s.navigationWrapper}>
            <Link
              href={ROUTE_PATH.CREATE_BTC_PROJECT}
              className={cs(s.link, s.white)}
            >
              Launch collection
            </Link>
            <Link href={ROUTE_PATH.HOME} className={s.link}>
              Mint artwork
            </Link>
            <Link href={ROUTE_PATH.PROFILE} className={s.link}>
              Check your key
              <SvgInset
                className={s.linkIcon}
                size={20}
                svgUrl={`${CDN_URL}/icons/ic-arrow-right-20x20.svg`}
              />
            </Link>
          </div>
          <div className={s.visualWrapper}>
            <div className={s.visualItem}>
              <Image
                alt="Silver key"
                width={240}
                height={240}
                src={`${CDN_URL}/images/silver-key-1.svg`}
              />
              <p className={cs(s.keyName, s.silver)}>SILVER KEY</p>
            </div>
            <div className={s.visualItem}>
              <Image
                alt="gold key"
                width={240}
                height={240}
                src={`${CDN_URL}/images/gold-key-1.svg`}
              />
              <p className={cs(s.keyName, s.gold)}>GOLD KEY</p>
            </div>
            <div className={s.visualItem}>
              <Image
                alt="magic key"
                width={240}
                height={240}
                src={`${CDN_URL}/images/magic-key-1.svg`}
              />
              <p className={cs(s.keyName, s.magic)}>MAGIC KEY</p>
            </div>
          </div>
        </div>
        <div className={s.mainContent}>
          <div className={s.contentWrapper}>
            <div className="row align-items-center">
              <div className="col-lg-6 col-12">
                <h2 className={s.sectionTitle}>Who will receive the keys?</h2>
                <ul className={s.list}>
                  <li className={s.listItem}>
                    <Image
                      width={14}
                      height={14}
                      src={`${CDN_URL}/icons/ic-dot-14x14.svg`}
                      alt="dot-ic"
                    />
                    <span className={s.listItemText}>
                      As an artist, you need to launch a new collection on
                      Generative.
                    </span>
                  </li>
                  <li className={s.listItem}>
                    <Image
                      width={14}
                      height={14}
                      src={`${CDN_URL}/icons/ic-dot-14x14.svg`}
                      alt="dot-ic"
                    />
                    <span className={s.listItemText}>
                      As a collector you need to mint an artwork on Generative.
                    </span>
                  </li>
                </ul>
                <p className={s.sectionDescription}>
                  There is no limit. Collect as many keys as you like.
                </p>
                <div className={s.navigationWrapper}>
                  <Link
                    href={ROUTE_PATH.CREATE_BTC_PROJECT}
                    className={cs(s.link, s.white)}
                  >
                    Launch collection
                  </Link>
                  <Link href={ROUTE_PATH.HOME} className={s.link}>
                    Mint artwork
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="image__fit">
                  <img src={`${CDN_URL}/images/airdrop-1.svg`} alt="visual" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
