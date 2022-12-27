import s from './hero.module.scss';

import React from 'react';
import Button from '@components/Button';
import { useAppDispatch } from '@redux';
import { setIsOpenCheckoutPopup } from '@redux/general/action';
import { AnimParallax } from '@animations/parallax';
import { AnimFade } from '@animations/fade';
import classNames from 'classnames';
import { AnimHeading } from '@animations/heading';

export const SectionHero = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const openCheckoutPopup = () => dispatch(setIsOpenCheckoutPopup(true));

  return (
    <div className={s.Home_video} id="frame-video">
      <AnimParallax className={s.Home_video_hero}>
        <video autoPlay loop muted preload="auto">
          <source
            src="https://cdn.autonomous.ai/static/upload/images/common/upload/20221220/video8275052af6.mp4"
            type="video/mp4"
          />
        </video>
      </AnimParallax>

      <div className={s.Home_video_content}>
        <AnimHeading
          tag={'h1'}
          className={`${s.Home_video_content_heading} heading heading__supper`}
        >
          Bring your Generative Art to life.
        </AnimHeading>

        <ul className={`${s.Home_video_content_ctas} ul_reset`}>
          <li>
            <AnimFade screen={0.2}>
              <Button
                size="xl"
                variant="cta-anim"
                className={classNames(s.Home_video_content_ctas_orderBtn)}
                onClick={openCheckoutPopup}
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
                onClick={openCheckoutPopup}
              >
                <span className="text">Book a tour</span>
              </Button>
            </AnimFade>
          </li>
        </ul>
        <AnimFade className={s.Home_video_content_ctas_play} screen={0.6}>
          <Button
            size="xl"
            variant="cta-none"
            className={classNames(
              s.Home_video_content_ctas_playBtn,
              'js-anim-fade'
            )}
            onClick={openCheckoutPopup}
          >
            <span className="icon">
              <svg
                width="6"
                height="7"
                viewBox="0 0 6 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.2195 2.7045L1.86066 0.649117C1.19189 0.240601 0.333252 0.719591 0.333252 1.50142V5.49813C0.333252 6.27996 1.19296 6.76002 1.86066 6.35043L5.2195 4.29505C5.81574 3.93134 5.81574 3.06928 5.2195 2.7045Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="text">Play Video</span>
          </Button>
        </AnimFade>
      </div>
    </div>
  );
};