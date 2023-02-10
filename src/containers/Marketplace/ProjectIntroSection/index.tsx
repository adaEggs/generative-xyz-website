import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import { Loading } from '@components/Loading';
import ProgressBar from '@components/ProgressBar';
import Text from '@components/Text';
import ThumbnailPreview from '@components/ThumbnailPreview';
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
import { covertPriceToBTC } from '@services/btc';
import MintGenerativeNFTOperation from '@services/contract-operations/generative-nft/mint-generative-nft';
import { getMarketplaceStats } from '@services/marketplace';
import { isTestnet } from '@utils/chain';
import { convertToETH } from '@utils/currency';
import { base64ToUtf8, escapeSpecialChars, formatAddress } from '@utils/format';
import { checkIsBitcoinProject } from '@utils/generative';
import log from '@utils/logger';
import { checkLines } from '@utils/string';
import dayjs from 'dayjs';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-eth';
import s from './styles.module.scss';
import { BitcoinContext } from '@contexts/bitcoin-context';
import MarkdownPreview from '@components/MarkdownPreview';

const LOG_PREFIX = 'ProjectIntroSection';

type Props = {
  project?: IGetProjectDetailResponse | null;
  openMintBTCModal: () => void;
};

const ProjectIntroSection = ({ project, openMintBTCModal }: Props) => {
  const { getWalletBalance } = useContext(WalletContext);
  const { aVailable, countDown } = useContext(BitcoinContext);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();
  const [projectDetail, setProjectDetail] = useState<Omit<Token, 'owner'>>();
  const [showMore, setShowMore] = useState(false);
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
        parseFloat(Web3.utils.fromWei(project.mintPrice.toString()))
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
        mintFee: project.mintPrice.toString(),
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

  // const offerAvailable = useMemo(() => {
  //   if (project?.mintingInfo?.index && project?.maxSupply) {
  //     return (
  //       project?.mintingInfo?.index > 0 &&
  //       project?.mintingInfo?.index <= project?.maxSupply
  //     );
  //   }
  //   return false;
  // }, [project?.mintingInfo?.index, project?.maxSupply]);

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
          <Heading as="h4" fontWeight="medium">
            {project?.name}
          </Heading>

          <Text size={'18'} color={'black-60'} style={{ marginBottom: '10px' }}>
            <Link
              className={s.info_creatorLink}
              href={`${ROUTE_PATH.PROFILE}/${project?.creatorAddr}`}
            >
              {project?.creatorProfile?.displayName ||
                formatAddress(project?.creatorProfile?.walletAddress || '')}
            </Link>
          </Text>
          {mobileScreen && (
            <div>
              <ThumbnailPreview data={projectDetail as Token} allowVariantion />
            </div>
          )}

          {!isBitcoinProject &&
            project?.mintingInfo.index !== project?.maxSupply && (
              <ProgressBar
                current={project?.mintingInfo?.index}
                total={project?.maxSupply}
                className={s.progressBar}
              />
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
              {isBitcoinProject && aVailable && (
                <ButtonIcon
                  sizes="large"
                  className={s.mint_btn}
                  onClick={openMintBTCModal}
                >
                  <Text as="span" size="14" fontWeight="medium">
                    {isMinting && 'Minting...'}
                    {!isMinting && project?.mintPrice && (
                      <>{`Mint now ${covertPriceToBTC(
                        Number(project?.mintPrice)
                      )} BTC`}</>
                    )}
                  </Text>
                </ButtonIcon>
              )}
            </div>
          )}

          {isBitcoinProject && <div className={s.countDown}>{countDown}</div>}

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
            <div className={s.project_desc}>
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
                style={{ WebkitLineClamp: showMore ? 'unset' : '10' }}
              >
                <MarkdownPreview
                  source={project?.desc}
                  className={s.token_description_content}
                />
              </div>

              {project?.desc && checkLines(project.desc) > 10 && (
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
            </div>
            {!isBitcoinProject && (
              <>
                <Text size="14" color="black-40">
                  Created date: {mintedDate}
                </Text>
                <Text size="14" color="black-40" className={s.project_owner}>
                  Collected by:{' '}
                  {project?.stats?.uniqueOwnerCount === 1
                    ? `${project?.stats?.uniqueOwnerCount} owner`
                    : `${project?.stats?.uniqueOwnerCount}+ owners`}
                  {/* </Text> */}
                </Text>
              </>
            )}
          </div>
          {!isBitcoinProject && (
            <div className={s.license}>
              <Text size="14">License: {project?.license}</Text>
            </div>
          )}
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
      <div></div>
      {!mobileScreen && (
        <div>
          <ThumbnailPreview data={projectDetail as Token} allowVariantion />
        </div>
      )}
    </div>
  );
};

export default ProjectIntroSection;
