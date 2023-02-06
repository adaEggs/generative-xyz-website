import { LogLevel } from '@enums/log-level';
import {
  ICreateProposalPayload,
  ICreateProposalResponse,
  IGetProposalListParams,
} from '@interfaces/api/dao';
import { post, get } from '@services/http-client';
import log from '@utils/logger';
import queryString from 'query-string';

const LOG_PREFIX = 'DAOService';

const API_PATH = '/dao';

export const getProposalList = async (
  query: IGetProposalListParams
): Promise<Array<unknown>> => {
  try {
    const qs = '?' + queryString.stringify(query);
    const res = await get<Array<unknown>>(`${API_PATH}/proposals${qs}`);

    return res;
  } catch (err: unknown) {
    log('failed to get proposal list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get proposal list');
  }
};

export const createProposal = async (
  payload: ICreateProposalPayload
): Promise<ICreateProposalResponse> => {
  try {
    const res = await post<ICreateProposalPayload, ICreateProposalResponse>(
      API_PATH,
      payload
    );

    return res;
  } catch (err: unknown) {
    log('failed to create proposal', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to create proposal');
  }
};
