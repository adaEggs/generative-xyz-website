import { CreatorInfo } from '@components/CreatorInfo';
import Heading from '@components/Heading';
import Link from '@components/Link';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { LogLevel } from '@enums/log-level';
import { Token } from '@interfaces/token';
import { User } from '@interfaces/user';
import { getListing } from '@services/marketplace';
import {
  formatAddress,
  formatTokenId,
  getProjectIdFromTokenId,
} from '@utils/format';
import log from '@utils/logger';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Stack } from 'react-bootstrap';
import Web3 from 'web3';
import s from './styles.module.scss';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';

const CollectionItem = ({
  data,
  filterBuyNow = false,
}: {
  data: Token;
  filterBuyNow?: boolean;
}) => {
  const tokenID = useMemo(() => data.name.split('#')[1], [data.name]);
  const [listingTokenPrice, setListingTokenPrice] = useState('0');
  const { currentUser } = useContext(ProfileContext);
  const { isMobile } = useWindowSize();

  const handleFetchListingTokenPrice = async () => {
    try {
      const listingTokens = await getListing(
        {
          genNFTAddr: data.genNFTAddr,
          tokenId: tokenID,
        },
        {
          closed: false,
          sort_by: 'newest',
          sort: -1,
        }
      );
      if (listingTokens && listingTokens.result[0]) {
        setListingTokenPrice(
          Web3.utils.fromWei(listingTokens.result[0].price, 'ether')
        );
      }
    } catch (e) {
      log('can not fetch price', LogLevel.Error, '');
    }
  };

  const [thumb, setThumb] = useState<string>(data.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  useEffect(() => {
    handleFetchListingTokenPrice();
  }, [data.genNFTAddr]);

  if (filterBuyNow && listingTokenPrice === '0') return null;

  return (
    <Link
      href={`${ROUTE_PATH.GENERATIVE}/${getProjectIdFromTokenId(
        parseInt(tokenID)
      )}/${tokenID}`}
      className={s.collectionCard}
    >
      <div className={s.collectionCard_inner}>
        <div
          className={`${s.collectionCard_thumb} ${
            thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
          }`}
        >
          <img
            onError={onThumbError}
            src={thumb}
            alt={data.name}
            loading={'lazy'}
          />
        </div>
        {isMobile ? (
          <div className={cs(s.collectionCard_info, s.mobile)}>
            <Text size="11" fontWeight="medium">
              {data?.owner?.displayName ||
                formatAddress(
                  data?.owner?.walletAddress || data?.ownerAddr || ''
                )}
            </Text>
            <div className={s.collectionCard_info_title}>
              <Text size="14" fontWeight="semibold">
                #{formatTokenId(tokenID)}
              </Text>

              <Text size="14" fontWeight="bold">
                {listingTokenPrice !== '0' ? `Ξ${listingTokenPrice}` : ''}
              </Text>
            </div>
          </div>
        ) : (
          <div className={cs(s.collectionCard_info, s.desktop)}>
            {data.owner ? (
              <CreatorInfo creator={data.owner as User} />
            ) : (
              <CreatorInfo
                creator={{ walletAddress: data.ownerAddr } as User}
              />
            )}
            <div className={s.collectionCard_info_title}>
              <Stack
                className={s.collectionCard_info_stack}
                direction="horizontal"
              >
                <Heading as={'h4'} className="token_id ml-auto">
                  {currentUser && `${data?.project?.name} `}#
                  {formatTokenId(tokenID)}
                </Heading>
                {listingTokenPrice !== '0' && (
                  <Stack
                    direction="horizontal"
                    className={s.collectionCard_info_listing}
                  >
                    <b>Ξ{listingTokenPrice}</b>
                  </Stack>
                )}
              </Stack>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CollectionItem;
