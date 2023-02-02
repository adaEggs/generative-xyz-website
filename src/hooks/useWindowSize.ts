import { MOBILE_SCREEN } from '@constants/breakpoint';
import { useEffect, useState } from 'react';

interface Size {
  sreenWidth: number;
  heightWidth: number;
}

interface CheckMobile {
  mobileScreen: boolean;
}

function useWindowSize(): Size & CheckMobile {
  const [windowSize, setWindowSize] = useState<Size>({
    sreenWidth: 0,
    heightWidth: 0,
  });
  const [mobileScreen, setMobileScreen] = useState(true);

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
      setMobileScreen(true);
    } else {
      setMobileScreen(false);
    }
  }, [windowSize.sreenWidth]);

  return {
    sreenWidth: windowSize.sreenWidth,
    heightWidth: windowSize.heightWidth,
    mobileScreen,
  };
}

export default useWindowSize;
