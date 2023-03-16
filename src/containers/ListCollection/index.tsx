import React from 'react';
import s from './styles.module.scss';

const ListCollection: React.FC = (): React.ReactElement => {
  return (
    <div className={s.listCollection}>
      <div className="container">List a collection</div>
    </div>
  );
};

export default ListCollection;
