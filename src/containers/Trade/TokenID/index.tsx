import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import s from './TokenID.module.scss';
import { Loading } from '@components/Loading';
import Heading from '@components/Heading';
import Text from '@components/Text';
import { Container } from 'react-bootstrap';
import ButtonIcon from '@components/ButtonIcon';
import MarkdownPreview from '@components/MarkdownPreview';
import { ellipsisCenter, formatBTCPrice } from '@utils/format';
import useWindowSize from '@hooks/useWindowSize';
import { getMarketplaceBtcNFTDetail } from '@services/marketplace-btc';
import BigNumber from 'bignumber.js';
import BuyTokenModal from '@containers/Trade/BuyTokenModal';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { ROUTE_PATH } from '@constants/route-path';
import NFTDisplayBox from '@components/NFTDisplayBox';
import { IGetMarketplaceBtcNFTDetail } from '@interfaces/api/marketplace-btc';
import useBTCSignOrd from '@hooks/useBTCSignOrd';

const LOG_PREFIX = 'BUY-NFT-BTC-DETAIL';

const TokenID: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { tokenID } = router.query;
  const [tokenData, setTokenData] = React.useState<
    IGetMarketplaceBtcNFTDetail | undefined
  >(undefined);
  const [showMore, setShowMore] = useState(false);
  const { mobileScreen } = useWindowSize();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { ordAddress, onButtonClick } = useBTCSignOrd();

  const onShowModal = () => {
    onButtonClick({
      cbSigned: () => setShowModal(true),
    }).then();
  };

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
      <div className={s.info}>
        <Heading as="h4" fontWeight="medium">
          Inscription #{tokenData.inscriptionNumber}
        </Heading>
        <Text size="14" color={'black-60'} className={s.info_labelPrice}>
          {tokenData?.isCompleted ? 'LAST SALE' : 'PRICE'}
        </Text>
        <Text
          size={'20'}
          className={
            tokenData?.isCompleted
              ? s.info_amountPriceSuccess
              : s.info_amountPrice
          }
          style={{
            marginBottom: tokenData.buyable ? 32 : 0,
          }}
        >
          {formatBTCPrice(new BigNumber(tokenData?.price || 0).toNumber())} BTC
        </Text>
        {!tokenData.buyable && !tokenData.isCompleted && (
          <Text size={'14'} className={s.info_statusIns}>
            The inscription is being purchased. ETA is in ~30 minutes.
          </Text>
        )}
        {tokenData.isCompleted && (
          <Text size={'14'} className={s.info_statusComplete}>
            This inscription is not available for buying now.
          </Text>
        )}
        <ButtonIcon
          sizes="large"
          className={s.info_buyBtn}
          onClick={() => {
            // return setShowModal(true);
            if (tokenData.buyable) return onShowModal();
            router.push(ROUTE_PATH.TRADE);
          }}
        >
          <Text as="span" size="14" fontWeight="medium">
            {tokenData.buyable ? 'Buy Now' : 'Buy others'}
          </Text>
        </ButtonIcon>
        {mobileScreen && (
          <NFTDisplayBox
            inscriptionID={tokenData.inscriptionID}
            type={tokenData.contentType}
            className={s.img_mobile}
            controls={true}
            autoPlay={true}
            loop={true}
            variants={'full'}
          />
        )}
        <div className={s.info_project_desc}>
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
            <MarkdownPreview source={tokenData.description} />
          </div>
          {tokenData.description && tokenData.description.length > 300 && (
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
          <div className={s.wrap_raw}>
            {renderRow(
              'ID',
              tokenData.inscriptionID.length > 10
                ? ellipsisCenter({ str: tokenData.inscriptionID })
                : tokenData.inscriptionID
            )}
          </div>
          {/*<Text size="14" color="black-40" className={s.owner}>*/}
          {/*  Owner: <Link href="/">{formatAddress('122222')}</Link>*/}
          {/*</Text>*/}
        </div>
      </div>
    );
  };

  const fetchData = async (): Promise<void> => {
    if (!tokenID || typeof tokenID !== 'string') return;
    try {
      const tokenData = await getMarketplaceBtcNFTDetail(tokenID);
      if (tokenData) {
        setTokenData(tokenData);
      }
    } catch (err) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchData().then();
    const intervalID = setInterval(fetchData, 60000);
    return () => {
      clearInterval(intervalID);
    };
  }, [router]);

  return (
    <Container className={s.wrapper}>
      {renderLeftContent()}
      <div />
      {/*{!mobileScreen && <TokenIDImage image={''} name="" />}*/}
      {!mobileScreen && (
        <div style={{ position: 'relative' }}>
          <NFTDisplayBox
            inscriptionID={tokenData?.inscriptionID}
            type={tokenData?.contentType}
            autoPlay={true}
            loop={true}
            controls={false}
          />
        </div>
      )}
      {!!tokenData?.inscriptionID &&
        !!tokenData?.price &&
        !!ordAddress &&
        showModal && (
          <BuyTokenModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            inscriptionID={tokenData.inscriptionID || ''}
            price={new BigNumber(tokenData?.price || 0).toNumber()}
            orderID={tokenData.orderID}
            ordAddress={ordAddress}
          />
        )}
    </Container>
  );
};

export default TokenID;
