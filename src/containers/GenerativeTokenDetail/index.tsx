import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import { Loading } from '@components/Loading';
import Stats from '@components/Stats';
import Text from '@components/Text';
import ThumbnailPreview from '@components/ThumbnailPreview';
import { ROUTE_PATH } from '@constants/route-path';
import {
  GenerativeTokenDetailContext,
  GenerativeTokenDetailProvider,
} from '@contexts/generative-token-detail-context';
import { checkLines } from '@helpers/string';
import useWindowSize from '@hooks/useWindowSize';
import { TokenOffer } from '@interfaces/token';
import { getUserSelector } from '@redux/user/selector';
import { formatAddress, formatTokenId } from '@utils/format';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import CancelListingModal from './CancelListingModal';
import ListingTokenModal from './ListingTokenModal';
import MakeOfferModal from './MakeOfferModal';
import MoreItemsSection from './MoreItemsSection';
import SwapTokenModal from './SwapTokenModal';
import TokenActivities from './TokenActivities';
import TransferTokenModal from './TransferTokenModal';
import s from './styles.module.scss';

const GenerativeTokenDetail: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { projectID } = router.query;
  const { isMobile } = useWindowSize();

  const {
    tokenData,
    // tokenID,
    openListingModal,
    openMakeOfferModal,
    openTransferTokenModal,
    openCancelListingModal,
    handlePurchaseToken,
    isTokenListing,
    listingPrice,
    listingOffers,
    tokenOffers,
    isTokenOwner,
  } = useContext(GenerativeTokenDetailContext);
  // const scanURL = getScanUrl();
  const user = useSelector(getUserSelector);
  const mintedDate = dayjs(tokenData?.mintedTime).format('MMM DD, YYYY');
  const [isBuying, setIsBuying] = useState(false);
  // const tokenInfos = [
  //   {
  //     id: 'contract-address',
  //     info: 'Contract Address',
  //     value: formatAddress(tokenData?.project.genNFTAddr || ''),
  //     link: `${scanURL}token/${tokenData?.project.genNFTAddr}`,
  //   },
  //   {
  //     id: 'token-id',
  //     info: 'Token ID',
  //     value: formatTokenId(tokenID),
  //     link: `${scanURL}token/${tokenData?.project.genNFTAddr}?a=${tokenID}`,
  //   },
  //   {
  //     id: 'token-standard',
  //     info: 'Token Standard',
  //     value: 'ERC-721',
  //     link: '',
  //   },
  //   {
  //     id: 'blockchain',
  //     info: 'Blockchain',
  //     value: getChainName() || '',
  //     link: '',
  //   },
  // ];
  const [showMore, setShowMore] = useState(false);

  const handleOpenListingTokenModal = (): void => {
    openListingModal();
  };

  const handleOpenMakeOfferModal = (): void => {
    openMakeOfferModal();
  };

  const handleOpenCancelListingTokenModal = (): void => {
    const userListingOffer = listingOffers.find(
      (offer: TokenOffer) => offer.seller === user.walletAddress
    );
    if (userListingOffer) {
      openCancelListingModal(userListingOffer);
    } else {
      toast.error('Listing offer not found');
    }
  };

  const handleOpenTransferTokenModal = (): void => {
    openTransferTokenModal();
  };

  const featuresList = () => {
    if (
      tokenData?.attributes &&
      tokenData.attributes?.length > 0 &&
      tokenData?.project?.traitStat &&
      tokenData?.project?.traitStat?.length > 0
    ) {
      return tokenData.attributes.map(attr => {
        const foundTrait = tokenData?.project?.traitStat.find(
          trait => trait.traitName === attr.trait_type
        );

        const rarityValue = foundTrait?.traitValuesStat.find(
          stat => stat.value.toString() === attr.value.toString()
        )?.rarity;

        return {
          id: `attr-${v4()}`,
          info: attr.trait_type,
          value: attr.value.toString(),
          link: '',
          rarity: rarityValue ? `${rarityValue}%` : '--%',
        };
      });
    }
    return null;
  };

  const tokenDescription =
    tokenData?.description || tokenData?.project?.desc || '';

  const handleLinkProfile = (walletAddress?: string) => {
    if (user.walletAddress === walletAddress) {
      return `${ROUTE_PATH.PROFILE}`;
    } else {
      return `${ROUTE_PATH.PROFILE}/${walletAddress}`;
    }
  };

  const handleBuyToken = async (): Promise<void> => {
    setIsBuying(true);
    await handlePurchaseToken(listingOffers[0]);
    setIsBuying(false);
  };

  // const checkLines = tokenDescription.split(/\r\n|\r|\n/).length;

  return (
    <>
      <Container>
        <div className={s.wrapper}>
          <div className={s.itemInfo}>
            <Loading isLoaded={!!tokenData} className={s.loading_token} />
            <Heading
              as="h4"
              fontWeight="medium"
              style={{ marginBottom: '20px' }}
            >
              #{formatTokenId(tokenData?.tokenID || '')}
            </Heading>
            <Heading as="h6" fontWeight="medium">
              <Link
                href={`${ROUTE_PATH.GENERATIVE}/${projectID}`}
                className={s.projectName}
              >
                {tokenData?.project.name}
              </Link>
            </Heading>
            <Text
              size={'18'}
              color={'black-60'}
              style={{ marginBottom: '16px' }}
            >
              <Link
                className={s.info_creatorLink}
                href={handleLinkProfile(tokenData?.project?.creatorAddr)}
              >
                {tokenData?.project?.creatorProfile?.displayName ||
                  formatAddress(
                    tokenData?.project?.creatorProfile?.walletAddress || ''
                  )}
              </Link>
            </Text>
            {isMobile && <ThumbnailPreview data={tokenData} previewToken />}
            <div className={s.prices}>
              {isTokenListing && (
                <div>
                  <Text size="12" fontWeight="medium" color="black-40">
                    Price
                  </Text>
                  <Heading as="h6" fontWeight="medium">
                    Ξ {listingPrice}
                  </Heading>
                </div>
              )}

              <div>
                <Text size="12" fontWeight="medium" color="black-40">
                  Royalty
                </Text>
                <Heading as="h6" fontWeight="medium">
                  {(tokenData?.project?.royalty || 0) / 100}%
                </Heading>
              </div>
            </div>
            <div className={s.CTA_btn}>
              {/* Due to owner and status of this token to render appropriate action */}
              {isTokenOwner && !isTokenListing && (
                <ButtonIcon
                  disabled={!tokenData}
                  onClick={handleOpenListingTokenModal}
                >
                  List for sale
                </ButtonIcon>
              )}
              {isTokenOwner && isTokenListing && (
                <ButtonIcon
                  disabled={!tokenData}
                  onClick={handleOpenCancelListingTokenModal}
                >
                  Cancel listing
                </ButtonIcon>
              )}
              {isTokenOwner && (
                <ButtonIcon
                  onClick={handleOpenTransferTokenModal}
                  disabled={!tokenData}
                  variants="outline"
                >
                  Transfer
                </ButtonIcon>
              )}
              {!isTokenOwner && isTokenListing && (
                <>
                  <ButtonIcon
                    disabled={!listingOffers.length || isBuying}
                    onClick={handleBuyToken}
                  >
                    Buy
                  </ButtonIcon>
                </>
              )}
              {!isTokenOwner && (
                <ButtonIcon
                  onClick={handleOpenMakeOfferModal}
                  disabled={!tokenData}
                  variants="outline"
                >
                  Make offer
                </ButtonIcon>
              )}
            </div>
            <div className={s.accordions}>
              <div className={s.accordions_item}>
                <Text
                  size="14"
                  color="black-40"
                  fontWeight="medium"
                  className="text-uppercase"
                >
                  description
                </Text>
                <Text
                  size="18"
                  className={s.token_description}
                  style={{ WebkitLineClamp: showMore ? 'unset' : '3' }}
                >
                  {tokenDescription}
                </Text>
                {checkLines(tokenDescription) > 3 && (
                  <>
                    {!showMore ? (
                      <Text as="span" onClick={() => setShowMore(!showMore)}>
                        See more
                      </Text>
                    ) : (
                      <Text as="span" onClick={() => setShowMore(!showMore)}>
                        See less
                      </Text>
                    )}
                  </>
                )}
              </div>
              {tokenData?.attributes && tokenData?.attributes?.length > 0 && (
                <div className={s.accordions_item}>
                  <Text
                    size="14"
                    color="black-40"
                    fontWeight="medium"
                    className="text-uppercase"
                  >
                    features
                  </Text>
                  <Stats data={featuresList()} />
                </div>
              )}

              {/* <div className={s.accordions_item}>
                <Text
                  size="14"
                  color="black-40"
                  fontWeight="bold"
                  className="text-uppercase"
                >
                  Token Info
                </Text>
                <Stats data={tokenInfos} />
              </div> */}
            </div>
            <Text size="18" color="black-40">
              Minted on: {mintedDate}
            </Text>
            <Text size="18" color="black-40" className={s.owner}>
              Owner:{' '}
              <Link href={handleLinkProfile(tokenData?.owner?.walletAddress)}>
                {tokenData?.owner?.displayName ||
                  formatAddress(
                    tokenData?.ownerAddr ||
                      tokenData?.owner?.walletAddress ||
                      ''
                  )}
              </Link>
              {isTokenOwner && ' (by you)'}
            </Text>
          </div>
          <div></div>
          {!isMobile && (
            <div>
              <ThumbnailPreview data={tokenData} previewToken />
            </div>
          )}
        </div>
        <div className="h-divider"></div>
        {tokenOffers.length > 0 && <TokenActivities></TokenActivities>}
        <MoreItemsSection genNFTAddr={tokenData?.project.genNFTAddr || ''} />
      </Container>
      <ListingTokenModal />
      <MakeOfferModal />
      <CancelListingModal />
      <TransferTokenModal />
      <SwapTokenModal />
    </>
  );
};

const GenerativeTokenDetailWrapper: React.FC = (): React.ReactElement => {
  return (
    <GenerativeTokenDetailProvider>
      <GenerativeTokenDetail />
    </GenerativeTokenDetailProvider>
  );
};

export default GenerativeTokenDetailWrapper;
