import React from 'react';
import s from './styles.module.scss';

const Authentic: React.FC = (): React.ReactElement => {
  // const [page, setPage] = useState(0);
  // const [nftList, setNftList] = useState([]);

  return (
    <div className={s.authentic}>
      <h2 className={s.sectionTitle}>Your NFTs Artwork</h2>

      <div className={s.inscriptionListWrapper}></div>
    </div>
  );
};

export default Authentic;
