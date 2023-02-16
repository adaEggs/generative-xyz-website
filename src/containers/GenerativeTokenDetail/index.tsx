import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import { Loading } from '@components/Loading';
import ProjectDescription from '@components/ProjectDescription';
import Stats from '@components/Stats';
import Text from '@components/Text';
import ThumbnailPreview from '@components/ThumbnailPreview';
import { EXTERNAL_LINK } from '@constants/external-link';
import { ROUTE_PATH } from '@constants/route-path';
import {
  GenerativeTokenDetailContext,
  GenerativeTokenDetailProvider,
} from '@contexts/generative-token-detail-context';
import useWindowSize from '@hooks/useWindowSize';
import { TokenOffer } from '@interfaces/token';
import { getUserSelector } from '@redux/user/selector';
import {
  formatAddress,
  formatBTCPrice,
  formatLongAddress,
  formatTokenId,
} from '@utils/format';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
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
import ModalBuyItemViaBTC from '@components/Collection/ModalBuyItemViaBTC';
import Avatar from '@components/Avatar';
import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';

const GenerativeTokenDetail: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { projectID } = router.query;
  const { mobileScreen } = useWindowSize();

  const {
    tokenData,
    projectData,
    openListingModal,
    openMakeOfferModal,
    openTransferTokenModal,
    openCancelListingModal,
    handlePurchaseToken,
    isTokenListing,
    listingPrice,
    listingOffers,
    isTokenOwner,
    isBitcoinProject,
  } = useContext(GenerativeTokenDetailContext);
  // const scanURL = getScanUrl();
  const user = useSelector(getUserSelector);
  const mintedDate = dayjs(tokenData?.mintedTime).format('MMM DD, YYYY');
  const [isBuying, setIsBuying] = useState(false);
  const [hasProjectInteraction, setHasProjectInteraction] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const isBTCListable =
    (tokenData?.buyable || (!tokenData?.buyable && !tokenData?.isCompleted)) &&
    !!tokenData?.priceBTC;
  const isBTCDisable =
    !tokenData?.buyable && !tokenData?.isCompleted && !!tokenData?.priceBTC;

  const toggleModal = () => {
    if (isBTCDisable) return;
    setShowModal(show => !show);
  };

  const tokenInfos = [
    {
      id: 'token-id',
      info: 'ID',
      value: formatLongAddress(formatTokenId(tokenData?.tokenID || '')),
      link: `${EXTERNAL_LINK.ORDINALS}/inscription/${tokenData?.tokenID || ''}`,
    },
  ];

  const handleOpenListingTokenModal = (): void => {
    openListingModal();
  };

  const handleOpenMakeOfferModal = (): void => {
    openMakeOfferModal();
  };

  const handleOpenCancelListingTokenModal = (): void => {
    const userListingOffer = listingOffers.find(
      (offer: TokenOffer) => offer.seller === user?.walletAddress
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
      projectData?.traitStat &&
      projectData?.traitStat?.length > 0
    ) {
      return tokenData.attributes.map(attr => {
        const foundTrait = projectData?.traitStat.find(
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

  const tokenDescription = projectData?.desc || '';

  const handleLinkProfile = (walletAddress?: string) => {
    if (user?.walletAddress === walletAddress) {
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

  const refreshPage = () => {
    window.location.reload();
  };

  const renderBuyBTCView = () => {
    if (!tokenData || !isBTCListable) return null;
    return (
      <div className={s.buy_btc}>
        <div>
          <Heading as="h4" fontWeight="medium">
            {formatBTCPrice(tokenData.priceBTC)}{' '}
            <Text as="span" size="18">
              BTC
            </Text>
          </Heading>
        </div>
        <ButtonIcon
          disabled={isBTCDisable}
          className={s.buy_btc_button}
          onClick={toggleModal}
        >
          {isBTCDisable ? 'The inscription is being purchased' : 'Buy now'}
        </ButtonIcon>
      </div>
    );
  };

  useEffect(() => {
    const exists = tokenDescription.includes('Interaction');
    if (exists) {
      setHasProjectInteraction(true);
    } else {
      setHasProjectInteraction(false);
    }
  }, [tokenDescription]);

  return (
    <>
      <Container>
        <div className={s.wrapper}>
          <div className={s.itemInfo}>
            <Loading isLoaded={!!tokenData} className={s.loading_token} />
            <Heading
              as="h4"
              className={s.itemInfo_heading}
              fontWeight="medium"
              style={{ marginBottom: '20px' }}
            >
              <span title={`#${formatTokenId(tokenData?.tokenID || '')}`}>
                #
                {tokenData?.inscriptionIndex
                  ? tokenData?.inscriptionIndex
                  : formatTokenId(tokenData?.tokenID || '')}
              </span>
            </Heading>

            <Heading as="h6" fontWeight="medium">
              <Link
                href={`${ROUTE_PATH.GENERATIVE}/${projectID}`}
                className={s.projectName}
              >
                {projectData?.name}
              </Link>
            </Heading>

            {/* <Text
              size={'18'}
              color={'black-60'}
              style={{ marginBottom: '16px' }}
            >
              <div
              // className={s.info_creatorLink}
              // href={handleLinkProfile(tokenData?.project?.creatorAddr)}
              >
                {tokenData?.project?.creatorProfile?.displayName ||
                  formatAddress(
                    tokenData?.project?.creatorProfile?.walletAddress || ''
                  )}
              </div>
            </Text> */}
            <div className={s.creator}>
              <div className={s.creator_info}>
                <Avatar
                  imgSrcs={projectData?.creatorProfile?.avatar || ''}
                  width={24}
                  height={24}
                />
                <Text size={'18'} color={'black-60'}>
                  {projectData?.creatorProfile?.displayName ||
                    formatAddress(
                      projectData?.creatorProfile?.walletAddress || ''
                    )}
                </Text>
              </div>
              {projectData?.creatorProfile?.profileSocial?.twitter && (
                <div className={s.creator_social}>
                  <span className={s.creator_divider}></span>
                  <div className={s.creator_social_item}>
                    <SvgInset
                      className={s.creator_social_twitter}
                      size={16}
                      svgUrl={`${CDN_URL}/icons/ic-twitter-20x20.svg`}
                    />
                    <Text size={'18'} color="black-60">
                      <Link
                        href={
                          projectData?.creatorProfile?.profileSocial?.twitter ||
                          ''
                        }
                        target="_blank"
                      >
                        @
                        {projectData?.creatorProfile?.profileSocial?.twitter
                          .split('/')
                          .pop()}
                      </Link>
                    </Text>
                  </div>
                </div>
              )}
            </div>
            {/* {isBitcoinProject && (
              <Link
                target="_blank"
                href={`https://ordinals.com/inscription/${tokenData?.tokenID}`}
                rel="noreferrer"
              >
                Explorer
              </Link>
            )} */}
            {renderBuyBTCView()}
            {mobileScreen && <ThumbnailPreview data={tokenData} previewToken />}
            {!isBitcoinProject && (
              <>
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
                      {(projectData?.royalty || 0) / 100}%
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
              </>
            )}

            <div className={s.accordions}>
              <div className={s.accordions_item}>
                <ProjectDescription
                  desc={tokenDescription || ''}
                  hasInteraction={hasProjectInteraction}
                  profileBio={projectData?.creatorProfile?.bio || ''}
                />
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

              <div className={s.accordions_item}>
                <Stats data={tokenInfos} />
              </div>
            </div>
            <Text size="14" color="black-40">
              Minted on: {mintedDate}
            </Text>
            {tokenData?.owner && (
              <Text size="14" color="black-40" className={s.owner}>
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
            )}
          </div>
          <div></div>
          {!mobileScreen && (
            <div>
              <ThumbnailPreview
                data={tokenData}
                isBitcoinProject={isBitcoinProject}
                previewToken
              />
            </div>
          )}
        </div>
        <div className="h-divider"></div>
        {!isBitcoinProject ? (
          <>
            <TokenActivities></TokenActivities>
            <MoreItemsSection genNFTAddr={projectData?.genNFTAddr || ''} />
          </>
        ) : (
          // <></>
          <div style={{ height: '20px' }} />
        )}
      </Container>

      {!isBitcoinProject && (
        <>
          <ListingTokenModal />
          <MakeOfferModal />
          <CancelListingModal />
          <TransferTokenModal />
          <SwapTokenModal />
        </>
      )}
      {!!tokenData?.buyable && (
        <ModalBuyItemViaBTC
          showModal={showModal}
          onClose={toggleModal}
          onSuccess={refreshPage}
          inscriptionID={tokenData.tokenID}
          price={tokenData.priceBTC}
          orderID={tokenData.orderID}
        />
      )}
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
