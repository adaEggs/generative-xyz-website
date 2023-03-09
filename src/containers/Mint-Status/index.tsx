import { Loading } from '@components/Loading';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { LogLevel } from '@enums/log-level';
import { ICollectedNFTItemDetail } from '@interfaces/api/profile';
import project from '@redux/project/reducer';
import { getDetailMintingCollectedNFT } from '@services/profile';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import s from './MintTransaction.module.scss';
import Step from './Step';

const LOG_PREFIX = 'Mint-Transaction';

const Transaction = (): JSX.Element => {
  const router = useRouter();

  const { mintID } = router.query as { mintID: string };

  const [isLoading, setIsLoading] = useState(false);
  const [nft, setNft] = useState<ICollectedNFTItemDetail>();
  const currentActiveStep = useRef(0);

  useEffect(() => {
    if (mintID) {
      getDetailMintingNFT();
    }
  }, [mintID]);

  const getDetailMintingNFT = async () => {
    try {
      setIsLoading(true);
      const data = await getDetailMintingCollectedNFT(mintID);
      setNft(data);
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={s.transaction}>
      <Container>
        <div className={s.transaction_header}>
          <p className={s.transaction_header_title}>Mint NFT</p>
        </div>
        <div className={s.stepContainer}>
          <Row>
            <Col md="3" xl="3">
              <img
                className={s.thumbnail}
                src={nft?.projectImage || LOGO_MARKETPLACE_URL}
                alt={project.name}
              />
            </Col>
            <Col md="9" xl="8">
              {nft &&
                nft.progressStatus &&
                nft.progressStatus.map((step, index) => (
                  <Step
                    key={index.toString()}
                    nft={nft}
                    step={step}
                    index={index}
                    isHideIndicator={
                      !(
                        nft.progressStatus &&
                        index < nft.progressStatus.length - 1
                      )
                    }
                    currentActiveStep={currentActiveStep}
                  />
                ))}
            </Col>
          </Row>
        </div>
      </Container>
      <Loading isLoaded={!isLoading} />
    </div>
  );
};

export default Transaction;
