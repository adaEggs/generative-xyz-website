import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import LinkShare from '@components/LinkShare';
import { Loading } from '@components/Loading';
import ProgressBar from '@components/ProgressBar';
import ProjectDescription from '@components/ProjectDescription';
import Text from '@components/Text';
import ThumbnailPreview from '@components/ThumbnailPreview';
import TwitterShare from '@components/TwitterShare';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import { isProduction } from '@utils/common';
import { NETWORK_CHAIN_ID } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { WalletContext } from '@contexts/wallet-context';
import { ErrorMessage } from '@enums/error-message';
import { LogLevel } from '@enums/log-level';
import useContractOperation from '@hooks/useContractOperation';
import useWindowSize from '@hooks/useWindowSize';
import { IGetProjectDetailResponse } from '@interfaces/api/project';
import { IMintGenerativeNFTParams } from '@interfaces/contract-operations/mint-generative-nft';
import { MarketplaceStats } from '@interfaces/marketplace';
import { Token } from '@interfaces/token';
import MintGenerativeNFTOperation from '@services/contract-operations/generative-nft/mint-generative-nft';
import { getMarketplaceStats } from '@services/marketplace';
import { isTestnet } from '@utils/chain';
import { convertToETH } from '@utils/currency';
import {
  base64ToUtf8,
  escapeSpecialChars,
  formatAddress,
  formatBTCPrice,
  formatEthPrice,
} from '@utils/format';
import { checkIsBitcoinProject } from '@utils/generative';
import log from '@utils/logger';
import dayjs from 'dayjs';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-eth';
import s from './styles.module.scss';

const LOG_PREFIX = 'ProjectIntroSection';

type Props = {
  project?: IGetProjectDetailResponse | null;
  openMintBTCModal: (s: 'BTC' | 'ETH') => void;
};

const ProjectIntroSection = ({ project, openMintBTCModal }: Props) => {
  const router = useRouter();
  const user = useAppSelector(getUserSelector);
  const { mobileScreen } = useWindowSize();

  const { getWalletBalance, connect } = useContext(WalletContext);
  const { setPaymentMethod, setIsPopupPayment, setPaymentStep } = useContext(
    BitcoinProjectContext
  );
  const [isAvailable, _setIsAvailable] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [projectDetail, setProjectDetail] = useState<Omit<Token, 'owner'>>();
  const [hasProjectInteraction, setHasProjectInteraction] = useState(false);

  useEffect(() => {
    const exists = project?.desc.includes('Interaction');
    if (exists) {
      setHasProjectInteraction(true);
    } else {
      setHasProjectInteraction(false);
    }
  }, [project?.desc]);

  const [marketplaceStats, setMarketplaceStats] =
    useState<MarketplaceStats | null>(null);

  const mintedTime = project?.mintedTime;
  let mintDate = dayjs();
  if (mintedTime) {
    mintDate = dayjs(mintedTime);
  }
  const mintedDate = mintDate.format('MMM DD, YYYY');
  const {
    call: mintToken,
    reset: resetMintToken,
    errorMessage,
  } = useContractOperation<IMintGenerativeNFTParams, TransactionReceipt>(
    MintGenerativeNFTOperation,
    true
  );
  const [isMinting, setIsMinting] = useState(false);

  const isBitcoinProject = useMemo((): boolean => {
    if (!project) return false;
    return checkIsBitcoinProject(project.tokenID);
  }, [project]);

  const isLimitMinted = useMemo((): boolean => {
    if (!project) return false;
    return project?.mintingInfo?.index < project?.maxSupply;
  }, [project]);

  const handleFetchMarketplaceStats = async () => {
    try {
      if (projectDetail && project?.genNFTAddr) {
        const res = await getMarketplaceStats({
          collectionAddr: project?.genNFTAddr,
        });
        if (res) setMarketplaceStats(res?.stats);
      }
    } catch (e) {
      log('can not fetch price', LogLevel.ERROR, '');
    }
  };

  const handleMintToken = async () => {
    try {
      setIsMinting(true);

      if (!project) {
        return;
      }

      const walletBalance = await getWalletBalance();

      if (
        walletBalance <
        parseFloat(Web3.utils.fromWei(project.mintPriceEth.toString()))
      ) {
        if (isTestnet()) {
          toast.error(
            'Insufficient funds testnet. Go to profile and get testnet faucet'
          );
        } else {
          toast.error('Insufficient funds.');
        }
        return;
      }

      const mintTx = await mintToken({
        projectAddress: project.genNFTAddr,
        mintFee: project.mintPriceEth.toString(),
        chainID: NETWORK_CHAIN_ID,
      });

      if (!mintTx) {
        toast.error(ErrorMessage.DEFAULT);
        return;
      }

      const tokenID: string | null = _get(
        mintTx,
        'events.Transfer.returnValues.tokenId',
        null
      );
      setTimeout(() => {
        router.push(`/generative/${project.tokenID}/${tokenID}`);
      }, 1000);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsMinting(false);
    }
  };

  const isProjectDetailPage = !!router.query.projectID;
  const priceMemo = useMemo(
    () => formatBTCPrice(Number(project?.mintPrice)),
    [project?.mintPrice]
  );

  const priceEthMemo = useMemo(
    () => formatEthPrice(project?.mintPriceEth || null),
    [project?.mintPriceEth]
  );

  // pay with wallet project btc

  const payWithWallet = () => {
    setPaymentMethod('WALLET');
    setIsPopupPayment(true);
    setPaymentStep('mint');
  };

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
      payWithWallet();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const onHandlePaymentWithWallet = useCallback(() => {
    if (isConnecting) return;
    if (!user) {
      handleConnectWallet();
    } else {
      payWithWallet();
    }
  }, [user, isConnecting]);

  const renderLeftContent = () => {
    if (!project && !marketplaceStats)
      return (
        <div className={s.info}>
          <Loading
            isLoaded={!!project && !!marketplaceStats}
            className={s.loading_project}
          />
        </div>
      );

    if (isProjectDetailPage) {
      return (
        <div className={s.info}>
          {/*{isBitcoinProject && (*/}
          {/*  <CountDown*/}
          {/*    prefix={'Drop ends in'}*/}
          {/*    isDetail={true}*/}
          {/*    setIsAvailable={setIsAvailable}*/}
          {/*    openMintUnixTimestamp={project?.openMintUnixTimestamp || 0}*/}
          {/*    closeMintUnixTimestamp={project?.closeMintUnixTimestamp || 0}*/}
          {/*  />*/}
          {/*)}*/}

          <Heading as="h4" fontWeight="medium">
            {project?.name}
          </Heading>

          <Text size={'18'} color={'black-60'} style={{ marginBottom: '10px' }}>
            <div
            // className={s.info_creatorLink}
            // href={`${ROUTE_PATH.PROFILE}/${project?.creatorAddr}`}
            >
              {project?.creatorProfile?.displayName ||
                formatAddress(project?.creatorProfile?.walletAddress || '')}
            </div>
          </Text>
          {mobileScreen && (
            <div>
              <ThumbnailPreview data={projectDetail as Token} allowVariantion />
            </div>
          )}

          {project?.mintingInfo.index !== project?.maxSupply && (
            <ProgressBar
              current={project?.mintingInfo?.index}
              total={project?.maxSupply || project?.limit}
              className={s.progressBar}
            />
          )}

          {isBitcoinProject && (
            <span className={s.priceBtc}>
              {priceMemo} <small>BTC</small>
            </span>
          )}

          {project?.status && (
            <div className={s.CTA}>
              {!isBitcoinProject && (
                <ButtonIcon
                  sizes="large"
                  className={s.mint_btn}
                  disabled={isMinting}
                  onClick={handleMintToken}
                >
                  <Text as="span" size="14" fontWeight="medium">
                    {isMinting && 'Minting...'}
                    {!isMinting && project?.mintPrice && (
                      <>
                        {`Mint now Ξ${Web3.utils.fromWei(
                          project?.mintPrice,
                          'ether'
                        )}`}
                      </>
                    )}
                  </Text>
                </ButtonIcon>
              )}

              {isBitcoinProject && isAvailable && isLimitMinted && (
                <ul>
                  <li>
                    <ButtonIcon
                      sizes="large"
                      className={s.mint_btn}
                      onClick={() => {
                        openMintBTCModal('BTC');
                      }}
                    >
                      <Text as="span" size="14" fontWeight="medium">
                        {isMinting && 'Minting...'}
                        {!isMinting && (
                          <>
                            <span>{`Mint `}</span>
                            <span>
                              <span>{priceMemo}</span>
                              {` BTC`}
                            </span>
                          </>
                        )}
                      </Text>
                    </ButtonIcon>
                  </li>
                  <li>
                    <ButtonIcon
                      sizes="large"
                      className={`${s.mint_btn} ${s.mint_btn__eth}`}
                      onClick={() => {
                        openMintBTCModal('ETH');
                      }}
                    >
                      <Text as="span" size="14" fontWeight="medium">
                        {isMinting && 'Minting...'}
                        {!isMinting && (
                          <>
                            <span>{`Mint `}</span>
                            <span>
                              <span>{priceEthMemo}</span>
                              {` ETH`}
                            </span>
                          </>
                        )}
                      </Text>
                    </ButtonIcon>
                  </li>

                  {isProduction() && !!project?.whiteListEthContracts && (
                    <li>
                      <ButtonIcon
                        sizes="large"
                        variants={'filter'}
                        className={`${s.mint_btn} ${s.mint_btn__wallet}`}
                        onClick={onHandlePaymentWithWallet}
                      >
                        <Text as="span" size="14" fontWeight="medium">
                          {isConnecting ? 'Connecting...' : 'Wallet'}
                        </Text>
                      </ButtonIcon>
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          {!isBitcoinProject && (
            <div className={s.stats}>
              <div className={s.stats_item}>
                <Text size="12" fontWeight="medium">
                  Outputs
                </Text>
                <Heading as="h6" fontWeight="medium">
                  {project?.mintingInfo?.index}
                </Heading>
              </div>
              <div className={s.stats_item}>
                <Text size="12" fontWeight="medium">
                  Total Volume
                </Text>
                <Heading as="h6" fontWeight="medium">
                  {convertToETH(marketplaceStats?.totalTradingVolumn || '')}
                </Heading>
              </div>
              <div className={s.stats_item}>
                <Text size="12" fontWeight="medium">
                  Floor price
                </Text>
                <Heading as="h6" fontWeight="medium">
                  {convertToETH(marketplaceStats?.floorPrice || '')}
                </Heading>
              </div>

              <div className={s.stats_item}>
                <Text size="12" fontWeight="medium">
                  royalty
                </Text>
                <Heading as="h6" fontWeight="medium">
                  {(project?.royalty || 0) / 100}%
                </Heading>
              </div>
            </div>
          )}

          <div className={s.project_info}>
            <ProjectDescription
              desc={project?.desc || ''}
              hasInteraction={hasProjectInteraction}
            />
            <>
              <Text size="14" color="black-40">
                Created date: {mintedDate}
              </Text>
              {/* <Text size="14" color="black-40" className={s.project_owner}>
                Collected by:{' '}
                {project?.stats?.uniqueOwnerCount === 1
                  ? `${project?.stats?.uniqueOwnerCount} owner`
                  : `${project?.stats?.uniqueOwnerCount}+ owners`}
              </Text> */}
            </>
          </div>
          {!isBitcoinProject && (
            <div className={s.license}>
              <Text size="14">License: {project?.license}</Text>
            </div>
          )}
          <ul className={s.shares}>
            <li>
              <LinkShare
                url={`${location.origin}${ROUTE_PATH.GENERATIVE}/${project?.tokenID}`}
              />
            </li>
            <li>
              <TwitterShare
                url={`${location.origin}${ROUTE_PATH.GENERATIVE}/${project?.tokenID}`}
                title={''}
                hashtags={[]}
              />
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <></>
        // Do not remove code below, might use later
        // <div className={s.info}>
        //   <Text size="18" className="text-black-60">
        //     Recent Collection
        //   </Text>
        //   <Heading as="h4" fontWeight="semibold">
        //     {project?.name}
        //   </Heading>
        //   <Text size={'24'} color={'black-40'} style={{ marginBottom: '10px' }}>
        //     <Link
        //       className={s.info_creatorLink}
        //       href={`${ROUTE_PATH.PROFILE}/${project?.creatorAddr}`}
        //     >
        //       {project?.creatorProfile?.displayName ||
        //         formatAddress(project?.creatorProfile?.walletAddress || '')}
        //     </Link>
        //   </Text>
        //   {mobileScreen && (
        //     <div>
        //       <ThumbnailPreview data={projectDetail as Token} allowVariantion />
        //     </div>
        //   )}
        //   <ProgressBar
        //     current={project?.mintingInfo?.index}
        //     total={project?.maxSupply}
        //     className={s.progressBar}
        //   />
        //   <div className={s.CTA}>
        //     {project?.status && (
        //       <>
        //         <ButtonIcon
        //           sizes="large"
        //           className={s.mint_btn}
        //           endIcon={
        //             <SvgInset
        //               svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
        //             />
        //           }
        //           disabled={isMinting}
        //           onClick={handleMintToken}
        //         >
        //           {isMinting && 'Minting...'}
        //           {!isMinting && project?.mintPrice && (
        //             <>
        //               {'Mint now'} Ξ
        //               {Web3.utils.fromWei(project?.mintPrice, 'ether')}
        //             </>
        //           )}
        //         </ButtonIcon>
        //       </>
        //     )}
        //     {project?.tokenID && (
        //       <Link
        //         className={s.explore_btn}
        //         href={`${ROUTE_PATH.GENERATIVE}/${project?.tokenID}`}
        //       >
        //         Explore this collection
        //       </Link>
        //     )}
        //   </div>
        //   {project?.desc && project?.desc.length > 0 && (
        //     <div className={s.description}>
        //       <Text size="18">{project?.desc}</Text>
        //     </div>
        //   )}
        //   <div>
        //     <Text size="18" color="black-40">
        //       Created date: {mintedDate}
        //     </Text>
        //     <Text size="18" color="black-40" className={s.owner}>
        //       Collected by:{' '}
        //       <Text as="span" size="18">
        //         {project?.stats?.uniqueOwnerCount === 1
        //           ? `${project?.stats?.uniqueOwnerCount} owner`
        //           : `${project?.stats?.uniqueOwnerCount}+ owners`}
        //       </Text>
        //     </Text>
        //   </div>
        // </div>
      );
    }
  };

  useEffect(() => {
    handleFetchMarketplaceStats();
  }, [projectDetail]);

  useEffect(() => {
    if (errorMessage) {
      toast.remove();
      toast.error(ErrorMessage.DEFAULT);
      resetMintToken();
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!project) return;
    const _projectDetail = base64ToUtf8(
      project.projectURI.replace('data:application/json;base64,', '')
    );
    if (_projectDetail) {
      let projectDetailJSON = _projectDetail;
      if (!isBitcoinProject) {
        projectDetailJSON = escapeSpecialChars(_projectDetail);
      }
      const projectDetailObj = JSON.parse(projectDetailJSON);
      setProjectDetail(projectDetailObj);
    }
  }, [project?.id]);

  return (
    <div className={s.wrapper}>
      {renderLeftContent()}
      <div />
      {!mobileScreen && (
        <div>
          <ThumbnailPreview data={projectDetail as Token} allowVariantion />
        </div>
      )}
    </div>
  );
};

export default ProjectIntroSection;
