import { useMemo } from 'react';
import useSWR from 'swr';

import { PAYLOAD_DEFAULT, OBJECT_TYPE } from './constant';
import { getSearchByKeyword, getApiKey } from '@services/search';

export interface SearchApi {
  keyword: string | string[];
}

const useSearchApi = ({ keyword }: SearchApi) => {
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
  const filterCollectionParams = {
    ...PAYLOAD_DEFAULT,
    keyword,
    type: OBJECT_TYPE.PROJECT,
  };

  const { data: resultByCollection } = useSWR(
    getApiKey(getSearchByKeyword, filterCollectionParams),
    () => getSearchByKeyword(filterCollectionParams),
    {
      keepPreviousData: true,
    }
  );

  const { data: resultByArtists } = useSWR(
    getApiKey(getSearchByKeyword, filterArtistParams),
    () => getSearchByKeyword(filterArtistParams),
    {
      keepPreviousData: true,
    }
  );
  const { data: resultByTokens } = useSWR(
    getApiKey(getSearchByKeyword, filterTokenParams),
    () => getSearchByKeyword(filterTokenParams),
    {
      keepPreviousData: true,
    }
  );
  const { data: resultByInscriptions } = useSWR(
    getApiKey(getSearchByKeyword, filterInscriptionParams),
    () => getSearchByKeyword(filterInscriptionParams),
    {
      keepPreviousData: true,
    }
  );

  const searchTotal = useMemo(() => {
    return (
      (resultByCollection?.total || 0) +
      (resultByArtists?.total || 0) +
      (resultByTokens?.total || 0) +
      (resultByInscriptions?.total || 0)
    );
  }, [
    keyword,
    resultByCollection?.total,
    resultByArtists?.total,
    resultByTokens?.total,
    resultByInscriptions?.total,
  ]);

  const totalCollection = useMemo(() => {
    return resultByCollection?.total || 0;
  }, [keyword, resultByCollection?.total]);

  const totalArtist = useMemo(() => {
    return resultByArtists?.total || 0;
  }, [keyword, resultByArtists?.total]);

  const totalToken = useMemo(() => {
    return resultByTokens?.total || 0;
  }, [keyword, resultByTokens?.total]);

  const totalInscription = useMemo(() => {
    return resultByInscriptions?.total || 0;
  }, [keyword, resultByInscriptions?.total]);

  return {
    searchTotal,
    totalCollection,
    totalArtist,
    totalToken,
    totalInscription,
    resultByCollection,
    resultByArtists,
    resultByTokens,
    resultByInscriptions,
  };
};

export default useSearchApi;
