import Heading from '@components/Heading';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
// import { ProfileContext } from '@contexts/profile-context';
import Link from '@components/Link';
import ButtonBuyListed from '@components/Transactor/ButtonBuyListed';
import { GLB_EXTENSION } from '@constants/file';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import useWindowSize from '@hooks/useWindowSize';
import { Token } from '@interfaces/token';
import { ellipsisCenter, formatAddress } from '@utils/format';
import cs from 'classnames';
import Image from 'next/image';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Stack } from 'react-bootstrap';
import s from './styles.module.scss';

const CollectionItem = ({
  data,
  className,
  showCollectionName,
}: {
  data: Token;
  className?: string;
  showCollectionName?: boolean;
}) => {
  const tokenID = data.tokenID;
  // const { currentUser } = useContext(ProfileContext);
  const { mobileScreen } = useWindowSize();
  const { isWhitelistProject } = useContext(GenerativeProjectDetailContext);
  const isBuyable = React.useMemo(() => {
    return data.buyable && !!data.priceBTC;
  }, [data.buyable, data.priceBTC]);
  const imgRef = useRef<HTMLImageElement>(null);
  const [thumb, setThumb] = useState<string>(data.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  useEffect(() => {
    const fileExt = data.image.split('.').pop();
    if (fileExt && fileExt === GLB_EXTENSION && data.thumbnail) {
      setThumb(data.thumbnail);
    }
  }, [data.image]);

  const handleOnImgLoaded = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100 && imgRef.current) {
      imgRef.current.style.imageRendering = 'pixelated';
    }
  };

  const tokenUrl = useMemo(() => {
    if (isWhitelistProject)
      return `${ROUTE_PATH.GENERATIVE}/${SATOSHIS_PROJECT_ID}/${tokenID}`;
    return `${ROUTE_PATH.GENERATIVE}/${data.project.tokenID}/${tokenID}`;
  }, [isWhitelistProject, tokenID, data.project.tokenID]);

  const renderBuyButton = () => {
    if (!isBuyable) return null;
    return (
      <Link
        href=""
        onClick={() => {
          // DO NOTHING
        }}
      >
        <ButtonBuyListed
          inscriptionID={tokenID}
          price={data.priceBTC}
          inscriptionNumber={Number(data.inscriptionIndex || 0)}
          orderID={data.orderID}
        />
      </Link>
    );
  };

  return (
    <div className={`${s.collectionCard} ${className}`}>
      <div className={s.collectionCard_inner_wrapper}>
        <Link className={s.collectionCard_inner} href={`${tokenUrl}`}>
          <div
            className={`${s.collectionCard_thumb} ${
              thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
            }`}
          >
            <div className={s.collectionCard_thumb_inner}>
              <Image
                fill
                onError={onThumbError}
                src={thumb}
                alt={data.name}
                loading={'lazy'}
                ref={imgRef}
                onLoad={handleOnImgLoaded}
              />
            </div>
          </div>
          {mobileScreen ? (
            <div className={cs(s.collectionCard_info, s.mobile)}>
              <Text size="11" fontWeight="medium">
                {data?.owner?.displayName ||
                  formatAddress(
                    data?.owner?.walletAddressBtcTaproot ||
                      data?.ownerAddr ||
                      ''
                  )}
              </Text>
              <div className={s.collectionCard_info_title}>
                <Text
                  className={s.textOverflow}
                  size="14"
                  fontWeight="semibold"
                >
                  <span
                    title={data?.project?.name}
                    className={s.collectionCard_info_title_name}
                  >
                    {data?.project?.name}
                  </span>{' '}
                  <span className={s.textOverflow}>
                    #
                    {data?.orderInscriptionIndex
                      ? data?.orderInscriptionIndex
                      : data?.inscriptionIndex
                      ? data?.inscriptionIndex
                      : ellipsisCenter({
                          str: tokenID,
                          limit: 3,
                        })}
                  </span>
                </Text>
                {renderBuyButton()}
              </div>
            </div>
          ) : (
            <div className={cs(s.collectionCard_info, s.desktop)}>
              <div className={s.collectionCard_info_title}>
                <Stack
                  className={cs(s.collectionCard_info_stack, {
                    [s.collectionCard_info_wrapper]:
                      showCollectionName && data?.creator?.displayName,
                  })}
                  direction="horizontal"
                >
                  <Heading
                    as={'h4'}
                    className={`token_id ml-auto ${s.textOverflow}}`}
                    style={{
                      maxWidth: data.stats?.price ? '70%' : '100%',
                    }}
                  >
                    <span>
                      #
                      {data?.orderInscriptionIndex
                        ? data?.orderInscriptionIndex
                        : data?.inscriptionIndex
                        ? data?.inscriptionIndex
                        : ellipsisCenter({
                            str: tokenID,
                            limit: 3,
                          })}
                    </span>
                  </Heading>
                  {showCollectionName && data?.creator?.displayName && (
                    <Heading
                      as={'h6'}
                      fontWeight="medium"
                      className={s.collectionCard_info_wrapper_ownerName}
                    >
                      {data?.creator?.displayName}
                    </Heading>
                  )}
                  {renderBuyButton()}
                </Stack>
              </div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default CollectionItem;
