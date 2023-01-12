import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './styles.module.scss';

interface IProps {
  children: ReactNode;
  theme?: 'light' | 'dark';
  isHideFaucet?: boolean;
  isDisplay?: boolean;
}

const MarketplaceLayout: React.FC<IProps> = ({
  children,
  theme = 'light',
  isHideFaucet = false,
  isDisplay = false,
}): React.ReactElement => {
  return (
    <div className={`${styles.wrapper} ${styles[theme]}`}>
      <Header
        theme={theme}
        isShowFaucet={!isHideFaucet}
        isDisplay={isDisplay}
      />
      <main className={styles.main}>{children}</main>
      <Footer theme={theme} />
    </div>
  );
};

export default MarketplaceLayout;
