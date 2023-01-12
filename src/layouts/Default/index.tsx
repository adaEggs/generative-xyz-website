import React, { ReactNode } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';

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
