import { LogLevel } from '@enums/log-level';
import {
  IGetMintReceiverAddressPayload,
  IGetMintReceiverAddressResp,
} from '@interfaces/api/mint';
import { post } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'MintService';

const API_PATH = '/mint-nft-btc';

export const generateMintReceiverAddress = async (
  payload: IGetMintReceiverAddressPayload
): Promise<IGetMintReceiverAddressResp> => {
  try {
    const res = await post<
      IGetMintReceiverAddressPayload,
      IGetMintReceiverAddressResp
    >(`${API_PATH}/receive-address`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to generate receiver address', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};
