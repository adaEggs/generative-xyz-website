import CollectionList from '@components/Collection/List';
import { TriggerLoad } from '@components/TriggerLoader';
import ClientOnly from '@components/Utils/ClientOnly';
import MintBTCGenerativeModal from '@containers/GenerativeProjectDetail/MintBTCGenerativeModal';
import MintETHModal from '@containers/GenerativeProjectDetail/MintEthModal';
import ProjectIntroSection from '@containers/Marketplace/ProjectIntroSection';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import { Project } from '@interfaces/project';
import cs from 'classnames';
import React, { useContext } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import MintWalletModal from './MintWalletModal';
import TokenTopFilter from './TokenTopFilter';
import styles from './styles.module.scss';
import { PaymentMethod } from '@enums/mint-generative';

const GenerativeProjectDetail: React.FC<{
  isWhitelist?: boolean;
  project?: Project;
}> = ({ isWhitelist, project }): React.ReactElement => {
  const {
    projectData: projectInfo,
    listItems,
    handleFetchNextPage,
    setSearchToken,
    setSort,
    total,
    isLoaded,
    isNextPageLoaded,
    isBitcoinProject,
  } = useContext(GenerativeProjectDetailContext);

  const {
    setIsPopupPayment,
    isPopupPayment,
    paymentStep,
    paymentMethod,
    setPaymentMethod,
    setPaymentStep,
  } = useContext(BitcoinProjectContext);

  return (
    <>
      <section>
        <Container>
          <ProjectIntroSection
            openMintBTCModal={(chain: PaymentMethod) => {
              setPaymentStep('mint');
              setIsPopupPayment(true);
              setPaymentMethod(chain);
            }}
            project={project ? project : projectInfo}
            isWhitelist={isWhitelist}
          />

          <ClientOnly>
            <Tabs className={styles.tabs} defaultActiveKey="outputs">
              <Tab tabClassName={styles.tab} eventKey="outputs" title="Outputs">
                {!isBitcoinProject && !isWhitelist && (
                  <div className={cs(styles.filterWrapper)}>
                    <TokenTopFilter
                      keyword=""
                      sort=""
                      onKeyWordChange={setSearchToken}
                      onSortChange={value => {
                        setSort(value);
                      }}
                      placeholderSearch="Search by token id..."
                      className={styles.filter_sort}
                    />
                  </div>
                )}
                <div className={styles.tokenListWrapper}>
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
      {isPopupPayment && (
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
