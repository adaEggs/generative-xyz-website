import { SOCIALS } from '@constants/common';
import React, { useEffect, useRef } from 'react';
import styles from './Footer.module.scss';
import SvgInset from '@components/SvgInset';
import { Container } from 'react-bootstrap';
import { CDN_URL } from '@constants/config';

interface IProp {
  theme?: 'light' | 'dark';
}

const Footer: React.FC<IProp> = ({ theme = 'light' }): React.ReactElement => {
  const refFooter = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!refFooter.current) return;
    const resize = new ResizeObserver(() => {
      if (!refFooter || !refFooter.current) return;

      const scrollHeight =
        (document.querySelector('main')?.scrollHeight || 0) +
        (document.querySelector('header')?.scrollHeight || 0) +
        refFooter?.current?.getBoundingClientRect().height;

      if (scrollHeight < window.innerHeight) {
        refFooter.current?.classList.add(styles['isFixed']);
      } else {
        refFooter.current?.classList.remove(styles['isFixed']);
      }
    });
    resize.observe(document.querySelector('main') || document.body);
  }, []);

  return (
    <footer
      ref={refFooter}
      className={`${styles.footer} ${styles[theme]} ${styles.isFixed}`}
    >
      <Container>
        <div className={styles.footer_content}>
          <div className={styles.footer_info}>
            <p>Open-source software. Made with ❤️ on Bitcoin.</p>
          </div>
          <div className={styles.footer_right}>
            <ul className={styles.footer_socials}>
              <li>
                <a
                  href={SOCIALS.discord}
                  target="_blank"
                  className={styles.footer_bottomSocialItem}
                  rel="noreferrer"
                >
                  <SvgInset svgUrl={`${CDN_URL}/icons/ic-footer-github.svg`} />
                </a>
              </li>
              <li>
                <a
                  href={SOCIALS.discord}
                  target="_blank"
                  className={styles.footer_bottomSocialItem}
                  rel="noreferrer"
                >
                  <SvgInset svgUrl={`${CDN_URL}/icons/ic-footer-discord.svg`} />
                </a>
              </li>
              <li>
                <a
                  href={SOCIALS.twitter}
                  target="_blank"
                  className={styles.footer_bottomSocialItem}
                  rel="noreferrer"
                >
                  <SvgInset svgUrl={`${CDN_URL}/icons/ic-footer-twitter.svg`} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
