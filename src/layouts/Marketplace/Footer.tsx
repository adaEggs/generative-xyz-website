import { CONTACT_EMAIL, SOCIALS } from '@constants/common';
import React, { useEffect, useRef } from 'react';
import styles from './Footer.module.scss';
import SvgInset from '@components/SvgInset';
import { Container } from 'react-bootstrap';

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
    <footer ref={refFooter} className={`${styles.footer} ${styles[theme]}`}>
      <Container>
        <div className={styles.footer_content}>
          <div className={styles.footer_info}>
            <p>© 2023 Generative</p>
          </div>
          <div className={styles.footer_right}>
            <div className={styles.footer_contact}>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
            <ul className={styles.footer_socials}>
              <li>
                <a
                  href={SOCIALS.discord}
                  target="_blank"
                  className={styles.footer_bottomSocialItem}
                  rel="noreferrer"
                >
                  <SvgInset
                    svgUrl={
                      'https://cdn.autonomous.ai/static/upload/images/common/upload/20221012/Groupaa7416858b.svg'
                    }
                  />
                </a>
              </li>
              <li>
                <a
                  href={SOCIALS.twitter}
                  target="_blank"
                  className={styles.footer_bottomSocialItem}
                  rel="noreferrer"
                >
                  <SvgInset
                    svgUrl={
                      'https://cdn.autonomous.ai/static/upload/images/common/upload/20221012/Group-10ab2c8e17e.svg'
                    }
                  />
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
