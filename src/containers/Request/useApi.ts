import useSWRInfinite, { BareFetcher } from 'swr';

import { getApiKey } from '@utils/swr';

export interface RequestApi {
  cursor?: string | string[];
  limit: number;
  sort?: string;
  fetcher: BareFetcher;
}

export const LIMIT = 20;

const useRequestApi = ({ cursor, limit, fetcher }: RequestApi) => {
  const params = { cursor, limit };
  const { data, isLoading } = useSWRInfinite(
    getApiKey(fetcher, params),
    () => fetcher(params),
    {
      keepPreviousData: true,
    }
  );

  return { data, isLoading };
};

export default useRequestApi;
