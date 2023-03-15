import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * Sometimes, we may want to make our useEffect callback not run on initial render.
 * @param func - The function to run on mount and update.
 * @param deps - The dependencies array.
 */
const useDidMountEffect = (
  func: EffectCallback,
  deps: DependencyList
): void => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};

export default useDidMountEffect;
