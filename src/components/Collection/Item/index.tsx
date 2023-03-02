import Heading from '@components/Heading';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { ProfileContext } from '@contexts/profile-context';
import useWindowSize from '@hooks/useWindowSize';
import { Token } from '@interfaces/token';
import {
  formatAddress,
  formatTokenId,
  getProjectIdFromTokenId,
} from '@utils/format';
import cs from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Stack } from 'react-bootstrap';
import Image from 'next/image';
import s from './styles.module.scss';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import Link from '@components/Link';
import ButtonBuyListed from '@components/Transactor/ButtonBuyListed';

const CollectionItem = ({
  data,
  className,
}: {
  data: Token;
  className?: string;
}) => {
  const tokenID = data.tokenID;
  const { currentUser } = useContext(ProfileContext);
  const { mobileScreen } = useWindowSize();
  const { isBitcoinProject, isWhitelistProject } = useContext(
    GenerativeProjectDetailContext
  );
  const isBuyable = React.useMemo(() => {
    return data.buyable && !!data.priceBTC;
  }, [data.buyable, data.priceBTC]);

  const [thumb, setThumb] = useState<string>(data.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  useEffect(() => {
    const fileExt = data.image.split('.').pop();
    if (fileExt && fileExt === 'glb' && data.thumbnail) {
      setThumb(data.thumbnail);
    }
  }, [data.image]);

  const tokenUrl = useMemo(() => {
    if (isWhitelistProject)
      return `${ROUTE_PATH.GENERATIVE}/${SATOSHIS_PROJECT_ID}/${tokenID}`;
    return `${ROUTE_PATH.GENERATIVE}/${
      isBitcoinProject
        ? data.project.tokenID
        : getProjectIdFromTokenId(parseInt(tokenID))
    }/${tokenID}`;
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
        <Link className={s.collectionCard_inner} href={`/${tokenUrl}`}>
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
              />
            </div>
          </div>
          {mobileScreen ? (
            <div className={cs(s.collectionCard_info, s.mobile)}>
              <Text size="11" fontWeight="medium">
                {data?.owner?.displayName ||
                  formatAddress(
                    data?.owner?.walletAddress || data?.ownerAddr || ''
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
                    {data?.inscriptionIndex
                      ? data?.inscriptionIndex
                      : formatTokenId(tokenID)}
                  </span>
                </Text>
                {renderBuyButton()}
              </div>
            </div>
          ) : (
            <div className={cs(s.collectionCard_info, s.desktop)}>
              <div className={s.collectionCard_info_title}>
                <Stack
                  className={s.collectionCard_info_stack}
                  direction="horizontal"
                >
                  <Heading
                    as={'h4'}
                    className={`token_id ml-auto ${s.textOverflow}}`}
                    style={{
                      maxWidth: data.stats?.price ? '70%' : '100%',
                    }}
                  >
                    {currentUser && (
                      <span
                        title={data?.project?.name}
                        className={s.collectionCard_info_title_name}
                      >
                        {data?.project?.name}
                      </span>
                    )}
                    <span>
                      #
                      {data?.inscriptionIndex
                        ? data?.inscriptionIndex
                        : formatTokenId(tokenID)}
                    </span>
                  </Heading>
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
