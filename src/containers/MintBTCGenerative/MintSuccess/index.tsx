import Button from '@components/ButtonIcon';
import Text from '@components/Text';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import s from './styles.module.scss';
import { ROUTE_PATH } from '@constants/route-path';

const MintSuccess = () => {
  const router = useRouter();
  const { mintedProject } = useContext(MintBTCGenerativeContext);
  const mintedProjectUrl = `/generative/${mintedProject?.tokenID}`;

  const handleGoToProjectDetailPage = (): void => {
    if (mintedProject?.tokenID) {
      router.push(mintedProjectUrl);
    }
  };

  const goToDao = () => {
    router.push(ROUTE_PATH.REQUEST);
  };

  return (
    <div className={s.mintSuccess}>
      <h2 className={s.title}>Introduce your art to the world!</h2>
      <Text className={s.mintSuccess_content} as="p" size={'24'}>
        You’ve submitted the collection successfully, but it’s not visible for
        everyone to mint until it’s verified by the DAO.
      </Text>
      <div className={s.actionWrapper}>
        <div className={s.social_btns}>
          <Button
            sizes="large"
            variants="outline-small"
            disabled={!mintedProject?.tokenID}
            onClick={goToDao}
          >
            Go to DAO
          </Button>
          <Button
            sizes="large"
            variants="outline-small"
            disabled={!mintedProject?.tokenID}
            onClick={handleGoToProjectDetailPage}
          >
            Go to project page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MintSuccess;
