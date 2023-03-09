import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { Container } from 'react-bootstrap';

import { Loading } from '@components/Loading';
import Heading from '@components/Heading';
import Text from '@components/Text';
import MarkdownPreview from '@components/MarkdownPreview';
import {
  ellipsisCenter,
  formatBTCPrice,
  formatLongAddress,
} from '@utils/format';
import useWindowSize from '@hooks/useWindowSize';
import { getInscriptionDetail } from '@services/marketplace-btc';
import NFTDisplayBox from '@components/NFTDisplayBox';
import Link from '@components/Link';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';
import { ROUTE_PATH } from '@constants/route-path';
import { getApiKey } from '@utils/swr';

import s from './TokenID.module.scss';

const InscriptionID: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { tokenID = '' } = router.query;

  const { data: inscriptionData } = useSWR(
    getApiKey(getInscriptionDetail, tokenID),
    () => getInscriptionDetail(tokenID as string)
  );

  const [tokenData, setTokenData] = React.useState<
    IGetMarketplaceBtcListItem | undefined
  >(inscriptionData);

  const [showMore, setShowMore] = useState(false);
  const { mobileScreen } = useWindowSize();

  useEffect(() => {
    setTokenData(inscriptionData);
  }, [inscriptionData]);

  const renderLoading = () => {
    return (
      <div className={s.info}>
        <Loading isLoaded={!!tokenData} className={s.loading_project} />
      </div>
    );
  };

  const renderRow = (label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <div className={s.wrap_info_row}>
        <Text size={'18'} color={'text-black-80'}>
          {label}
        </Text>
        <a
          color={'text-black-80'}
          className={s.row_right}
          href={`https://dev-v5.generativeexplorer.com/inscription/${tokenData?.inscriptionID}`}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </a>
      </div>
    );
  };

  const renderLeftContent = () => {
    if (!tokenData) {
      return renderLoading();
    }
    return (
      <>
        {mobileScreen && (
          <div className={s.ntfBlock}>
            <NFTDisplayBox
              inscriptionID={tokenData?.inscriptionID}
              type={tokenData?.contentType}
              autoPlay={true}
              controls={true}
              loop={true}
              variants="absolute"
            />
          </div>
        )}
        <div className={s.info}>
          <Heading as="h4" fontWeight="medium">
            Inscription #{tokenData?.inscriptionNumber}
          </Heading>
          <Text size="18" className={s.owner}>
            Owned by{' '}
            <Link
              href={`${ROUTE_PATH.PROFILE}/${tokenData?.owner}`}
              className={s.projectName}
            >
              {formatLongAddress(tokenData?.owner || '')}
            </Link>
          </Text>
          {tokenData.buyable && (
            <>
              {' '}
              <Text size="14" color={'black-60'} className={s.info_labelPrice}>
                {tokenData?.isCompleted ? 'LAST SALE' : 'PRICE'}
              </Text>
              {(Number(tokenData?.price) || 0) > 0 && (
                <Text
                  size={'20'}
                  className={
                    tokenData?.isCompleted
                      ? s.info_amountPriceSuccess
                      : s.info_amountPrice
                  }
                  style={{
                    marginBottom: tokenData?.buyable ? 32 : 0,
                  }}
                >
                  {formatBTCPrice(
                    new BigNumber(tokenData?.price || 0).toNumber()
                  )}{' '}
                  BTC
                </Text>
              )}
            </>
          )}

          <div className={s.info_project_desc}>
            {tokenData.buyable && (
              <>
                <Text
                  size="14"
                  color="black-40"
                  fontWeight="medium"
                  className="text-uppercase"
                >
                  description
                </Text>
                <div
                  className={s.token_description}
                  style={{ WebkitLineClamp: showMore ? 'unset' : '4' }}
                >
                  <MarkdownPreview source={tokenData?.description} />
                </div>
                {tokenData?.description &&
                  tokenData?.description.length > 300 && (
                    <>
                      {!showMore ? (
                        <Text
                          as="span"
                          onClick={() => setShowMore(!showMore)}
                          fontWeight="semibold"
                        >
                          See more
                        </Text>
                      ) : (
                        <Text
                          as="span"
                          onClick={() => setShowMore(!showMore)}
                          fontWeight="semibold"
                        >
                          See less
                        </Text>
                      )}
                    </>
                  )}
              </>
            )}
            <div className={s.wrap_raw}>
              {renderRow(
                'Inscription ID',
                tokenData?.inscriptionID.length > 10
                  ? ellipsisCenter({ str: tokenData?.inscriptionID })
                  : tokenData?.inscriptionID
              )}
              {tokenData?.sat && (
                <div className={s.wrap_info_row}>
                  <Text size={'18'} color={'text-black-80'}>
                    Sat
                  </Text>
                  <Text className={s.row_right} size={'18'}>
                    {tokenData?.sat}
                  </Text>
                </div>
              )}
              {tokenData?.contentType && (
                <div className={s.wrap_info_row}>
                  <Text size={'18'} color={'text-black-80'}>
                    Content type
                  </Text>
                  <Text className={s.row_right} size={'18'}>
                    {tokenData?.contentType}
                  </Text>
                </div>
              )}
              {tokenData?.timestamp && (
                <div className={s.wrap_info_row}>
                  <Text size={'18'} color={'text-black-80'}>
                    Timestamp
                  </Text>
                  <Text className={s.row_right} size={'18'}>
                    {tokenData?.timestamp}
                  </Text>
                </div>
              )}
              {tokenData?.block && (
                <div className={s.wrap_info_row}>
                  <Text size={'18'} color={'text-black-80'}>
                    Block
                  </Text>
                  <Text className={s.row_right} size={'18'}>
                    {tokenData?.block}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Container className={s.wrapper}>
      {renderLeftContent()}
      <div />
      {!mobileScreen && (
        <NFTDisplayBox
          inscriptionID={tokenData?.inscriptionID}
          type={tokenData?.contentType}
          autoPlay={true}
          controls={true}
          loop={true}
          variants="full"
        />
      )}
    </Container>
  );
};

export default InscriptionID;
