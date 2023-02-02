import React, { useRef, useEffect } from 'react';
import { Scrolly } from '@containers/Display/ScrollyVideo/scrolly';

interface IProp {
  src: string;
  id: string;
}

export const ScrollyVideoComp = ({ id, src }: IProp): JSX.Element => {
  const refMain = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!refMain.current) return;
    const scrolly = new Scrolly({
      el: refMain.current,
      src,
    });

    return () => {
      scrolly.destroy();
    };
  }, [refMain]);
  return <div ref={refMain} id={id} />;
};
