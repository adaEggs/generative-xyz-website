import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import { Loading } from '@components/Loading';
import ProjectDescription from '@components/ProjectDescription';
import { SocialVerify } from '@components/SocialVerify';
import Stats from '@components/Stats';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import ThumbnailPreview from '@components/ThumbnailPreview';
import { SOCIALS } from '@constants/common';
import { CDN_URL } from '@constants/config';
import { EXTERNAL_LINK } from '@constants/external-link';
import { ROUTE_PATH } from '@constants/route-path';
import {
  GenerativeTokenDetailContext,
  GenerativeTokenDetailProvider,
} from '@contexts/generative-token-detail-context';
import useWindowSize from '@hooks/useWindowSize';
import { TokenOffer } from '@interfaces/token';
import { getUserSelector } from '@redux/user/selector';
import { formatAddress, formatLongAddress, formatTokenId } from '@utils/format';
import React, { useContext, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { TwitterShareButton } from 'react-share';
import { v4 } from 'uuid';
import CancelListingModal from './CancelListingModal';
import ListingTokenModal from './ListingTokenModal';
import MakeOfferModal from './MakeOfferModal';
import MoreItemsSection from './MoreItemsSection';
import SwapTokenModal from './SwapTokenModal';
import TokenActivities from './TokenActivities';
import TransferTokenModal from './TransferTokenModal';
import s from './styles.module.scss';
import ReportModal from '@containers/Marketplace/ProjectIntroSection/ReportModal';
import ButtonBuyListed from '@components/Transactor/ButtonBuyListed';

const GenerativeTokenDetail: React.FC = (): React.ReactElement => {
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
  const user = useSelector(getUserSelector);
  const [isBuying, setIsBuying] = useState(false);
  const isBuyable = React.useMemo(() => {
    return tokenData?.buyable && !!tokenData?.priceBTC;
  }, [tokenData?.buyable, tokenData?.priceBTC]);

  const [showReportModal, setShowReportModal] = useState(false);

  const tokenInfos = useMemo(() => {
    const info = [];

    if (tokenData?.inscriptionIndex) {
      info.push({
        id: 'inscription-number',
        info: 'Inscription number',
        value: tokenData?.inscriptionIndex,
        link: '',
      });
    }
    if (tokenData?.tokenID) {
      info.push({
        id: 'inscription-id',
        info: 'Inscription ID',
        value: formatLongAddress(formatTokenId(tokenData?.tokenID || '')),
        link: `${EXTERNAL_LINK.ORDINALS}/inscription/${
          tokenData?.tokenID || ''
        }`,
      });
    }
    if (tokenData?.ordinalsData) {
      const { ordinalsData } = tokenData;

      if (ordinalsData?.sat) {
        info.push({
          id: 'sat',
          info: 'Sat',
          value: ordinalsData?.sat,
          link: ``,
        });
      }
      if (ordinalsData?.contentLength) {
        info.push({
          id: 'contentLength',
          info: 'Content length',
          value: ordinalsData?.contentLength,
          link: ``,
        });
      }
      if (ordinalsData?.contentType) {
        info.push({
          id: 'contentType',
          info: 'Content type',
          value: ordinalsData?.contentType,
          link: ``,
        });
      }
      if (ordinalsData?.timeStamp) {
        info.push({
          id: 'timeStamp',
          info: 'TimeStamp',
          value: ordinalsData?.timeStamp,
          link: ``,
        });
      }
      if (ordinalsData?.block) {
        info.push({
          id: 'block',
          info: 'Block',
          value: ordinalsData?.block,
          link: ``,
        });
      }
    }
    return info;
  }, [tokenData]);

  const isTwVerified = useMemo(() => {
    return projectData?.creatorProfile?.profileSocial?.twitterVerified || false;
  }, [projectData?.creatorProfile?.profileSocial]);

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const hasReported = useMemo(() => {
    if (!projectData?.reportUsers || !user) return false;

    const reportedAddressList = projectData?.reportUsers.map(
      item => item.reportUserAddress
    );

    return reportedAddressList.includes(user?.walletAddress || '');
  }, [projectData?.reportUsers]);

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
    const isTraitState =
      projectData?.traitStat && projectData?.traitStat?.length > 0;

    if (tokenData?.attributes && tokenData.attributes?.length > 0) {
      return tokenData.attributes.map(attr => {
        let rarityValue = 0;
        if (isTraitState) {
          const foundTrait = projectData?.traitStat.find(
            trait => trait.traitName === attr.trait_type
          );

          rarityValue =
            foundTrait?.traitValuesStat.find(
              stat => stat.value.toString() === attr.value.toString()
            )?.rarity || 0;
        }
        return {
          id: `attr-${v4()}`,
          info: attr.trait_type,
          value: attr.value.toString(),
          link: '',
          rarity: rarityValue ? `${rarityValue}%` : '',
        };
      });
    }
    return null;
  };

  const tokenDescription = projectData?.desc || '';
  const renderBuyButton = () => {
    if (!isBuyable || !tokenData) return null;
    return (
      <Link
        href=""
        onClick={() => {
          // DO NOTHING
        }}
      >
        <ButtonBuyListed
          className={s.buy_btc_button}
          inscriptionID={tokenData?.tokenID}
          price={tokenData?.priceBTC}
          inscriptionNumber={tokenData.inscriptionIndex}
          sizes="medium"
          orderID={tokenData.orderID}
        />
      </Link>
    );
  };

  const handleBuyToken = async (): Promise<void> => {
    setIsBuying(true);
    await handlePurchaseToken(listingOffers[0]);
    setIsBuying(false);
  };

  return (
    <>
      <Container>
        <div className={s.wrapper}>
          <div className={s.itemInfo}>
            <Loading isLoaded={!!tokenData} className={s.loading_token} />
            <div className={`${s.projectHeader}`}>
              <Link
                href={`${ROUTE_PATH.PROFILE}/${projectData?.creatorProfile?.walletAddress}`}
                className={s.creator_info}
              >
                <Heading
                  className={s.projectHeader_creator}
                  as="h4"
                  fontWeight="medium"
                >
                  {projectData?.creatorProfile?.displayName ||
                    formatAddress(
                      projectData?.creatorProfile?.walletAddress || ''
                    )}
                </Heading>
              </Link>
              <SocialVerify
                isTwVerified={isTwVerified}
                link={SOCIALS.twitter}
              />
            </div>
            <Heading as="h4" className={s.itemInfo_heading} fontWeight="medium">
              <span
                title={`${projectData?.name} #${formatTokenId(
                  tokenData?.tokenID || ''
                )}`}
              >
                <Link href={`${ROUTE_PATH.GENERATIVE}/${projectData?.tokenID}`}>
                  {projectData?.name}{' '}
                </Link>
                #
                {tokenData?.inscriptionIndex
                  ? tokenData?.inscriptionIndex
                  : formatTokenId(tokenData?.tokenID || '')}
              </span>
            </Heading>
            {tokenData?.owner && (
              <Text size="18" className={s.owner}>
                Owned by{' '}
                <Link
                  href={`${ROUTE_PATH.PROFILE}/${tokenData?.owner?.walletAddress}`}
                  className={s.projectName}
                >
                  {tokenData?.owner?.displayName ||
                    formatLongAddress(tokenData?.owner?.walletAddress || '')}
                </Link>
              </Text>
            )}
            {renderBuyButton()}
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
                  // hasInteraction={hasProjectInteraction}
                  attributes={
                    featuresList() ? <Stats data={featuresList()} /> : ''
                  }
                  tokenDetail={
                    tokenInfos && tokenInfos.length > 0 ? (
                      <Stats data={tokenInfos} />
                    ) : (
                      ''
                    )
                  }
                />
              </div>
            </div>
            <div className="divider" />
            <ul className={s.shares}>
              <li>
                <div>
                  <TwitterShareButton
                    url={`${origin}${ROUTE_PATH.GENERATIVE}/${projectData?.tokenID}`}
                    title={''}
                    hashtags={[]}
                  >
                    <ButtonIcon
                      sizes="small"
                      variants="outline-small"
                      className={s.projectBtn}
                      startIcon={
                        <SvgInset
                          size={14}
                          svgUrl={`${CDN_URL}/icons/ic-twitter-20x20.svg`}
                        />
                      }
                    >
                      Share
                    </ButtonIcon>
                  </TwitterShareButton>
                </div>
              </li>
              <li>
                <div
                  className={s.reportBtn}
                  onClick={() => setShowReportModal(true)}
                >
                  <SvgInset size={14} svgUrl={`${CDN_URL}/icons/ic-flag.svg`} />
                  <Text as="span" size="14" fontWeight="medium">
                    Report
                  </Text>
                </div>
              </li>
            </ul>
          </div>
          <div />
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
        <div className="h-divider" />
        <MoreItemsSection genNFTAddr={projectData?.genNFTAddr || ''} />

        {!isBitcoinProject ? (
          <>
            <TokenActivities />
          </>
        ) : (
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
      <ReportModal
        isShow={showReportModal}
        onHideModal={() => setShowReportModal(false)}
        isReported={hasReported}
      />
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
