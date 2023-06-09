import React, {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from 'react';
import s from './styles.module.scss';
import cs from 'classnames';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import { debounce } from 'lodash';
import { Anim } from '@animations/anim';
import { PAGE_ENTER } from '@constants/common';
import {
  getDelay,
  getRandomArbitrary,
  getRandomArbitraryFloat,
} from '@utils/animation';
import { LoadingContext } from '@contexts/loading-context';

type TText = {
  as?:
    | 'p'
    | 'span'
    | 'strong'
    | 'em'
    | 'sub'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'a'
    | 'label';
  fontWeight?: 'bold' | 'semibold' | 'medium' | 'regular' | 'light';
  style?: CSSProperties;
  size?: '11' | '12' | '14' | '16' | '18' | '20' | '24' | 'd1' | 'd2' | 'd3';
  color?: string;
  className?: string;
  animOption?: {
    screen: number;
    offset: number;
    type: 'heading' | 'random' | 'paragraph';
  };
  onClick?: () => void;
  htmlFor?: string;
  title?: string;
};

interface IProRefDom {
  resizeObserver?: ResizeObserver;
  texts?: SplitType;
  text?: string;
  runned?: boolean;
  finalRunTexts?: string[];
  chars?: string[];
  arrText?: string[];
}

const Text = ({
  as = 'p',
  children,
  fontWeight = 'regular',
  size = '16',
  style,
  color,
  className,
  animOption = undefined,
  onClick,
  title,
  ...props
}: PropsWithChildren<TText>) => {
  const Text = as;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comp = useRef<any>(null);
  const refDom = useRef<IProRefDom>({});
  const { pageLoadStatus } = useContext(LoadingContext);

  useEffect(() => {
    if (!animOption) return;
    const anim = gsap.context(() => {
      if (comp.current) {
        switch (animOption.type) {
          case 'heading':
            comp.current.classList.add(`is-handle`);
            refDom.current.texts = new SplitType(comp.current, {
              types: 'words, chars',
            });

            refDom.current.resizeObserver = new ResizeObserver(
              debounce(() => {
                if (refDom.current.texts && !refDom.current.runned) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  refDom.current.texts?.split();
                  gsap.killTweensOf(refDom.current.texts.chars);
                  gsap.set(refDom.current.texts.chars, { opacity: '0' });
                }
              }, 100)
            );
            refDom.current.resizeObserver.observe(comp.current);
            break;

          case 'random':
            comp.current.classList.add(`is-handle`);
            refDom.current.text = comp.current.textContent || '';
            comp.current.textContent = '';
            refDom.current.arrText = (refDom.current.text || '').split('');

            refDom.current.finalRunTexts = [];
            refDom.current.chars = '@#$%&qaertyuiopasdfghjklzxcvbnm'.split('');
            break;

          case 'paragraph':
            comp.current.classList.add(`is-handle`);
            gsap.set(comp.current, { opacity: '0', y: 50 });
            break;
        }
      }
    }, [comp]);

    return () => {
      anim.revert();
      switch (animOption.type) {
        case 'heading':
          if (refDom.current) {
            comp.current?.classList.remove(`is-handle`);
            refDom.current?.texts && refDom.current.texts?.revert();

            if (
              comp &&
              comp.current &&
              refDom.current.resizeObserver &&
              refDom.current.resizeObserver?.unobserve
            ) {
              refDom.current?.resizeObserver?.unobserve(
                comp.current as HTMLElement
              );
            }
          }
          break;
        case 'paragraph':
          if (comp.current && refDom.current) {
            comp.current.classList.remove(
              `is-handle`,
              `${s['anim-paragraph']}`
            );
            if (
              comp &&
              comp.current &&
              refDom.current.resizeObserver &&
              refDom.current.resizeObserver?.unobserve
            ) {
              refDom.current?.resizeObserver?.unobserve(
                comp.current as HTMLElement
              );
            }
            if (refDom.current.texts)
              gsap.set(refDom.current.texts?.words, { y: '0' });
          }
          refDom.current.texts && refDom.current.texts?.revert();
          break;
      }
    };
  }, []);

  useEffect(() => {
    if (!animOption) return;
    let anim: Anim | undefined;
    if (comp.current && pageLoadStatus === PAGE_ENTER) {
      anim = new Anim(comp.current, () => {
        const delay = getDelay(animOption.screen, animOption.offset);
        refDom.current.runned = true;
        switch (animOption.type) {
          case 'heading':
            gsap.to(refDom.current.texts?.chars || [], {
              opacity: 1,
              ease: 'power3.inOut',
              duration: 0.8,
              delay,
              stagger: {
                amount: 0.6,
                from: 'random',
              },
              onComplete: () => {
                refDom.current.resizeObserver?.unobserve(
                  comp.current as HTMLElement
                );
              },
            });
            break;
          case 'random':
            if (comp.current) comp.current.textContent = '';
            refDom.current?.arrText?.forEach((el: string, key: number) => {
              if (
                el === ' ' &&
                refDom.current.finalRunTexts &&
                refDom.current.finalRunTexts[key]
              ) {
                refDom.current.finalRunTexts[key] = el;
                return;
              }
              const fal = { value: 0 };
              gsap.to(fal, {
                delay: delay + getRandomArbitraryFloat(0, 0.4),
                value: 100,
                ease: 'power3.out',
                duration: 0.6,
                onUpdate: () => {
                  if (
                    Math.floor(fal.value) % 2 === 0 &&
                    refDom.current.finalRunTexts &&
                    refDom.current.chars
                  ) {
                    refDom.current.finalRunTexts[key] =
                      refDom.current.chars[
                        getRandomArbitrary(0, refDom.current.chars.length - 1)
                      ];

                    if (comp.current) {
                      comp.current.textContent = refDom.current.finalRunTexts
                        .toString()
                        .replaceAll(',', '');
                    }
                  }
                },
                onComplete: () => {
                  if (refDom.current.finalRunTexts && comp.current) {
                    refDom.current.finalRunTexts[key] = el;
                    comp.current.textContent = refDom.current.finalRunTexts
                      .toString()
                      .replaceAll(',', '');
                  }
                },
              });
            });

            break;

          case 'paragraph':
            gsap.to(comp.current, {
              opacity: 1,
              y: 0,
              ease: 'power3.out',
              duration: 0.8,
              delay,
            });
            break;
        }
      });
    }
    return () => {
      anim && anim.kill();
    };
  }, [pageLoadStatus]);

  return (
    <Text
      {...props}
      ref={comp}
      className={cs(
        s.text,
        s[`size-${size}`],
        `font-${fontWeight}`,
        `text-${color}`,
        className
      )}
      style={{ ...style }}
      onClick={onClick}
      title={title}
    >
      {children}
    </Text>
  );
};

export default Text;
