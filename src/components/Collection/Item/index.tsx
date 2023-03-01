import Heading from '@components/Heading';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { ProfileContext } from '@contexts/profile-context';
import useWindowSize from '@hooks/useWindowSize';
import { Token } from '@interfaces/token';
import { convertToETH } from '@utils/currency';
import {
  formatAddress,
  formatBTCPrice,
  formatEthPrice,
  formatTokenId,
  getProjectIdFromTokenId,
} from '@utils/format';
import cs from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Stack } from 'react-bootstrap';
import Image from 'next/image';
import ButtonIcon from '@components/ButtonIcon';
import ModalBuyItem from '@components/Collection/ModalBuyItem';
import s from './styles.module.scss';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { useRouter } from 'next/router';

const CollectionItem = ({
  data,
  className,
}: {
  data: Token;
  className?: string;
}) => {
  const tokenID = data.tokenID;
  const route = useRouter();
  const { currentUser } = useContext(ProfileContext);
  const { mobileScreen } = useWindowSize();
  const { isBitcoinProject, isWhitelistProject } = useContext(
    GenerativeProjectDetailContext
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const { ordAddress, onButtonClick } = useBTCSignOrd();

  const [payType, setPayType] = useState<'eth' | 'btc'>('btc');

  const isBTCListable =
    (data.buyable || (!data.buyable && !data.isCompleted)) && !!data.priceBTC;
  const isBTCDisable = !data.buyable && !data.isCompleted && !!data.priceBTC;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleModal = (event?: any, _payType?: 'eth' | 'btc') => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (isBTCDisable) return;

    onButtonClick({
      cbSigned: () => {
        if (_payType) {
          setPayType(_payType);
        }
        setShowModal(show => !show);
      },
    })
      .then()
      .catch();
  };

  const renderButton = () => {
    if (isBTCListable)
      return (
        <>
          {isBTCDisable ? (
            <ButtonIcon
              sizes={'small'}
              className={s.buy_now}
              onClick={e => toggleModal(e)}
              disabled={isBTCDisable}
              type="button"
              name="button-buy"
            >
              <Text as="span" fontWeight="medium">
                The inscription is being purchased
              </Text>
            </ButtonIcon>
          ) : (
            <div
              style={{ marginLeft: 4, display: 'flex', alignSelf: 'flex-end' }}
            >
              <ButtonIcon
                sizes={'small'}
                className={s.buy_now}
                onClick={e => toggleModal(e, 'btc')}
                type="button"
                name="button-buy"
                style={{ marginRight: 4 }}
              >
                <Text as="span" fontWeight="medium">
                  {`Buy ${formatBTCPrice(data.priceBTC)} BTC`}
                </Text>
              </ButtonIcon>
              {data.listingDetail &&
                data.listingDetail.paymentListingInfo.eth && (
                  <ButtonIcon
                    sizes={'small'}
                    className={s.buy_now}
                    onClick={e => toggleModal(e, 'eth')}
                    type="button"
                    name="button-buy"
                    variants="outline"
                  >
                    <Text as="span" fontWeight="medium">
                      {`Buy ${formatEthPrice(
                        data.listingDetail.paymentListingInfo.eth.price
                      )} ETH`}
                    </Text>
                  </ButtonIcon>
                )}
            </div>
          )}
        </>
      );
    return null;
  };

  const renderPrice = () => {
    let text = '';
    let suffix = '';
    if (isBTCListable) {
      text = formatBTCPrice(data.priceBTC);
      suffix = ' BTC';
    } else if (data.stats?.price) {
      text = convertToETH(data.stats?.price);
      suffix = ' ETH';
    }
    if (!text) return null;
    if (mobileScreen) {
      return (
        <Text size="14" fontWeight="bold">
          {text}
        </Text>
      );
    }
    return (
      <Stack direction="horizontal" className={s.collectionCard_info_listing}>
        <Heading as={'h4'}>
          {text}
          {suffix}
        </Heading>
      </Stack>
    );
  };

  const tokenUrl = useMemo(() => {
    if (isWhitelistProject)
      return `${ROUTE_PATH.GENERATIVE}/${SATOSHIS_PROJECT_ID}/${tokenID}`;
    return `${ROUTE_PATH.GENERATIVE}/${
      isBitcoinProject
        ? data.project.tokenID
        : getProjectIdFromTokenId(parseInt(tokenID))
    }/${tokenID}`;
  }, [isWhitelistProject, tokenID, data.project.tokenID]);

  return (
    <div className={`${s.collectionCard} ${className}`}>
      <div className={s.collectionCard_inner_wrapper}>
        <div
          className={s.collectionCard_inner}
          onClick={e => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (e.target.name === 'button-buy') {
              e.preventDefault();
              e.stopPropagation();
            } else {
              route.push(tokenUrl);
            }
          }}
        >
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
                {renderPrice()}
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
                  {isBTCListable ? renderButton() : renderPrice()}
                </Stack>
              </div>
            </div>
          )}
        </div>
      </div>
      {data.buyable && !!ordAddress && showModal && (
        <ModalBuyItem
          showModal={showModal}
          orderID={data.orderID}
          inscriptionID={data.tokenID}
          price={
            payType === 'btc'
              ? data.priceBTC
              : data.listingDetail && data.listingDetail.paymentListingInfo.eth
              ? data.listingDetail.paymentListingInfo.eth.price
              : '0'
          }
          onClose={toggleModal}
          ordAddress={ordAddress}
          payType={payType}
        />
      )}
    </div>
  );
};

export default CollectionItem;
