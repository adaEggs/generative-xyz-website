import { useEffect, useCallback, DependencyList } from 'react';

export default function useDebounce(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effect: any,
  dependencies: DependencyList,
  delay: number
) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
