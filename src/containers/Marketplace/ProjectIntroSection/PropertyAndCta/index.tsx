import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { EXTERNAL_LINK } from '@constants/external-link';
import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { PaymentMethod } from '@enums/mint-generative';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import { useContext } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import cs from 'classnames';
import { ROUTE_PATH } from '@constants/route-path';

export const PropertyAndCta = (): JSX.Element => {
  const {
    project,
    projectFeeRate,
    minted,
    isWhitelist,
    isMinting,
    isAvailable,
    isRoyalty,
    isLimitMinted,
    openMintBTCModal,
    textMint,
    priceMemo,
    priceEthMemo,
    onHandlePaymentWithWallet,
  } = useContext(ProjectLayoutContext);

  return (
    <>
      <div className={s.stats}>
        <div className={s.stats_item}>
          <Text size="12" fontWeight="medium">
            MINTED
          </Text>
          <Heading as="h6" fontWeight="medium">
            {minted}
          </Heading>
        </div>
        {!!project?.btcFloorPrice && (
          <div className={s.stats_item}>
            <Text size="12" fontWeight="medium">
              Floor Price
            </Text>
            <Heading as="h6" fontWeight="medium">
              {formatBTCPrice(project?.btcFloorPrice)}
            </Heading>
          </div>
        )}
        {isRoyalty && (
          <div className={s.stats_item}>
            <Text size="12" fontWeight="medium">
              royalty
            </Text>
            <Heading as="h6" fontWeight="medium">
              {(project?.royalty || 0) / 100}%
            </Heading>
          </div>
        )}
      </div>
      {!isWhitelist && project?.status && (
        <div className={cs(s.CTA, project?.isReviewing && s.daoReview)}>
          {/* {!isBitcoinProject && (
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
          )} */}
          {isAvailable && !!project?.btcFloorPrice && !project?.isHidden && (
            <>
              <ButtonIcon
                sizes="medium"
                className={`${s.mint_btn}`}
                onClick={() => {
                  const element = document.getElementById('PROJECT_LIST');
                  if (!element) return;
                  element.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                <Text as="span" size="14" fontWeight="medium">
                  Buy
                  <span style={{ marginLeft: 24 }}>{`${formatBTCPrice(
                    project.btcFloorPrice
                  )} BTC`}</span>
                </Text>
              </ButtonIcon>
            </>
          )}
          {isAvailable && isLimitMinted && !project?.isHidden && (
            <ul>
              {projectFeeRate && (
                <li>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 0, hide: 100 }}
                    overlay={
                      projectFeeRate?.fastest.mintFees.btc.networkFee ? (
                        <Tooltip id="btc-fee-tooltip">
                          <Text
                            size="14"
                            fontWeight="semibold"
                            color="primary-333"
                          >
                            Inscription fee:{' '}
                            {formatBTCPrice(
                              Number(
                                projectFeeRate?.fastest.mintFees.btc.networkFee
                              )
                            )}{' '}
                            BTC
                          </Text>
                        </Tooltip>
                      ) : (
                        <></>
                      )
                    }
                  >
                    <ButtonIcon
                      sizes="large"
                      className={s.mint_btn}
                      onClick={() => {
                        openMintBTCModal && openMintBTCModal(PaymentMethod.BTC);
                      }}
                    >
                      <Text as="span" size="14" fontWeight="medium">
                        {isMinting && 'Minting...'}
                        {!isMinting && (
                          <>
                            <span>{textMint}</span>

                            {Number(
                              projectFeeRate?.fastest.mintFees.btc.mintPrice
                            ) ? (
                              <span>{priceMemo}</span>
                            ) : (
                              ' with'
                            )}
                            {` BTC`}
                          </>
                        )}
                      </Text>
                    </ButtonIcon>
                  </OverlayTrigger>
                </li>
              )}
              {projectFeeRate && (
                <li>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 0, hide: 100 }}
                    overlay={
                      projectFeeRate?.fastest.mintFees.eth.networkFee ? (
                        <Tooltip id="btc-fee-tooltip">
                          <Text
                            size="14"
                            fontWeight="semibold"
                            color="primary-333"
                          >
                            Inscription fee:{' '}
                            {formatEthPrice(
                              projectFeeRate?.fastest.mintFees.eth.networkFee ||
                                ''
                            )}{' '}
                            ETH
                          </Text>
                        </Tooltip>
                      ) : (
                        <></>
                      )
                    }
                  >
                    <ButtonIcon
                      sizes="large"
                      variants="outline"
                      className={`${s.mint_btn} ${s.mint_btn__eth}`}
                      onClick={() => {
                        openMintBTCModal && openMintBTCModal(PaymentMethod.ETH);
                      }}
                    >
                      <Text as="span" size="14" fontWeight="medium">
                        {isMinting && 'Minting...'}
                        {!isMinting && (
                          <>
                            <span>{textMint}</span>
                            {Number(
                              projectFeeRate?.fastest.mintFees.eth.mintPrice
                            ) ? (
                              <span>{priceEthMemo}</span>
                            ) : (
                              ' with'
                            )}
                            {` ETH`}
                          </>
                        )}
                      </Text>
                    </ButtonIcon>
                  </OverlayTrigger>
                </li>
              )}
            </ul>
          )}
          {isAvailable && isLimitMinted && project.isReviewing && (
            <>
              <ul>
                <li>
                  <ButtonIcon sizes="large" className={s.mint_btn} disabled>
                    <Text as="span" size="14" fontWeight="medium">
                      <>
                        <span>{textMint}</span>

                        {Number(
                          projectFeeRate?.fastest.mintFees.btc.mintPrice
                        ) ? (
                          <span>{priceMemo}</span>
                        ) : (
                          ' with'
                        )}
                        {` BTC`}
                      </>
                    </Text>
                  </ButtonIcon>
                </li>
                <li>
                  <ButtonIcon
                    sizes="large"
                    variants="outline-small"
                    className={`${s.mint_btn} ${s.mint_btn__eth}`}
                    disabled
                  >
                    <Text as="span" size="14" fontWeight="medium">
                      <>
                        <span>{textMint}</span>
                        {Number(
                          projectFeeRate?.fastest.mintFees.eth.mintPrice
                        ) ? (
                          <span>{priceEthMemo}</span>
                        ) : (
                          ' with'
                        )}
                        {` ETH`}
                      </>
                    </Text>
                  </ButtonIcon>
                </li>
              </ul>
              <div className={cs(s.reportMsg)}>
                <SvgInset
                  size={18}
                  svgUrl={`${CDN_URL}/icons/ic-bell-ringing.svg`}
                />
                <Text size={'14'} fontWeight="bold">
                  This collection is currently under review.
                </Text>
              </div>
              <ButtonIcon sizes="large">
                <Link href={`${ROUTE_PATH.DAO}?keyword=${project?.name}`}>
                  <Text fontWeight="medium">Vote in DAO</Text>
                </Link>
              </ButtonIcon>
            </>
          )}
        </div>
      )}

      {isWhitelist &&
        !!project?.whiteListEthContracts &&
        project?.whiteListEthContracts.length > 0 && (
          <>
            <ButtonIcon
              sizes="large"
              onClick={onHandlePaymentWithWallet}
              className={s.mint_free}
            >
              Mint Satoshi free
            </ButtonIcon>
            <div className={s.whiteListWallet}>
              <Text size="12" as="span" color="black-60">
                If you’re a member of{' '}
              </Text>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 100, hide: 300 }}
                overlay={
                  <Tooltip id="whitelist-tooltip">
                    <Text size="12" fontWeight="semibold" color="primary-333">
                      ArtBlocks, CryptoPunks, BAYC, MAYC, Meebits, Proof,
                      Moonbirds, Moonbirds Oddities, CloneX, gmDAO.
                    </Text>
                  </Tooltip>
                }
              >
                <div className="d-inline cursor-pointer">
                  <Text size="12" as="span" color="purple-c">
                    these communities
                  </Text>
                </div>
              </OverlayTrigger>
              <Text size="12" as="span" color="black-60">
                {' '}
                (ArtBlocks, CryptoPunks, BAYC, etc.), you can claim your Satoshi
                for free. Only pay the network inscription fees, which are 0.033
                ETH (~0.0023 BTC). Generative integrates with{' '}
                <Link
                  href={EXTERNAL_LINK.DELEGATE_CASH}
                  target="_blank"
                  className="hover-underline text-purple-c hover-purple-c"
                >
                  delegate.cash
                </Link>{' '}
                to prove ownership.
              </Text>
            </div>
          </>
        )}
    </>
  );
};
