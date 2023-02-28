import s from './ProjectCard.module.scss';
import Text from '@components/Text';
import React, { useMemo } from 'react';
import { InscriptionItem } from '@interfaces/inscribe';
import { InscribeStatus } from '@enums/inscribe';
import Image from 'next/image';
import { CDN_URL, HOST_ORDINALS_EXPLORER } from '@constants/config';
import cs from 'classnames';
import { useRouter } from 'next/router';

interface IPros {
  inscription: InscriptionItem;
  className?: string;
  index: number;
}

const InscriptionCard = ({
  inscription,
  className,
  index,
}: IPros): JSX.Element => {
  const router = useRouter();
  const isVerified =
    inscription.status < InscribeStatus.SentNFTToUser &&
    !!inscription.inscriptionID;

  const renderTitle = useMemo(() => {
    if (isVerified) {
      return (
        <Text className={s.title} size="16" fontWeight={'medium'}>
          {inscription.inscriptionID}
        </Text>
      );
    }

    return (
      <Text className={s.statusText} size="16" fontWeight={'medium'}>
        Minting...
      </Text>
    );
  }, [isVerified]);

  const handleOnClick = () => {
    if (!isVerified) return;

    router.push(
      `${HOST_ORDINALS_EXPLORER}/inscription/${inscription.inscriptionID}`
    );
  };

  return (
    <div
      key={index}
      onClick={handleOnClick}
      className={cs(s.inscriptionCard, className, {
        [`${s.unverifiedInscription}`]: !isVerified,
      })}
    >
      <div className={s.cardInner}>
        <div className={cs(s.thumbnailWrapper)}>
          {isVerified ? (
            <div className={s.iframeWrapper}>
              <iframe
                src={`${HOST_ORDINALS_EXPLORER}/preview/${inscription.inscriptionID}`}
                sandbox="allow-scripts allow-pointer-lock allow-same-origin"
                className={s.iframeContainer}
                style={{ overflow: 'hidden' }}
              />
            </div>
          ) : (
            <Image
              className={s.defaultImage}
              alt="generative-placholder"
              width={200}
              height={200}
              src={`${CDN_URL}/icons/genertive-placeholder.svg`}
            />
          )}
        </div>
        <div className={s.inscriptionInfo}>
          <div className={s.inscriptionTitle}>{renderTitle}</div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionCard;
