import CollectionList from '@components/Collection/List';
import { TriggerLoad } from '@components/TriggerLoader';
import ClientOnly from '@components/Utils/ClientOnly';
import ProjectIntroSection from '@containers/Marketplace/ProjectIntroSection';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import React, { useContext } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import cs from 'classnames';
import styles from './styles.module.scss';
import TokenTopFilter from './TokenTopFilter';
import MintBTCGenerativeModal from './MintBTCGenerativeModal';

// const LOG_PREFIX = 'GenerativeProjectDetail';

const GenerativeProjectDetail: React.FC = (): React.ReactElement => {
  const {
    projectData: projectInfo,
    listItems,
    handleFetchNextPage,
    setSearchToken,
    setSort,
    total,
    isLoaded,
    isNextPageLoaded,
    showMintBTCModal,
    isShowMintBTCModal,
  } = useContext(GenerativeProjectDetailContext);

  return (
    <>
      <section>
        <Container>
          <ProjectIntroSection
            openMintBTCModal={showMintBTCModal}
            project={projectInfo}
          />
          <ClientOnly>
            <Tabs className={styles.tabs} defaultActiveKey="outputs">
              <Tab tabClassName={styles.tab} eventKey="outputs" title="Outputs">
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
      {isShowMintBTCModal && <MintBTCGenerativeModal />}
    </>
  );
};

const GenerativeProjectDetailWrapper: React.FC = (): React.ReactElement => {
  return (
    <GenerativeProjectDetailProvider>
      <GenerativeProjectDetail />
    </GenerativeProjectDetailProvider>
  );
};

export default GenerativeProjectDetailWrapper;
