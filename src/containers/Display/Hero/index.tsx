import { gsap } from 'gsap';
import s from './hero.module.scss';

import { AnimFade } from '@animations/fade';
import { AnimHeading } from '@animations/heading';
import { AnimParallax } from '@animations/parallax';
import Button from '@components/Button';
import { SOCIALS } from '@constants/common';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const SectionHero = (): JSX.Element => {
  const router = useRouter();

  const onClick = () => {
    router.push(ROUTE_PATH.ORDER_NOW);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ScrollToPlugin = require('gsap/ScrollToPlugin').default;
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  return (
    <div className={s.Home_video} id="frame-video">
      <AnimParallax className={s.Home_video_hero}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={`${CDN_URL}/pages/home/post-hero.jpeg`}
        >
          <source
            src={`${CDN_URL}/pages/home/videos/Block%201-1.webm`}
            type="video/webm"
          />
          <source
            src={`${CDN_URL}/pages/home/Block-v2-1-1.mp4`}
            type="video/mp4"
          />
        </video>
      </AnimParallax>

      <div className={`${s.Home_video_content} container`}>
        <AnimHeading
          tag={'h2'}
          className={`${s.Home_video_content_heading} heading heading__large`}
        >
          Grail
        </AnimHeading>

        <AnimHeading
          tag={'h3'}
          screen={0.1}
          className={`${s.Home_video_content_content} heading heading__medium`}
        >
          Bring your generative art to life.
        </AnimHeading>

        <ul className={`${s.Home_video_content_ctas} ul_reset`}>
          <li>
            <AnimFade screen={0.2}>
              <Button
                size="xl"
                variant="cta-anim"
                className={classNames(s.Home_video_content_ctas_orderBtn)}
                onClick={onClick}
              >
                <span className="text">Order Now</span>
              </Button>
            </AnimFade>
          </li>
          <li>
            <AnimFade screen={0.4}>
              <Button
                size="xl"
                variant="cta-border"
                className={classNames(
                  s.Home_video_content_ctas_bookBtn,
                  'js-anim-fade'
                )}
                onClick={() => {
                  window.open(SOCIALS.bookATour);
                }}
              >
                <span className="text">Visit showroom</span>
              </Button>
            </AnimFade>
          </li>
        </ul>
        {/* <AnimFade screen={0.6}>
          <Link
            href={EXTERNAL_LINK.CALENDLY}
            target={'_blank'}
            className={s.Home_video_content_connect_cta}
          >
            TALK TO OUR TEAM
          </Link>
        </AnimFade> */}

        {/*<AnimFade className={s.Home_video_content_ctas_play} screen={0.6}>*/}
        {/*  <Button*/}
        {/*    size="xs"*/}
        {/*    variant="cta-none"*/}
        {/*    className={classNames(*/}
        {/*      s.Home_video_content_ctas_playBtn,*/}
        {/*      'js-anim-fade'*/}
        {/*    )}*/}
        {/*    onClick={openCheckoutPopup}*/}
        {/*  >*/}
        {/*    <span className="icon">*/}
        {/*      <svg*/}
        {/*        width="6"*/}
        {/*        height="7"*/}
        {/*        viewBox="0 0 6 7"*/}
        {/*        fill="none"*/}
        {/*        xmlns="http://www.w3.org/2000/svg"*/}
        {/*      >*/}
        {/*        <path*/}
        {/*          d="M5.2195 2.7045L1.86066 0.649117C1.19189 0.240601 0.333252 0.719591 0.333252 1.50142V5.49813C0.333252 6.27996 1.19296 6.76002 1.86066 6.35043L5.2195 4.29505C5.81574 3.93134 5.81574 3.06928 5.2195 2.7045Z"*/}
        {/*          fill="white"*/}
        {/*        />*/}
        {/*      </svg>*/}
        {/*    </span>*/}
        {/*    <span className="text">Play Video</span>*/}
        {/*  </Button>*/}
        {/*</AnimFade>*/}
      </div>
    </div>
  );
};
