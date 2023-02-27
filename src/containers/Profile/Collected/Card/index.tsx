import Link from '@components/Link';
import NFTDisplayBox from '@components/NFTDisplayBox';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import useWindowSize from '@hooks/useWindowSize';
import { CollectedNFTStatus, ICollectedNFTItem } from '@interfaces/api/profile';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import { TwitterShareButton } from 'react-share';
import React, { useContext, useState } from 'react';
import s from './CollectedCard.module.scss';
import Image from 'next/image';
import ButtonIcon from '@components/ButtonIcon';
import SendInscriptionModal from '@containers/Profile/Collected/Modal/SendInscription';
import { HistoryStatusType } from '@interfaces/api/bitcoin';
import { useRouter } from 'next/router';
import { getStorageIns } from '@containers/Profile/Collected/Modal/SendInscription/utils';

interface IPros {
  project: ICollectedNFTItem;
  className?: string;
  index?: number;
}

export const CollectedCard = ({ project, className }: IPros): JSX.Element => {
  const { mobileScreen } = useWindowSize();
  const user = useAppSelector(getUserSelector);
  const [showSendModal, setShowSendModal] = React.useState(false);

  const { handelcancelMintingNFT, feeRate, isLoadingHistory, history } =
    useContext(ProfileContext);

  const toggleModal = () => {
    setShowSendModal(value => !value);
  };
  const router = useRouter();
  const { walletAddress } = router.query as { walletAddress: string };
  const isOwner = !walletAddress || user?.walletAddress === walletAddress;

  const [thumb, setThumb] = useState<string>(project.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const isSending = React.useMemo(() => {
    const findHistory = (history || []).find(
      tx =>
        !!project.inscriptionID &&
        !!tx.inscription_id &&
        tx.inscription_id === project.inscriptionID
    );
    if (!findHistory) return false;
    return findHistory.status === HistoryStatusType.pending;
  }, [history, project.inscriptionID]);

  const showSendButton = React.useMemo(() => {
    if (!isOwner) return false;
    if (!project?.inscriptionID || !!getStorageIns(project?.inscriptionID))
      return false;
    return (
      !isSending &&
      !isLoadingHistory &&
      project?.status === CollectedNFTStatus.Success
    );
  }, [
    isSending,
    isLoadingHistory,
    project?.status,
    isOwner,
    project?.inscriptionID,
  ]);

  const linkPath =
    project.status === CollectedNFTStatus.Success
      ? project.projectID
        ? `${ROUTE_PATH.GENERATIVE}/${project.projectID}/${project.inscriptionID}`
        : `${ROUTE_PATH.LIVE}/${project.inscriptionID}`
      : `${ROUTE_PATH.GENERATIVE}/${project.projectID}`;

  const projectName =
    project.status === CollectedNFTStatus.Success
      ? `#${project.inscriptionNumber}`
      : project.projectName || '';

  const isNotShowBlur =
    project.status === CollectedNFTStatus.Success ||
    project.statusText === 'Transferring';

  const renderStatusText = () => {
    if (isSending) {
      return (
        <Text
          className={s.projectCard_creator_status}
          size={'16'}
          fontWeight="medium"
          color="black-40"
        >
          Pending...
        </Text>
      );
    }
    return (
      <>
        {project.status !== CollectedNFTStatus.Success && (
          <Text
            className={s.projectCard_creator_status}
            size={'16'}
            fontWeight="medium"
            color="black-40"
          >
            {`${project.statusText}...`}
          </Text>
        )}
      </>
    );
  };

  return (
    <>
      <Link href={linkPath} className={`${s.projectCard} ${className}`}>
        <div className={s.projectCard_inner}>
          {project.image ? (
            <div
              className={`${s.projectCard_thumb} ${
                thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
              }`}
            >
              <div className={s.projectCard_thumb_inner}>
                <Image
                  fill
                  onError={onThumbError}
                  src={convertIpfsToHttp(thumb)}
                  alt={project.name}
                  loading={'lazy'}
                />
              </div>
              {!isNotShowBlur && (
                <div className={s.projectCard_thumb_backdrop} />
              )}
            </div>
          ) : (
            <div className={`${s.projectCard_thumb}`}>
              <div className={s.projectCard_thumb_inner}>
                <NFTDisplayBox
                  inscriptionID={project.inscriptionID}
                  type={project.contentType}
                  variants="absolute"
                />
              </div>
              {!isNotShowBlur && (
                <div className={s.projectCard_thumb_backdrop} />
              )}
            </div>
          )}
          <div className={s.projectCard_status}>
            {mobileScreen ? (
              <div className={cs(s.projectCard_info, s.mobile)}>
                {renderStatusText()}
                {projectName && (
                  <Text size="11" fontWeight="medium">
                    {projectName}
                  </Text>
                )}
              </div>
            ) : (
              <div className={cs(s.projectCard_info, s.desktop)}>
                {renderStatusText()}
                {projectName && (
                  <div className={s.projectCard_creator}>
                    <Text size={'20'} fontWeight="medium">
                      {projectName}
                    </Text>
                  </div>
                )}
              </div>
            )}
            {project.status === CollectedNFTStatus.Success && (
              <div className={s.projectCard_info_share}>
                <TwitterShareButton
                  url={`${location.origin}${linkPath}?referral_code=${user?.id}`}
                  title={''}
                  hashtags={[]}
                >
                  <SvgInset
                    size={16}
                    svgUrl={`${CDN_URL}/icons/ic-twitter-20x20.svg`}
                  />
                </TwitterShareButton>
              </div>
            )}
            {showSendButton && (
              <Link href="" onClick={toggleModal}>
                <ButtonIcon
                  variants="outline"
                  className={s.projectCard_status_sendBtn}
                >
                  Send
                </ButtonIcon>
              </Link>
            )}
            {project.isCancel && (
              <Link
                href=""
                className={s.projectCard_status_cancelBtn}
                onClick={() => handelcancelMintingNFT(project.id)}
              >
                <Text as="span" size="14" fontWeight="medium">
                  Cancel
                </Text>
              </Link>
            )}
          </div>
        </div>
      </Link>
      {!!project.inscriptionID &&
        !!feeRate &&
        showSendModal &&
        showSendButton && (
          <SendInscriptionModal
            showModal={showSendModal}
            inscriptionID={project.inscriptionID}
            onClose={toggleModal}
            inscriptionNumber={Number(project.inscriptionNumber || 0)}
          />
        )}
    </>
  );
};
