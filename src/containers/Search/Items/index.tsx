/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
// import cn from 'classnames';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import { getSearchByKeyword, getApiKey } from '@services/search';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectCardOrd } from '@containers/Trade/ProjectCardOrd';
import { ArtistCard } from '@components/ArtistCard';
// import CollectionItem from '@components/Collection/Item';

import { Loading } from '@components/Loading';
import debounce from 'lodash/debounce';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './Items.module.scss';
import { PAYLOAD_DEFAULT, OBJECT_TYPE } from '../constant';

export const Items = (): JSX.Element => {
  const router = useRouter();
  const { keyword = '' } = router.query;

  const filterBase = {
    ...PAYLOAD_DEFAULT,
    keyword,
  };
  const filterArtistParams = {
    ...filterBase,
    type: OBJECT_TYPE.ARTIST,
  };
  const filterTokenParams = {
    ...filterBase,
    type: OBJECT_TYPE.TOKEN,
  };
  const filterInscriptionParams = {
    ...filterBase,
    type: OBJECT_TYPE.INSCRIPTION,
  };

  const { data: resultByArtists } = useSWR(
    getApiKey(getSearchByKeyword, filterArtistParams),
    getSearchByKeyword
  );
  const { data: resultByTokens } = useSWR(
    getApiKey(getSearchByKeyword, filterTokenParams),
    getSearchByKeyword
  );
  const { data: resultByInscriptions } = useSWR(
    getApiKey(getSearchByKeyword, filterInscriptionParams),
    getSearchByKeyword
  );

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataOrd, setdataOrd] = useState<any>([]);
  // const [currentPage,
  //   setCurrentPage] = useState < number > (1);

  useEffect(() => {
    setdataOrd([
      ...(resultByArtists?.result || []),
      ...(resultByTokens?.result || []),
      ...(resultByInscriptions?.result || []),
    ]);
    setIsLoaded(true);
  }, []);

  const fetchDataOrdinals = async () => {
    try {
      // setIsLoaded(true);
      // filterParams.page = currentPage;
      // const {result} = getSearchByKeyword(filterParams);
      // const newList = dataOrd
      //   ?.concat(result);
      // // setdataOrd(newList);
      // setCurrentPage(currentPage + 1);
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
    }
  };

  const debounceFetchDataOrdinals = debounce(fetchDataOrdinals, 300);
  const renderItemByType = useMemo(() => {
    const htmlList = [];
    for (let index = 0; index < dataOrd.length; index++) {
      const element = dataOrd[index];
      if (element.objectType === OBJECT_TYPE.ARTIST) {
        htmlList.push(
          <ArtistCard
            profile={element.artist}
            className="col-3"
            key={`collection-item-${element?.artist?.objectId}`}
          />
        );
      }
      if (element.objectType === OBJECT_TYPE.INSCRIPTION) {
        htmlList.push(
          <ProjectCardOrd
            className="col-3"
            key={element?.inscription?.inscriptionId}
            project={{
              ...element?.inscription,
              inscriptionID: element?.inscription?.inscriptionId,
              inscriptionNumber: element?.inscription?.number,
            }}
            index={index}
          />
        );
      }
      // if (element.objectType === OBJECT_TYPE.TOKEN) {
      //   htmlList.push(
      //     <CollectionItem
      //       className="col-3"
      //       key={`collection-item-${element?.tokenUri?.tokenId}`}
      //       data={element?.tokenUri}
      //     />
      //   );
      // }
    }
    return htmlList;
  }, [dataOrd.length]);

  return (
    <div className={s.items}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col xs={12}>
            <ProjectListLoading numOfItems={12} />
          </Col>
        ) : (
          <InfiniteScroll
            dataLength={dataOrd.length}
            next={debounceFetchDataOrdinals}
            className="row"
            hasMore={true}
            loader={
              isLoading ? (
                <div className="">
                  <Loading isLoaded={isLoading} />
                </div>
              ) : null
            }
            endMessage={<></>}
          >
            {renderItemByType}
          </InfiniteScroll>
        )}
      </Row>
    </div>
  );
};

export default React.memo(Items);
