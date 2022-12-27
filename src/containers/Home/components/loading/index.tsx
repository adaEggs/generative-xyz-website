import { gsap } from 'gsap';
import s from './loading.module.scss';
import { useSelector } from 'react-redux';
import { animationRegister } from '@redux/general/selector';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@redux';
import { setPageLoadStatus } from '@redux/general/action';
import { PAGE_LOADED, PAGE_ENTER, LOGO_URL } from '@constants/common';

interface IProcessing {
  value: number;
  delta: number;
  persen: number;
  loaded: boolean;
}

export const Loading = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const refLoading = useRef<HTMLDivElement>(null);
  const refPersent = useRef<HTMLSpanElement>(null);
  const loadingCounter = useSelector(animationRegister);
  const processing = useRef<IProcessing>({
    value: 0,
    delta: 1,
    persen: 0,
    loaded: false,
  });

  const loadingComplete = () => {
    dispatch(setPageLoadStatus(PAGE_LOADED));
    gsap.to(refLoading.current, {
      clipPath: 'inset(0 0 100% 0)',
      ease: 'power3.inOut',
      duration: 1,
      onComplete: () => {
        if (refLoading.current) {
          refLoading.current.style.display = 'none';
        }
        document.body.classList.remove('is-loading');
      },
    });

    setTimeout(() => dispatch(setPageLoadStatus(PAGE_ENTER)), 500);
  };

  const looper = () => {
    if (!processing.current || !refPersent.current) return;

    processing.current.persen += processing.current.delta;
    processing.current.persen = Math.min(processing.current.persen, 100);

    refPersent.current.textContent = `${Math.floor(
      processing.current.persen
    )}%`;

    if (processing.current.persen >= 100) {
      gsap.ticker.remove(looper);
      loadingComplete();
    }

    if (!processing.current.loaded) {
      processing.current.delta *= 0.9;
    } else {
      processing.current.delta = 2;
    }
  };

  useEffect(() => {
    document.body.classList.add('is-loading', 'hide-scroller');
    const loadContent = gsap.context(() => {
      gsap.ticker.add(looper);
      if (loadingCounter <= 0 && refLoading.current) {
        processing.current.loaded = true;
      }
    }, refLoading);

    return () => {
      document.body.classList.remove('is-loading');
      gsap.ticker.remove(looper);
      loadContent.revert();
    };
  }, [loadingCounter]);

  return (
    <div ref={refLoading} className={s.loading}>
      <div className={s.loading_inner}>
        <img src={LOGO_URL} alt={'logo-url'} />
        <h5 className={s.loading_text}>a whole new experience</h5>
        <span ref={refPersent}>0%</span>
      </div>
    </div>
  );
};