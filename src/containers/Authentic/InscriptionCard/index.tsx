import { useMemo, useState } from 'react';
import s from './styles.module.scss';
import Heading from '@components/Heading';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import { MoralisNFT } from '@interfaces/inscribe';
import Button from '@components/ButtonIcon';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';

interface IProps {
  inscription: MoralisNFT;
}

const InscriptionCard: React.FC<IProps> = ({
  inscription,
}: IProps): React.ReactElement => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = useMemo((): any => {
    try {
      return JSON.parse(inscription.metadata);
    } catch (err: unknown) {
      return {};
    }
  }, [inscription]);
  const [thumb, setThumb] = useState<string>(
    metadata?.image || LOGO_MARKETPLACE_URL
  );

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const handleGotoInscribePage = (): void => {
    router.push(
      `${ROUTE_PATH.FREE_INSCRIPTION}?isAuthentic=true&tokenAddress=${inscription.token_address}&tokenId=${inscription.token_id}`
    );
  };

  return (
    <div
      className={cs(s.inscriptionCard, 'col-wide-2_5 col-xl-3 col-lg-5 col-12')}
    >
      <div className={s.inscriptionCard_inner}>
        <div
          className={cs(s.inscriptionCard_thumb, {
            [`${s.isDefault}`]: thumb === LOGO_MARKETPLACE_URL,
          })}
        >
          <div className={s.inscriptionCard_thumb_inner}>
            <img
              onError={onThumbError}
              src={convertIpfsToHttp(thumb)}
              alt={inscription.name}
              loading={'lazy'}
            />
          </div>
        </div>
        <div className={s.inscriptionCard_inner_info}>
          <div className={cs(s.inscriptionCard_info)}>
            <div className={s.titleWrapper}>
              <Heading className={s.title} as={'h6'} fontWeight="medium">
                {metadata?.name || 'Unknown'}
              </Heading>
              <Button onClick={handleGotoInscribePage} className={s.mintBtn}>
                Mint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionCard;
