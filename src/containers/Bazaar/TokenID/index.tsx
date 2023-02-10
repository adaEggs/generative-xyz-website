import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import s from './TokenID.module.scss';
import { Loading } from '@components/Loading';
import Heading from '@components/Heading';
import Link from '@components/Link';
import Text from '@components/Text';
import { Container } from 'react-bootstrap';
import ButtonIcon from '@components/ButtonIcon';
import MarkdownPreview from '@components/MarkdownPreview';
import { ellipsisCenter, formatAddress } from '@utils/format';
import useWindowSize from '@hooks/useWindowSize';
import {
  getMarketplaceBtcNFTDetail,
  IGetMarketplaceBtcNFTDetail,
} from '@services/marketplace-btc';
import BigNumber from 'bignumber.js';
import BuyTokenModal from '@containers/Bazaar/BuyTokenModal';

const DESC =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const TokenID: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { tokenID } = router.query;
  const [tokenData, setTokenData] = React.useState<
    IGetMarketplaceBtcNFTDetail | undefined
  >(undefined);
  const [showMore, setShowMore] = useState(false);
  const { mobileScreen } = useWindowSize();
  const [showModal, setShowModal] = useState<boolean>(false);

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
        <Text size={'18'} color={'text-black-80'}>
          {value}
        </Text>
      </div>
    );
  };

  const renderLeftContent = () => {
    if (!tokenData) {
      return renderLoading();
    }
    // render content after fetched data
    return (
      <div className={s.info}>
        <Heading as="h4" fontWeight="medium">
          {tokenData.name}
        </Heading>
        <Text size="14" color={'black-60'} className={s.info_labelPrice}>
          PRICE
        </Text>
        <Text
          size={'20'}
          color={'primary-brand'}
          className={s.info_amountPrice}
        >
          {new BigNumber(tokenData?.price || 0).div(1e8).toString()} BTC
        </Text>
        <ButtonIcon
          sizes="large"
          className={s.info_buyBtn}
          disabled={showModal}
          onClick={() => setShowModal(true)}
        >
          <Text as="span" size="14" fontWeight="medium">
            Buy Now
          </Text>
        </ButtonIcon>
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
            <MarkdownPreview source={DESC} />
          </div>
          {DESC && DESC.length > 300 && (
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
              ellipsisCenter({
                str: '0x2699ff693FA45234595b6a1CaB6650c849380893',
              })
            )}
            {renderRow('Address', '089')}
            {renderRow('Output value', '10000')}
            {renderRow('Sat', '123456789')}
          </div>
          <Text size="14" color="black-40" className={s.owner}>
            Owner: <Link href="/">{formatAddress('122222')}</Link>
          </Text>
        </div>
      </div>
    );
  };

  const fetchData = async (): Promise<void> => {
    if (!tokenID || typeof tokenID !== 'string') return;
    try {
      const tokenData = await getMarketplaceBtcNFTDetail(tokenID);
      if (tokenData && tokenData.data) {
        setTokenData(tokenData.data);
      }
    } catch (e) {
      // handle error
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
      {!mobileScreen && (
        <div>
          {/*<ThumbnailPreview data={projectDetail as Token} allowVariantion />*/}
        </div>
      )}
      <BuyTokenModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />
    </Container>
  );
};

export default TokenID;
