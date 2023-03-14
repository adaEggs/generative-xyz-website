import React from 'react';
import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Link from 'next/link';
import { ROUTE_PATH } from '@constants/route-path';
import Image from 'next/image';
import cs from 'classnames';
import { SOCIALS } from '@constants/common';

const Airdrop: React.FC = (): React.ReactElement => {
  return (
    <div className={s.airdrop}>
      <div className="container">
        <div className={s.headerInfo}>
          <p className={s.phaseText}>Phase 0</p>
          <h1 className={s.headerTitle}>Generative Airdrop 0</h1>
          <p className={s.headerDescription}>
            To celebrate this historic milestone, we&apos;re airdropping keys to
            early supporters of the art movement on the Bitcoin network. The
            mystery of what the keys open remains unsolved.
          </p>
          <p className={cs(s.headerDescription, s.mb24)}>
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
              <p className={cs(s.keyName, s.gold)}>GOLDEN KEY</p>
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
                <p className={s.sectionSubDescription}>
                  Launch well-executed collections or mint fine artwork for a
                  better chance of getting the keys.
                </p>
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
          <div className={s.contentWrapper}>
            <div className="row align-items-center">
              <div className="col-lg-6 col-12">
                <div className="image__fit">
                  <img src={`${CDN_URL}/images/airdrop-4.svg`} alt="visual" />
                </div>
              </div>
              <div className={cs('col-lg-6 col-12', s.rightContent)}>
                <h2 className={s.sectionTitle}>
                  What will the keys do for you?
                </h2>
                <p className={s.sectionSubDescription}>
                  Let the story begins. There are many keys out there including:
                  Silver Key, Golden Key, and Magic Key—which is extremely rare.
                  You take the first step on a mysterious journey. Keep an eye
                  out for the next episode.
                </p>
                <a
                  className={s.discordLink}
                  href={SOCIALS.discord}
                  target="_blank"
                >
                  Join our Discord to find more clues
                  <SvgInset
                    className={s.linkIcon}
                    size={20}
                    svgUrl={`${CDN_URL}/icons/ic-arrow-right-20x20.svg`}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
