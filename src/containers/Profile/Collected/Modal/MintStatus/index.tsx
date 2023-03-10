import Button from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import SvgInset from '@components/SvgInset';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { CDN_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { ICollectedNFTItemDetail } from '@interfaces/api/profile';
import project from '@redux/project/reducer';
import { getDetailMintingCollectedNFT } from '@services/profile';
import log from '@utils/logger';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Step from './Step';
import s from './styles.module.scss';

const LOG_PREFIX = 'Mint-Transaction';

interface IMintStatus {
  showModal: boolean;
  onClose: () => void;
  mintID: string;
  projectName: string;
}

const MintStatusModal = (props: IMintStatus): JSX.Element => {
  const { mintID, projectName, showModal, onClose } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [nft, setNft] = useState<ICollectedNFTItemDetail>();
  const currentActiveStep = useRef(0);

  useEffect(() => {
    if (mintID) {
      getDetailMintingNFT();
    }
  }, [mintID]);

  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

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

  if (!showModal) {
    return <></>;
  }

  return (
    <div className={s.container}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <Button
                onClick={handleClose}
                className={s.closeBtn}
                variants="ghost"
                type="button"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.transaction}>
              <div className={s.transaction_header}>
                <p className={s.transaction_header_title}>{projectName}</p>
              </div>
              {nft ? (
                <div className={s.stepContainer}>
                  <Row className={s.row}>
                    <Col sm="3" lg="3">
                      <img
                        className={s.thumbnail}
                        src={nft?.projectImage || LOGO_MARKETPLACE_URL}
                        alt={project.name}
                      />
                    </Col>
                    <Col sm="9" lg="9">
                      {nft.progressStatus &&
                        nft.progressStatus.length > 0 &&
                        nft.progressStatus.map((step, index) => (
                          <Step
                            key={index.toString()}
                            nft={nft}
                            step={step}
                            index={index}
                            isHideIndicator={
                              index >= nft.progressStatus!.length - 1
                            }
                            currentActiveStep={currentActiveStep}
                          />
                        ))}
                    </Col>
                  </Row>
                </div>
              ) : (
                <div style={{ height: 300 }} />
              )}
            </div>
            <Loading isLoaded={!isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintStatusModal;
