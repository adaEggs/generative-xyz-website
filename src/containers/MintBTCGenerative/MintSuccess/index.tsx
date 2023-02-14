import s from './styles.module.scss';
import React, { useContext } from 'react';
import Button from '@components/ButtonIcon';
import { useRouter } from 'next/router';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';

const MintSuccess = () => {
  const router = useRouter();
  const { mintedProjectID } = useContext(MintBTCGenerativeContext);

  const handleGoToProjectDetailPage = (): void => {
    if (mintedProjectID) {
      router.push(`/generative/${mintedProjectID}`);
    }
  };

  return (
    <div className={s.mintSuccess}>
      <h2 className={s.title}>Your Generative NFT is now on the Blockchain.</h2>
      <div className={s.actionWrapper}>
        <Button
          disabled={!mintedProjectID}
          onClick={handleGoToProjectDetailPage}
        >
          Go to project page
        </Button>
      </div>
    </div>
  );
};

export default MintSuccess;
