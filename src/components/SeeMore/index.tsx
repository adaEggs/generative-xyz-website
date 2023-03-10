import Text from '@components/Text';
import React, { useLayoutEffect, useRef, useState } from 'react';
import s from './styles.module.scss';
import MarkdownPreview from '@components/MarkdownPreview';

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
      }, 1000);
    });
    obResize.observe(document.body);
    return () => {
      obResize.unobserve(document.body);
      obResize.disconnect();
    };
  }, [children, render]);

  return (
    <div>
      <div
        className={`${s.seemore_description} ${isShowMore ? s.isShowMore : ''}`}
        ref={refBox}
      >
        <div ref={refContent} className={s.descriptionContent}>
          <MarkdownPreview source={children} />
          {/* <Text size="18">{children}</Text> */}
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
