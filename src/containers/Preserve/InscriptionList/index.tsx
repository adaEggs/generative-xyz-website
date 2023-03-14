import { MoralisNFT } from '@interfaces/inscribe';
import React from 'react';
import s from './styles.module.scss';
import { Empty } from '@components/Collection/Empty';
import InscriptionCard from '../InscriptionCard';

interface IProps {
  inscriptions: Array<MoralisNFT>;
}

const InscriptionList: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const { inscriptions } = props;

  return (
    <div className={s.inscriptionList}>
      {inscriptions.length > 0 ? (
        <div className="row">
          {inscriptions.map((item, index) => (
            <InscriptionCard key={index} inscription={item} />
          ))}
        </div>
      ) : (
        <Empty
          content={'There are currently no ETH NFTs in your Generative wallet.'}
        />
      )}
    </div>
  );
};

export default InscriptionList;
