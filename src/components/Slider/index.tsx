import React from 'react';
import SliderSlick from 'react-slick';
import cn from 'classnames';

import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';

import s from './Slider.module.scss';

interface IProps {
  children?: JSX.Element | unknown;
  className?: string;
  settings?: Record<string, unknown>;
}

interface ArrowBase {
  className?: string;
  onClick?: (...args: unknown[]) => void;
}

const NextArrow: React.FC<ArrowBase> = ({ className, onClick }) => {
  return (
    <button
      type="button"
      aria-label="previous button"
      className={cn(className, s.slider_arrow, s.slider_next)}
      onClick={onClick}
    >
      <div className={cn(s.slider_arrowInner, 'slick-arrow-inner')}>
        <SvgInset svgUrl={`${CDN_URL}/icons/arrow-right-slider.svg`} />
      </div>
    </button>
  );
};

const PrevArrow: React.FC<ArrowBase> = ({ className, onClick }) => {
  return (
    <button
      type="button"
      aria-label="next button"
      className={cn(className, s.slider_arrow, s.slider_prev)}
      onClick={onClick}
    >
      <div className={cn(s.slider_arrowInner, 'slick-arrow-inner')}>
        <SvgInset svgUrl={`${CDN_URL}/icons/arrow-left.svg`} />
      </div>
    </button>
  );
};

const defaultSettings = {
  dots: false,
  arrows: false,
  infinite: false,
  speed: 500,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  className: s.slider_content,
  dotsClass: `slick-dots ${s.slider_dots}`,
  customPaging: (i: string | number | null | undefined) => {
    return <div className={cn(s.slider_dot, 'slider_dot')}>{i}</div>;
  },
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    // you can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ],
  lazyLoad: 'progressively',
};

const Slider = ({ children, className, settings }: IProps): JSX.Element => {
  const mergedSetting = {
    ...defaultSettings,
    ...settings,
  };
  return (
    <div className={cn(className, s.slider_container)}>
      <SliderSlick {...mergedSetting}>{children}</SliderSlick>
    </div>
  );
};

export default React.memo(Slider);
