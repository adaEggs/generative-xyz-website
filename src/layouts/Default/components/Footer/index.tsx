import { LOGO_URL } from '@constants/common';
import Link from 'next/link';
import React from 'react';
import { Container } from 'react-bootstrap';

import s from './Footer.module.scss';
import SvgInset from '@components/SvgInset';

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className={s.Footer}>
      <Container className={s.Footer_container}>
        <div className={s.Footer_item}>
          <Link href="/">
            <span className={s.Footer_logo}>
              <SvgInset svgUrl={LOGO_URL} />
            </span>
          </Link>
          {/* <nav className={s.Footer_topMenuContainer}>
            {MENUS.map((item, i) => (
              <a
                href={item.url}
                key={`${item.url}_${i}`}
                className={s.Footer_topMenuItem}
              >
                {item.title}
              </a>
            ))}
          </nav> */}
        </div>
        <div className={s.Footer_item}>
          <a href="#" className={s.Footer_bottomMenuItem}>
            FAQs
          </a>
          <a href="#" className={s.Footer_bottomMenuItem}>
            Terms of Service
          </a>
          <a href="#" className={s.Footer_bottomMenuItem}>
            Privacy Policy
          </a>
          <div className={s.Footer_bottomMenuDivider} />
          <a href="#" className={s.Footer_bottomSocialItem}>
            <SvgInset
              svgUrl={
                'https://cdn.autonomous.ai/static/upload/images/common/upload/20221012/Groupaa7416858b.svg'
              }
            />
          </a>
          <a href="#" className={s.Footer_bottomSocialItem}>
            <SvgInset
              svgUrl={
                'https://cdn.autonomous.ai/static/upload/images/common/upload/20221012/Group-4f946092924.svg'
              }
            />
          </a>
          <a href="#" className={s.Footer_bottomSocialItem}>
            <SvgInset
              svgUrl={
                'https://cdn.autonomous.ai/static/upload/images/common/upload/20221012/Group-3ac59247dce.svg'
              }
            />
          </a>
          <a href="#" className={s.Footer_bottomSocialItem}>
            <SvgInset
              svgUrl={
                'https://cdn.autonomous.ai/static/upload/images/common/upload/20221012/Group-2f730d78793.svg'
              }
            />
          </a>
          <a href="#" className={s.Footer_bottomSocialItem}>
            <SvgInset
              svgUrl={
                'https://cdn.autonomous.ai/static/upload/images/common/upload/20221012/Group-10ab2c8e17e.svg'
              }
            />
          </a>
          {/*<a*/}
          {/*  href={`mailto:${CONTACT_EMAIL}`}*/}
          {/*  className={s.Footer_bottomMenuItem}*/}
          {/*>*/}
          {/*  {`Contact us: ${CONTACT_EMAIL}`}*/}
          {/*</a>*/}
          <div className={s.Footer_copyright}>© 2022 Generative.</div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
