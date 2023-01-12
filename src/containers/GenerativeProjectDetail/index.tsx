import CollectionList from '@components/Collection/List';
import { Loading } from '@components/Loading';
import { TriggerLoad } from '@components/TriggerLoader';
import ClientOnly from '@components/Utils/ClientOnly';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import ProjectIntroSection from '@containers/Marketplace/ProjectIntroSection';
import { LogLevel } from '@enums/log-level';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { setProjectCurrent } from '@redux/project/action';
import { getProjectDetail, getProjectItems } from '@services/project';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';

const LOG_PREFIX = 'GenerativeProjectDetail';

const FETCH_NUM = 20;

const GenerativeProjectDetail: React.FC = (): React.ReactElement => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isNextPageLoaded, setIsNextPageLoaded] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { projectID } = router.query as { projectID: string };
  const [projectInfo, setProjectInfo] = useState<Project | undefined>();

  const [listItems, setListItems] = useState<Token[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchProjectDetail = async (): Promise<void> => {
    if (projectID) {
      try {
        const data = await getProjectDetail({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          projectID,
        });
        dispatch(setProjectCurrent(data));
        setProjectInfo(data);
      } catch (_: unknown) {
        log('failed to fetch project detail data', LogLevel.Error, LOG_PREFIX);
      }
    }
  };

  const fetchProjectItems = async (): Promise<void> => {
    if (projectInfo?.genNFTAddr) {
      try {
        if (page > 1) {
          setIsNextPageLoaded(false);
        }
        const res = await getProjectItems(
          {
            contractAddress: projectInfo.genNFTAddr,
          },
          {
            limit: FETCH_NUM,
            page: page,
          }
        );
        if (res.result) {
          setListItems([...listItems, ...res.result]);
          setTotal(res.total);
        }
        setIsLoaded(true);
        setIsNextPageLoaded(true);
      } catch (_: unknown) {
        log('failed to fetch project items data', LogLevel.Error, LOG_PREFIX);
      }
    }
  };

  const handleFetchNextPage = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [projectID]);

  useEffect(() => {
    fetchProjectItems();
  }, [projectInfo, page]);

  return (
    <section>
      <Container>
        <ProjectIntroSection project={projectInfo} />
        <ClientOnly>
          <Tabs className={styles.tabs} defaultActiveKey="items">
            <Tab tabClassName={styles.tab} eventKey="items" title="Items">
              <div className={styles.filterWrapper}>
                {/* <TokenTopFilter
                  keyword=""
                  sort=""
                  onKeyWordChange={() => {
                    //
                  }}
                  onSortChange={() => {
                    //
                  }}
                /> */}
              </div>
              <div className={styles.tokenListWrapper}>
                <Loading isLoaded={isLoaded} />
                {isLoaded && (
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

export default GenerativeProjectDetail;
