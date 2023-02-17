import Heading from '@components/Heading';
import Link from '@components/Link';
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
  formatTokenId,
  getProjectIdFromTokenId,
} from '@utils/format';
import cs from 'classnames';
import { useContext, useMemo, useState } from 'react';
import { Stack } from 'react-bootstrap';

import ButtonIcon from '@components/ButtonIcon';
import ModalBuyItemViaBTC from '@components/Collection/ModalBuyItemViaBTC';
import s from './styles.module.scss';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';

const CollectionItem = ({
  data,
  className,
}: {
  data: Token;
  className?: string;
}) => {
  const tokenID = useMemo(
    () => data.name.split('#')[1] || data.name,
    [data.name]
  );
  const { currentUser } = useContext(ProfileContext);
  const { mobileScreen } = useWindowSize();
  const { isBitcoinProject, isWhitelistProject } = useContext(
    GenerativeProjectDetailContext
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const isBTCListable =
    (data.buyable || (!data.buyable && !data.isCompleted)) && !!data.priceBTC;
  const isBTCDisable = !data.buyable && !data.isCompleted && !!data.priceBTC;

  const [thumb, setThumb] = useState<string>(data.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const toggleModal = () => {
    if (isBTCDisable) return;
    setShowModal(show => !show);
  };

  const renderButton = () => {
    if (isBTCListable)
      return (
        <ul className={s.ordinalsLinks}>
          <ButtonIcon
            sizes={'large'}
            className={s.buy_now}
            onClick={toggleModal}
          >
            <Text as="span" fontWeight="medium">
              {isBTCDisable ? 'The inscription is being purchased' : 'Buy now'}
            </Text>
          </ButtonIcon>
        </ul>
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
        <Link href={tokenUrl} className={s.collectionCard_inner}>
          <div
            className={`${s.collectionCard_thumb} ${
              thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
            }`}
          >
            <div className={s.collectionCard_thumb_inner}>
              <img
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
                  {renderPrice()}
                </Stack>
              </div>
            </div>
          )}
        </Link>
        {renderButton()}
      </div>
      {data.buyable && (
        <ModalBuyItemViaBTC
          showModal={showModal}
          orderID={data.orderID}
          inscriptionID={data.tokenID}
          price={data.priceBTC}
          onClose={toggleModal}
        />
      )}
    </div>
  );
};

export default CollectionItem;
