import CollectionList from '@components/Collection/List';
import { Loading } from '@components/Loading';
import Text from '@components/Text';
import ToogleSwitch from '@components/Toggle';
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
import TokenTopFilter from './TokenTopFilter';
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

  const [listItems, setListItems] = useState<Token[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [filterBuyNow, setFilterBuyNow] = useState(false);
  const [searchToken, setSearchToken] = useState('');

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
        } else {
          setIsLoaded(false);
        }
        const res = await getProjectItems(
          {
            contractAddress: projectInfo.genNFTAddr,
          },
          {
            limit: FETCH_NUM,
            page: page,
            sort,
            keyword: searchToken,
          }
        );
        if (res.result) {
          if (page === 1) {
            setListItems(res.result);
          } else {
            listItems && setListItems([...listItems, ...res.result]);
          }
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
  }, [projectInfo, page, sort, searchToken]);

  return (
    <section>
      <Container>
        <ProjectIntroSection project={projectInfo} />
        <ClientOnly>
          <Tabs className={styles.tabs} defaultActiveKey="outputs">
            <Tab tabClassName={styles.tab} eventKey="outputs" title="Outputs">
              <div className={styles.filterWrapper}>
                <div className={styles.filter_buy}>
                  <Text size="18" fontWeight="medium">
                    Buy now
                  </Text>
                  <ToogleSwitch
                    onChange={() => setFilterBuyNow(!filterBuyNow)}
                  />
                </div>
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
                      filterBuyNow={filterBuyNow}
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
