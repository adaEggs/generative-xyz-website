import { LogLevel } from '@enums/log-level';
import {
  ICreateProposalPayload,
  ICreateProposalResponse,
} from '@interfaces/api/dao';
import { post } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'DAOService';

const API_PATH = '/dao';

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
