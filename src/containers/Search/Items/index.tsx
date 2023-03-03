/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import { getSearchByKeyword, getApiKey } from '@services/search';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectCardOrd } from '@containers/Trade/ProjectCardOrd';
import { ArtistCard } from '@components/ArtistCard';
import CollectionItem from '@components/Collection/Item';

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
    () => getSearchByKeyword(filterArtistParams)
  );
  const { data: resultByTokens } = useSWR(
    getApiKey(getSearchByKeyword, filterTokenParams),
    () => getSearchByKeyword(filterTokenParams)
  );
  const { data: resultByInscriptions } = useSWR(
    getApiKey(getSearchByKeyword, filterInscriptionParams),
    () => getSearchByKeyword(filterInscriptionParams)
  );

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [combineList, setCombineList] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCombineList([
      ...(resultByArtists?.result || []),
      ...(resultByTokens?.result || []),
      ...(resultByInscriptions?.result || []),
    ]);
    setIsLoaded(true);
    setCurrentPage(1);
  }, [keyword]);

  useEffect(() => {
    setCombineList([
      ...(resultByArtists?.result || []),
      ...(resultByTokens?.result || []),
      ...(resultByInscriptions?.result || []),
    ]);
  }, [
    resultByArtists?.result,
    resultByTokens?.result,
    resultByInscriptions?.result,
  ]);

  const fetchCombineList = async () => {
    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      let [isAllowGetArtists, isAllowGetTokens, isAllowGetInscriptions] = [
        false,
        false,
        false,
      ];
      if (nextPage <= (resultByArtists?.totalPage || 1)) {
        filterArtistParams.page = nextPage;
        isAllowGetArtists = true;
      }
      if (nextPage <= (resultByTokens?.totalPage || 1)) {
        filterTokenParams.page = nextPage;
        isAllowGetTokens = true;
      }
      if (nextPage <= (resultByInscriptions?.totalPage || 1)) {
        filterInscriptionParams.page = nextPage;
        isAllowGetInscriptions = true;
      }

      const [
        nextResultByArtists,
        nextResultByTokens,
        nextResultByInscriptions,
      ] = await Promise.all([
        isAllowGetArtists ? getSearchByKeyword(filterArtistParams) : null,
        isAllowGetTokens ? getSearchByKeyword(filterTokenParams) : null,
        isAllowGetInscriptions
          ? getSearchByKeyword(filterInscriptionParams)
          : null,
      ]);
      setCurrentPage(nextPage);
      const newList = combineList.concat([
        ...(nextResultByArtists?.result || []),
        ...(nextResultByTokens?.result || []),
        ...(nextResultByInscriptions?.result || []),
      ]);
      setCombineList(newList);
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
    }
  };

  const debounceFetchCombineList = debounce(fetchCombineList, 300);

  const renderItemByType = useMemo(() => {
    const htmlList = [];
    for (let index = 0; index < combineList.length; index++) {
      const element = combineList[index];
      if (element.objectType === OBJECT_TYPE.ARTIST) {
        htmlList.push(
          <ArtistCard
            profile={element.artist}
            className={cn('col-xs-6 col-md-3', s.items_artist)}
            key={`collection-item-${element?.artist?.objectId}`}
          />
        );
      }
      if (element.objectType === OBJECT_TYPE.INSCRIPTION) {
        htmlList.push(
          <ProjectCardOrd
            className={cn('col-xs-6 col-md-3', s.items_project)}
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
      if (element.objectType === OBJECT_TYPE.TOKEN) {
        htmlList.push(
          <CollectionItem
            className="col-xs-6 col-md-3"
            key={`collection-item-${element?.tokenUri?.tokenID}`}
            data={element?.tokenUri}
          />
        );
      }
    }
    return htmlList;
  }, [combineList.length]);

  return (
    <div className={s.items}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col xs={12}>
            <ProjectListLoading numOfItems={12} />
          </Col>
        ) : (
          <InfiniteScroll
            dataLength={combineList.length}
            next={debounceFetchCombineList}
            className={cn('row', s.items_list)}
            hasMore
            loader={
              isLoading ? (
                <div className={s.items_loader}>
                  <Loading isLoaded={!isLoading} />
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
