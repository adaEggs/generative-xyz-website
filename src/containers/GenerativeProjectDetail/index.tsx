import ClientOnly from '@components/Utils/ClientOnly';
import MintBTCGenerativeModal from '@containers/GenerativeProjectDetail/MintBTCGenerativeModal';
import MintETHModal from '@containers/GenerativeProjectDetail/MintETHGenerativeModal';
import ProjectIntroSection from '@containers/Marketplace/ProjectIntroSection';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import { PaymentMethod } from '@enums/mint-generative';
import { Project } from '@interfaces/project';
import React, { useContext, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';

import { GridDebug } from '@components/Grid/grid';
import { REPORT_COUNT_THRESHOLD } from '@constants/config';
import ReportModal from '@containers/Marketplace/ProjectIntroSection/ReportModal';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import MintLayout from './MintLayout';
import MintWalletModal from './MintWalletModal';
import ShopLayout from './ShopLayout';

const GenerativeProjectDetail: React.FC<{
  isWhitelist?: boolean;
  project?: Project;
}> = ({ isWhitelist, project }): React.ReactElement => {
  const {
    projectData: projectInfo,
    projectFeeRate,
    isLimitMinted,
  } = useContext(GenerativeProjectDetailContext);

  const user = useAppSelector(getUserSelector);

  const [showReportModal, setShowReportModal] = useState(false);

  const hasReported = useMemo(() => {
    if (!projectInfo?.reportUsers || !user) return false;

    const reportedAddressList = projectInfo?.reportUsers.map(
      item => item.reportUserAddress
    );

    return reportedAddressList.includes(user?.walletAddress || '');
  }, [projectInfo?.reportUsers]);

  const showReportMsg = useMemo(() => {
    if (
      projectInfo?.reportUsers &&
      projectInfo?.reportUsers.length >= REPORT_COUNT_THRESHOLD
    )
      return true;
    return false;
  }, [projectInfo?.reportUsers]);

  const {
    setIsPopupPayment,
    isPopupPayment,
    paymentStep,
    paymentMethod,
    setPaymentMethod,
    setPaymentStep,
  } = useContext(BitcoinProjectContext);

  const { ordAddress, onButtonClick } = useBTCSignOrd();

  return (
    <>
      <section>
        <ProjectIntroSection
          openMintBTCModal={(chain: PaymentMethod) => {
            onButtonClick({
              cbSigned: () => {
                setPaymentStep('mint');
                setIsPopupPayment(true);
                setPaymentMethod(chain);
              },
            })
              .then()
              .catch();
          }}
          project={project ? project : projectInfo}
          projectFeeRate={projectFeeRate}
          isWhitelist={isWhitelist}
        />
        <Container>
          <ClientOnly>
            {isLimitMinted ? (
              <MintLayout />
            ) : (
              <ShopLayout
                showReportMsg={showReportMsg}
                setShowReportModal={setShowReportModal}
              />
            )}
          </ClientOnly>
        </Container>
      </section>
      {isPopupPayment && !!ordAddress && (
        <>
          {paymentStep === 'mint' && paymentMethod === PaymentMethod.BTC && (
            <MintBTCGenerativeModal />
          )}
          {paymentStep === 'mint' && paymentMethod === PaymentMethod.ETH && (
            <MintETHModal />
          )}
          {paymentStep === 'mint' && paymentMethod === PaymentMethod.WALLET && (
            <MintWalletModal />
          )}
        </>
      )}
      <GridDebug />
      <ReportModal
        isShow={showReportModal}
        onHideModal={() => setShowReportModal(false)}
        isReported={hasReported}
      />
    </>
  );
};

const GenerativeProjectDetailWrapper: React.FC<{
  isWhitelist?: boolean;
  project?: Project;
}> = ({ isWhitelist = false, project }): React.ReactElement => {
  return (
    <GenerativeProjectDetailProvider>
      <GenerativeProjectDetail isWhitelist={isWhitelist} project={project} />
    </GenerativeProjectDetailProvider>
  );
};

export default GenerativeProjectDetailWrapper;
