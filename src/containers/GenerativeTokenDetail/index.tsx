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
import ButtonBuyListedFromBTC from '@components/Transactor/ButtonBuyListedFromBTC';
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
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import cs from 'classnames';
import ReportModal from '@containers/Marketplace/ProjectIntroSection/ReportModal';
import { AuthenticCard } from './AuthenticCard';
import { filterCreatorName } from '@utils/generative';
import { wordCase } from '@utils/common';
import ButtonBuyListedFromETH from '@components/Transactor/ButtonBuyListedFromETH';
import usePurchaseStatus from '@hooks/usePurchaseStatus';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const GenerativeTokenDetail: React.FC = (): React.ReactElement => {
  // const router = useRouter();
  // const { projectID } = router.query;
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
  // const mintedDate = dayjs(tokenData?.mintedTime).format('MMM DD, YYYY');
  const [isBuying, setIsBuying] = useState(false);
  // const [hasProjectInteraction, setHasProjectInteraction] = useState(false);

  const { isWaiting, isBuyETH, isBuyBTC, isBuyable } = usePurchaseStatus({
    buyable: tokenData?.buyable,
    isVerified: tokenData?.sell_verified,
    orderID: tokenData?.orderID,
    priceBTC: tokenData?.priceBTC,
    priceETH: tokenData?.priceETH,
  });

  const [hasProjectInteraction, setHasProjectInteraction] = useState(false);

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
      if (ordinalsData?.timestamp) {
        info.push({
          id: 'timestamp',
          info: 'Timestamp',
          value: ordinalsData?.timestamp,
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
    return (
      projectData?.creatorProfile?.profileSocial?.twitterVerified ||
      tokenData?.creator?.profileSocial?.twitterVerified ||
      false
    );
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
      const _attirbutes = [...tokenData.attributes];

      const list = _attirbutes.sort((a, b) =>
        a.trait_type.localeCompare(b.trait_type)
      );

      return list.map(attr => {
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

  const tokenDescription = useMemo((): string => {
    return tokenData?.description || projectData?.desc || '';
  }, [tokenData, projectData]);

  const handleBuyToken = async (): Promise<void> => {
    setIsBuying(true);
    await handlePurchaseToken(listingOffers[0]);
    setIsBuying(false);
  };

  const isFromAuthentic = useMemo(() => {
    return projectData?.fromAuthentic || false;
  }, [projectData]);

  const renderBuyBTCView = () => {
    if (!tokenData) return null;
    if (isWaiting) {
      return (
        <Heading as={'h6'} fontWeight="medium" className={s.waiting}>
          Incoming...
        </Heading>
      );
    }
    if (!isBuyable) return null;
    return (
      <Row className={s.buy_btc}>
        {isBuyETH && (
          <Col md="5" lg="5" className={s.buy_btc_wrap}>
            <ButtonBuyListedFromETH
              sizes={'large'}
              inscriptionID={tokenData.tokenID}
              price={tokenData.priceETH}
              inscriptionNumber={Number(tokenData.inscriptionIndex || 0)}
              orderID={tokenData.orderID}
              isDetail={true}
            />
          </Col>
        )}
        {isBuyBTC && (
          <Col md="5" lg="5" className={s.buy_btc_wrap}>
            <ButtonBuyListedFromBTC
              sizes={'large'}
              inscriptionID={tokenData.tokenID}
              price={tokenData.priceBTC}
              inscriptionNumber={Number(tokenData.inscriptionIndex || 0)}
              orderID={tokenData.orderID}
              isDetail={true}
            />
          </Col>
        )}
      </Row>
    );
  };

  const renderOwner = useCallback(() => {
    if (!tokenData?.owner && !tokenData?.ownerAddr) return null;
    return (
      <>
        {tokenData?.owner ? (
          <Text size="18" className={s.owner}>
            Owned by{' '}
            <Link
              href={`${ROUTE_PATH.PROFILE}/${tokenData?.owner?.walletAddressBtcTaproot}`}
              className={s.projectName}
            >
              {tokenData?.owner?.displayName ||
                formatAddress(
                  tokenData?.owner?.walletAddressBtcTaproot ||
                    tokenData?.owner?.walletAddress ||
                    ''
                )}
            </Link>
          </Text>
        ) : (
          <Text size="18" className={s.owner}>
            Owned by{' '}
            <Link
              href={`${ROUTE_PATH.PROFILE}/${tokenData?.ownerAddr}`}
              className={s.projectName}
            >
              {formatAddress(tokenData?.ownerAddr || '')}
            </Link>
          </Text>
        )}
      </>
    );
  }, [tokenData?.owner, tokenData?.ownerAddr]);

  const projectName = useMemo((): string => {
    return projectData?.fromAuthentic || false
      ? wordCase(`Ordinal ${projectData?.name} `)
      : `${projectData?.name} `;
  }, [projectData]);

  useEffect(() => {
    const exists = projectData?.desc.includes('Interaction');
    if (exists) {
      setHasProjectInteraction(true);
    } else {
      setHasProjectInteraction(false);
    }
  }, [projectData?.desc]);

  return (
    <>
      <Container>
        <div className={`row ${s.wrapper}`}>
          <div className="col-xl-4 col-md-6 col-12">
            <div className={s.itemInfo_wrapper}>
              <div className={s.itemInfo}>
                <Loading isLoaded={!!tokenData} className={s.loading_token} />
                <div className={`${s.projectHeader}`}>
                  <Link
                    href={`${ROUTE_PATH.PROFILE}/${
                      projectData?.creatorProfile?.walletAddressBtcTaproot ||
                      projectData?.creatorProfile?.walletAddress
                    }`}
                    className={cs(
                      s.creator_info,
                      !projectData?.creatorProfile?.walletAddressBtcTaproot &&
                        !projectData?.creatorProfile?.walletAddress &&
                        'pointer-none'
                    )}
                  >
                    <Heading
                      className={s.projectHeader_creator}
                      as="h4"
                      fontWeight="medium"
                    >
                      {projectData && filterCreatorName(projectData)}
                    </Heading>
                  </Link>
                  <SocialVerify
                    isTwVerified={isTwVerified}
                    link={SOCIALS.twitter}
                  />
                </div>

                <Heading
                  as="h4"
                  className={s.itemInfo_heading}
                  fontWeight="medium"
                >
                  <span
                    title={`${projectData?.name} #${formatTokenId(
                      isFromAuthentic
                        ? projectData?.nftTokenId || ''
                        : tokenData?.tokenID || ''
                    )}`}
                    className={isFromAuthentic ? s.isAuthentic : ''}
                  >
                    <Link
                      href={`${ROUTE_PATH.GENERATIVE}/${projectData?.tokenID}`}
                    >
                      {projectName}
                    </Link>
                    #
                    {isFromAuthentic
                      ? projectData?.nftTokenId || ''
                      : tokenData?.orderInscriptionIndex
                      ? tokenData?.orderInscriptionIndex
                      : tokenData?.inscriptionIndex
                      ? tokenData?.inscriptionIndex
                      : formatTokenId(tokenData?.tokenID || '')}
                  </span>
                </Heading>
                {renderOwner()}
                {renderBuyBTCView()}
                {mobileScreen && (
                  <div className={s.reviewOnMobile}>
                    <ThumbnailPreview data={tokenData} previewToken />
                  </div>
                )}
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
                          sizes={'large'}
                          onClick={handleOpenListingTokenModal}
                        >
                          List for sale
                        </ButtonIcon>
                      )}
                      {isTokenOwner && isTokenListing && (
                        <ButtonIcon
                          sizes={'large'}
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
                          sizes={'large'}
                        >
                          Transfer
                        </ButtonIcon>
                      )}

                      {!isTokenOwner && isTokenListing && (
                        <>
                          <ButtonIcon
                            sizes={'large'}
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
                          sizes={'large'}
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
                      desc={tokenDescription}
                      attributes={
                        featuresList() ? (
                          <Stats data={featuresList() || []} />
                        ) : (
                          ''
                        )
                      }
                      hasInteraction={hasProjectInteraction}
                      descInteraction={projectData?.desc || ''}
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
                {isFromAuthentic && (
                  <AuthenticCard
                    nftTokenId={tokenData?.nftTokenId || ''}
                    project={tokenData?.project || null}
                  />
                )}
              </div>
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
                    <SvgInset
                      size={14}
                      svgUrl={`${CDN_URL}/icons/ic-flag.svg`}
                    />
                    <Text as="span" size="14" fontWeight="medium">
                      Report
                    </Text>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {!mobileScreen && (
            <div className="col-xl-8 col-md-6 col-12">
              <div className={s.thumbnailBg}>
                <ThumbnailPreview
                  data={tokenData}
                  isBitcoinProject={isBitcoinProject}
                  previewToken
                />
              </div>
            </div>
          )}
        </div>
        <div className="h-divider" />
        <TokenActivities />
        <MoreItemsSection genNFTAddr={projectData?.genNFTAddr || ''} />

        {!isBitcoinProject ? (
          <TokenActivities />
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
