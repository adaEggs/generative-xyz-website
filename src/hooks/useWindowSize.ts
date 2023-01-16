import { MOBILE_SCREEN } from '@constants/breakpoint';
import { useEffect, useState } from 'react';

interface Size {
  sreenWidth: number | undefined;
  heightWidth: number | undefined;
}

interface CheckMobile {
  isMobile: boolean;
}

function useWindowSize(): Size & CheckMobile {
  const [windowSize, setWindowSize] = useState<Size>({
    sreenWidth: undefined,
    heightWidth: undefined,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        sreenWidth: window.innerWidth,
        heightWidth: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowSize?.sreenWidth && windowSize.sreenWidth <= MOBILE_SCREEN) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [windowSize.sreenWidth]);

  return {
    sreenWidth: windowSize.sreenWidth,
    heightWidth: windowSize.heightWidth,
    isMobile,
  };
}

export default useWindowSize;
