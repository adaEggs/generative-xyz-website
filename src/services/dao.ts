import { LogLevel } from '@enums/log-level';
import {
  ICreateProposalPayload,
  ICreateProposalResponse,
  IGetProposalByOnChainIDResponse,
  IGetProposalListParams,
  IGetProposalListResponse,
  IGetVoteListParams,
  IGetVoteListResponse,
  IUpdateProposalIDPayload,
  IUpdateProposalIDResponse,
} from '@interfaces/api/dao';
import { get, post, put } from '@services/http-client';
import log from '@utils/logger';
import queryString from 'query-string';

const LOG_PREFIX = 'DAOService';

const API_PATH = '/dao';

export const getProposalList = async (
  query: IGetProposalListParams
): Promise<IGetProposalListResponse> => {
  try {
    const qs = '?' + queryString.stringify(query);
    const res = await get<IGetProposalListResponse>(
      `${API_PATH}/proposals${qs}`
    );

    return res;
  } catch (err: unknown) {
    log('failed to get proposal list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get proposal list');
  }
};

export const getProposalByOnChainID = async (
  proposalID: string
): Promise<IGetProposalByOnChainIDResponse> => {
  try {
    const res = await get<IGetProposalByOnChainIDResponse>(
      `${API_PATH}/proposals/${proposalID}`
    );

    return res;
  } catch (err: unknown) {
    log('failed to get proposal by on-chain id', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get proposal by on-chain id');
  }
};

export const updateProposalID = async (
  payload: IUpdateProposalIDPayload
): Promise<IUpdateProposalIDResponse> => {
  try {
    const { id, proposalID } = payload;
    const res = await put<unknown, IUpdateProposalIDResponse>(
      `${API_PATH}/proposals/${id}/${proposalID}`,
      {}
    );
    return res;
  } catch (err: unknown) {
    log('failed to update proposal id', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to to update proposal id');
  }
};

export const createProposal = async (
  payload: ICreateProposalPayload
): Promise<ICreateProposalResponse> => {
  try {
    const res = await post<ICreateProposalPayload, ICreateProposalResponse>(
      `${API_PATH}/proposals`,
      payload
    );

    return res;
  } catch (err: unknown) {
    log('failed to create proposal', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to create proposal');
  }
};

export const getVoteList = async (
  query: IGetVoteListParams
): Promise<IGetVoteListResponse> => {
  try {
    const { proposalID, ...params } = query;
    const qs = '?' + queryString.stringify(params);
    const res = await get<IGetVoteListResponse>(
      `${API_PATH}/proposals/${proposalID}/votes${qs}`
    );

    return res;
  } catch (err: unknown) {
    log('failed to get proposal list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get proposal list');
  }
};
