import React, { ReactNode } from 'react';

import Footer from './Footer';
import Header from './Header';

interface IProp {
  children: ReactNode;
}

const DefaultLayout: React.FC<IProp> = ({ children }): JSX.Element => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
