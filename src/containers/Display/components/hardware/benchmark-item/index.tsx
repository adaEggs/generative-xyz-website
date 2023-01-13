import s from './benchmark-item.module.scss';
import classNames from 'classnames';
import { useState, useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { PAGE_ENTER } from '@constants/common';
import { Anim } from '@animations/anim';
import { LoadingContext } from '@contexts/loading-context';

interface IProp {
  title: string;
  className: string;
  artLink: string;
  artCreatorName: string;
  artCreatorLink: string;
  color: 'yellow' | 'blue' | 'dep-blue' | 'dep-yellow';
  target1: { title: string; value: number };
  target2: { title: string; value: number };
}

interface IValueTarget {
  value: number;
}

interface IRefData {
  target1: IValueTarget;
  target2: IValueTarget;
}

export const BenchmarkItem = ({
  className,
  color,
  title,
  artLink,
  target1,
  target2,
  artCreatorName,
  artCreatorLink,
}: IProp): JSX.Element => {
  const comp = useRef<HTMLDivElement>(null);

  const [valueTarget1, setValueTarget1] = useState<number>();
  const [valueTarget2, setValueTarget2] = useState<number>();
  const [persenTarget1, setPersenTarget1] = useState<number>();
  const [persenTarget2, setPersenTarget2] = useState<number>();

  const refData = useRef<IRefData>({
    target1: { value: 0 },
    target2: { value: 0 },
  });

  const { pageLoadStatus } = useContext(LoadingContext);

  useEffect(() => {
    const anim = gsap.context(() => {
      if (!comp.current) return;

      if (comp.current) {
        comp.current.classList.add(`is-handle`);
      }
    }, [comp]);

    return () => {
      anim.revert();
      if (comp.current) {
        comp.current?.classList.remove(`is-handle`);
      }
    };
  }, []);

  useEffect(() => {
    if (comp.current && pageLoadStatus === PAGE_ENTER) {
      new Anim(comp.current, () => {
        gsap.to(refData.current.target1, {
          value: target1.value,
          duration: 1.8,
          ease: 'power3.inOut',
          onUpdate: () => {
            setValueTarget1(
              Math.round(refData.current.target1.value * 10) / 10
            );
            setPersenTarget1(
              Math.round(
                (refData.current.target1.value / target1.value) * 100 * 10
              ) / 10
            );
          },
        });
        gsap.to(refData.current.target2, {
          value: target2.value,
          duration: 1.8,
          ease: 'power3.inOut',
          delay: 0.2,
          onUpdate: () => {
            setValueTarget2(
              Math.round(refData.current.target2.value * 10) / 10
            );
            setPersenTarget2(
              Math.round(
                (refData.current.target2.value / target1.value) * 100 * 10
              ) / 10
            );
          },
        });
      });
    }
  }, [pageLoadStatus]);

  return (
    <div ref={comp} className={classNames(s.benchmark, className)}>
      <div className={s.benchmark_header}>
        <h5 className={classNames(s.benchmark_heading)}>
          <a href={artLink} target="_blank" rel="noreferrer">
            {title}
          </a>
        </h5>
        <div className={classNames(s.benchmark_heading_tool)}>
          Artist Credit:&nbsp;
          <a href={artCreatorLink} target="_blank" rel="noreferrer">
            {artCreatorName}
          </a>
        </div>
      </div>

      <div className={s.benchmark_target}>
        <div className={s.benchmark_val}>
          <div className={s.benchmark_val_border}>
            <span
              style={{ width: `${persenTarget1}%` }}
              className={classNames(
                s.benchmark_val_border_span,
                color === 'yellow' && s.benchmark_val_border_span__yellow,
                color === 'dep-yellow' &&
                  s.benchmark_val_border_span__depYellow,
                color === 'blue' && s.benchmark_val_border_span__blue,
                color === 'dep-blue' && s.benchmark_val_border_span__depBlue
              )}
            />
          </div>
          <div className={s.benchmark_val_value}>{valueTarget1} FPS</div>
        </div>
        <p
          className={classNames(
            s.benchmark_target_title,
            s.benchmark_target_title__target1
          )}
        >
          {target1.title}
        </p>
      </div>
      <div className={s.benchmark_target}>
        <div className={s.benchmark_val}>
          <div
            className={classNames(
              s.benchmark_val_border,
              s.benchmark_val_border__target2
            )}
            style={{ width: `${persenTarget2}%` }}
          >
            <span className={s.benchmark_val_border_span} />
          </div>
          <div
            className={classNames(
              s.benchmark_val_value,
              s.benchmark_val_value__target2
            )}
          >
            {valueTarget2} FPS
          </div>
        </div>
        <p
          className={`${s.benchmark_target_title} ${s.benchmark_target_title__target2}`}
        >
          {target2.title}
        </p>
      </div>
    </div>
  );
};
