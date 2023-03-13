import CollectionList from '@components/Collection/List';
import { TriggerLoad } from '@components/TriggerLoader';
import ClientOnly from '@components/Utils/ClientOnly';
import MintBTCGenerativeModal from '@containers/GenerativeProjectDetail/MintBTCGenerativeModalV3';
import MintETHModal from '@containers/GenerativeProjectDetail/MintEthModal/CollectingV3';
import ProjectIntroSection from '@containers/Marketplace/ProjectIntroSection';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import { PaymentMethod } from '@enums/mint-generative';
import { Project } from '@interfaces/project';
import cs from 'classnames';
import React, { useContext } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';

import useBTCSignOrd from '@hooks/useBTCSignOrd';
import MintWalletModal from './MintWalletModal';
import TokenTopFilter from './TokenTopFilter';
import styles from './styles.module.scss';
import { GridDebug } from '@components/Grid/grid';

const GenerativeProjectDetail: React.FC<{
  isWhitelist?: boolean;
  project?: Project;
}> = ({ isWhitelist, project }): React.ReactElement => {
  const {
    projectData: projectInfo,
    listItems,
    handleFetchNextPage,
    total,
    isLoaded,
    isNextPageLoaded,
  } = useContext(GenerativeProjectDetailContext);

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
        <Container>
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
            isWhitelist={isWhitelist}
          />

          <ClientOnly>
            <Tabs className={styles.tabs} defaultActiveKey="outputs">
              <Tab tabClassName={styles.tab} eventKey="outputs" title="Outputs">
                {projectInfo?.traitStat && projectInfo.traitStat.length > 0 && (
                  <div className={cs(styles.filterWrapper)} id="PROJECT_LIST">
                    <TokenTopFilter className={styles.filter_sort} />
                  </div>
                )}
                <div className={styles.tokenListWrapper} id="PROJECT_LIST">
                  <div className={styles.tokenList}>
                    <CollectionList
                      projectInfo={projectInfo}
                      listData={listItems}
                      isLoaded={isLoaded}
                    />
                    <TriggerLoad
                      len={listItems?.length || 0}
                      total={total || 0}
                      isLoaded={isNextPageLoaded}
                      onEnter={handleFetchNextPage}
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
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
