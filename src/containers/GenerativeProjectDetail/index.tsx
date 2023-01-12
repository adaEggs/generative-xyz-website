import CollectionList from '@components/Collection/List';
import { Loading } from '@components/Loading';
import ClientOnly from '@components/Utils/ClientOnly';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import {
  SEO_DESCRIPTION,
  SEO_IMAGE,
  SEO_TITLE,
} from '@constants/seo-default-info';
import ProjectIntroSection from '@containers/Marketplace/ProjectIntroSection';
import { LogLevel } from '@enums/log-level';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { setProjectCurrent } from '@redux/project/action';
import { getProjectDetail, getProjectItems } from '@services/project';
import log from '@utils/logger';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import TokenTopFilter from './TokenTopFilter';
import styles from './styles.module.scss';

const LOG_PREFIX = 'GenerativeProjectDetail';

const GenerativeProjectDetail: React.FC = (): React.ReactElement => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { projectID } = router.query as { projectID: string };
  const [projectInfo, setProjectInfo] = useState<Project | undefined>();

  const [listItems, setListItems] = useState<Token[]>([]);

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
        const res = await getProjectItems(
          {
            contractAddress: projectInfo.genNFTAddr,
          },
          {
            limit: 20,
            page: 1,
          }
        );
        res.result && setListItems(res.result);
        setIsLoaded(true);
      } catch (_: unknown) {
        log('failed to fetch project items data', LogLevel.Error, LOG_PREFIX);
      }
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [projectID]);

  useEffect(() => {
    fetchProjectItems();
  }, [projectInfo]);

  return (
    <>
      <Head>
        <meta property="og:title" content={projectInfo?.name ?? SEO_TITLE} />
        <meta
          name="og:description"
          content={projectInfo?.desc ?? SEO_DESCRIPTION}
        />
        <meta name="og:image" content={projectInfo?.image ?? SEO_IMAGE} />
        <meta
          property="twitter:title"
          content={projectInfo?.name ?? SEO_TITLE}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content={projectInfo?.desc ?? SEO_DESCRIPTION}
        />
        <meta name="twitter:image" content={projectInfo?.image ?? SEO_IMAGE} />
      </Head>
      <section>
        <Container>
          <ProjectIntroSection project={projectInfo} />
          <ClientOnly>
            <Tabs className={styles.tabs} defaultActiveKey="items">
              <Tab tabClassName={styles.tab} eventKey="items" title="Items">
                <div className={styles.filterWrapper}>
                  <TokenTopFilter
                    keyword=""
                    sort=""
                    onKeyWordChange={() => {
                      //
                    }}
                    onSortChange={() => {
                      //
                    }}
                  />
                </div>
                <div className={styles.tokenListWrapper}>
                  <Loading isLoaded={isLoaded} />
                  {isLoaded && (
                    <div className={styles.tokenList}>
                      <CollectionList
                        projectInfo={projectInfo}
                        listData={listItems}
                      />
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </ClientOnly>
        </Container>
      </section>
    </>
  );
};

export default GenerativeProjectDetail;
