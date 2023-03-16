import Text from '@components/Text';
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import s from './styles.module.scss';
import MarkdownPreview from '@components/MarkdownPreview';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';

export const SeeMore: React.FC<{ children: string; render?: boolean }> = ({
  children,
  render,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const refOptions = useRef<{ timeOut: null }>({ timeOut: null });
  const refBox = useRef<HTMLDivElement | null>(null);
  const refContent = useRef<HTMLDivElement | null>(null);
  const [contentOver, setContentOver] = useState<boolean>(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  const { isLayoutShop } = useContext(GenerativeProjectDetailContext);

  useLayoutEffect(() => {
    const obResize = new ResizeObserver(() => {
      if (
        !refContent ||
        !refContent.current ||
        !refBox ||
        !refBox.current ||
        !children
      )
        return;

      if (refOptions.current.timeOut) clearTimeout(refOptions.current.timeOut);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      refOptions.current.timeOut = setTimeout(() => {
        if (refBox.current && refContent?.current) {
          const { height } = refBox.current.getBoundingClientRect();
          if (refContent?.current?.scrollHeight - height > 20) {
            setContentOver(true);
          } else {
            setContentOver(false);
          }
        }
      }, 100);
    });
    refBox && refBox.current && obResize.observe(refBox.current);
    return () => {
      if (refOptions.current.timeOut) clearTimeout(refOptions.current.timeOut);
      refBox && refBox.current && obResize.unobserve(refBox?.current);
      obResize.disconnect();
    };
  }, [children, render]);

  return (
    <div>
      <div
        className={`${s.seemore_description} ${
          isShowMore ? s.isShowMore : ''
        } ${isLayoutShop ? s.isLayoutShop : ''}`}
        ref={refBox}
      >
        <div ref={refContent} className={s.descriptionContent}>
          <MarkdownPreview source={children} />
        </div>
      </div>
      {(contentOver || isShowMore) && (
        <>
          {!isShowMore ? (
            <Text
              as="span"
              onClick={() => setIsShowMore(!isShowMore)}
              fontWeight="semibold"
            >
              See more
            </Text>
          ) : (
            <Text
              as="span"
              onClick={() => setIsShowMore(!isShowMore)}
              fontWeight="semibold"
            >
              See less
            </Text>
          )}
        </>
      )}
    </div>
  );
};
