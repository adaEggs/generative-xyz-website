import Button from '@components/ButtonIcon';
import Heading from '@components/Heading';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { InscribeStatus } from '@enums/inscribe';
import { IMoralisNFTMetadata, MoralisNFT } from '@interfaces/inscribe';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import InscribeEthModal from '../InscribeEthModal';
import s from './styles.module.scss';

interface IProps {
  inscription: MoralisNFT;
}

const InscriptionCard: React.FC<IProps> = ({
  inscription,
}: IProps): React.ReactElement => {
  const router = useRouter();
  const metadata = useMemo((): IMoralisNFTMetadata => {
    try {
      return JSON.parse(inscription.metadata);
    } catch (err: unknown) {
      return {} as IMoralisNFTMetadata;
    }
  }, [inscription]);
  const [thumb, setThumb] = useState<string>(metadata?.image || '');
  const [showModal, setShowModal] = useState(false);

  const handleClose = (): void => {
    setShowModal(false);
    router.replace(`${ROUTE_PATH.AUTHENTIC}`, undefined, {
      shallow: true,
    });
  };

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const handleGotoInscribePage = (): void => {
    router.replace(
      `${ROUTE_PATH.AUTHENTIC}?isAuthentic=true&tokenAddress=${inscription.token_address}&tokenId=${inscription.token_id}`,
      undefined,
      {
        shallow: true,
      }
    );
    setShowModal(true);
  };

  const canInscribe = useMemo((): boolean => {
    return !!(!inscription.is_minted && metadata?.image);
  }, [inscription]);

  const statusText = useMemo((): React.ReactElement => {
    switch (inscription.inscribe_btc?.status) {
      case InscribeStatus.ReceivedFund:
      case InscribeStatus.SendingBTCFromSegwitAddrToOrdAddr:
      case InscribeStatus.SentBTCFromSegwitAddrToOrdAdd:
      case InscribeStatus.Minting:
      case InscribeStatus.Minted:
      case InscribeStatus.SendingNFTToUser:
        return <span className={s.statusText}>Inscribing...</span>;
      case InscribeStatus.SentNFTToUser:
        return (
          <Link
            className={s.statusText}
            href={`${ROUTE_PATH.GENERATIVE}/${inscription.inscribe_btc?.project_token_id}/${inscription.inscribe_btc?.inscription_id}`}
          >
            View inscription
          </Link>
        );
      default:
        return <></>;
    }
  }, [inscription]);

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
              {canInscribe ? (
                <Button onClick={handleGotoInscribePage} className={s.mintBtn}>
                  Inscribe
                </Button>
              ) : (
                <>{statusText}</>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && <InscribeEthModal handleClose={handleClose} />}
    </div>
  );
};

export default InscriptionCard;
