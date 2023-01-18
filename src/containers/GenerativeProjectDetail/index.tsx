import CollectionList from '@components/Collection/List';
import { Loading } from '@components/Loading';
import { TriggerLoad } from '@components/TriggerLoader';
import ClientOnly from '@components/Utils/ClientOnly';
import ProjectIntroSection from '@containers/Marketplace/ProjectIntroSection';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import React, { useContext } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import TokenTopFilter from './TokenTopFilter';
import styles from './styles.module.scss';

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
  } = useContext(GenerativeProjectDetailContext);

  return (
    <section>
      <Container>
        <ProjectIntroSection project={projectInfo} />
        <ClientOnly>
          <Tabs className={styles.tabs} defaultActiveKey="outputs">
            <Tab tabClassName={styles.tab} eventKey="outputs" title="Outputs">
              <div className={styles.filterWrapper}>
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
                <div className="postion-relative">
                  <div
                    style={
                      !isLoaded
                        ? {
                            width: '100%',
                            minHeight: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            zIndex: '1',
                            position: 'absolute',
                            top: '0',
                          }
                        : {
                            visibility: 'hidden',
                            pointerEvents: 'none',
                          }
                    }
                  >
                    <Loading
                      isLoaded={isLoaded}
                      className={styles.projectDetail_loading}
                    />
                  </div>
                </div>

                {listItems && (
                  <div className={styles.tokenList}>
                    <CollectionList
                      projectInfo={projectInfo}
                      listData={listItems}
                    />
                    <TriggerLoad
                      len={listItems.length || 0}
                      total={total || 0}
                      isLoaded={isNextPageLoaded}
                      onEnter={handleFetchNextPage}
                    />
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </ClientOnly>
      </Container>
    </section>
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
