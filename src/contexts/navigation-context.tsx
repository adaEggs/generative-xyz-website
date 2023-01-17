import React, { ReactNode, useMemo, useState } from 'react';

export interface INavigationContext {
  isTechSpecz: boolean;
  setIsTechSpecz?: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValue: INavigationContext = {
  isTechSpecz: false,
};

interface IProp {
  children: ReactNode;
}

export const NavigationContext =
  React.createContext<INavigationContext>(initialValue);
export const NavigationProvider: React.FC<IProp> = ({
  children,
}: IProp): React.ReactElement => {
  const [isTechSpecz, setIsTechSpecz] = useState<boolean>(false);

  const contextValues = useMemo((): INavigationContext => {
    return {
      isTechSpecz,
      setIsTechSpecz,
    };
  }, [isTechSpecz, setIsTechSpecz]);

  return (
    <NavigationContext.Provider value={contextValues}>
      {children}
    </NavigationContext.Provider>
  );
};
