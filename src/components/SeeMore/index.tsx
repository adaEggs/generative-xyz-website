import React, { useLayoutEffect, useRef, useState } from 'react';
import s from './styles.module.scss';
import MarkdownPreview from '@components/MarkdownPreview';
import Text from '@components/Text';

export const SeeMore: React.FC<{ children: string }> = ({ children }) => {
  const refBox = useRef<HTMLDivElement | null>(null);
  const refContent = useRef<HTMLDivElement | null>(null);
  const [contentOver, setContentOver] = useState<boolean>(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  useLayoutEffect(() => {
    const obResize = new ResizeObserver(() => {
      if (!refContent || !refContent.current || !refBox || !refBox.current)
        return;

      const { height } = refBox.current.getBoundingClientRect();
      if (refContent?.current?.scrollHeight - height > 20) {
        setContentOver(true);
      } else {
        setContentOver(false);
      }
    });
    obResize.observe(document.body);
    return () => {
      obResize.unobserve(document.body);
      obResize.disconnect();
    };
  }, [children, refBox, refContent]);

  return (
    <div>
      <div
        className={`${s.seemore_description} ${isShowMore ? s.isShowMore : ''}`}
        ref={refBox}
      >
        <div ref={refContent}>
          <MarkdownPreview
            source={children}
            className={s.token_description_content}
          />
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
