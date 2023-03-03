import { LogLevel } from '@enums/log-level';
import {
  CollectedNFTStatus,
  ICollectedNFTItem,
  ICollectedNFTItemDetail,
  IGetCollectedNFTInsciptionResp,
  IGetCollectedNFTsResp,
  IGetMintingCollectedNFTResp,
  IGetProfileResponse,
  IUpdateProfilePayload,
  IUpdateProfileResponse,
  IWithdrawRefereeRewardPayload,
} from '@interfaces/api/profile';
import { IGetProjectItemsResponse } from '@interfaces/api/project';
import { IGetProfileTokensResponse } from '@interfaces/api/token-uri';
import { get, put, del, post } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'ProfileService';

const API_PATH = '/profile';

export const getProfile = async (): Promise<IGetProfileResponse> => {
  try {
    return await get<IGetProfileResponse>(`${API_PATH}`);
  } catch (err: unknown) {
    log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile');
  }
};

export const getProfileByWallet = async ({
  walletAddress,
}: {
  walletAddress: string;
}): Promise<IGetProfileResponse> => {
  try {
    return await get<IGetProfileResponse>(
      `${API_PATH}/wallet/${walletAddress}`
    );
  } catch (err: unknown) {
    log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile');
  }
};

export const getProfileProjects =
  async (): Promise<IGetProjectItemsResponse> => {
    try {
      return await get<IGetProjectItemsResponse>(`${API_PATH}/projects`);
    } catch (err: unknown) {
      log('failed to get profile projects', LogLevel.ERROR, LOG_PREFIX);
      throw Error('Failed to get profile projects');
    }
  };

export const getProfileProjectsByWallet = async ({
  walletAddress,
  limit = 10,
  page = 1,
}: {
  walletAddress: string;
  limit?: number;
  page?: number;
}): Promise<IGetProjectItemsResponse> => {
  try {
    return await get<IGetProjectItemsResponse>(
      `${API_PATH}/wallet/${walletAddress}/projects?limit=${limit}&page=${page}`
    );
  } catch (err: unknown) {
    log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile');
  }
};

export const getProfileTokens = async ({
  walletAddress,
  limit = 10,
  page = 1,
}: {
  walletAddress: string;
  limit?: number;
  page?: number;
}): Promise<IGetProfileTokensResponse> => {
  try {
    return await get<IGetProfileTokensResponse>(
      `${API_PATH}/wallet/${walletAddress}/nfts?limit=${limit}&page=${page}`
    );
  } catch (err: unknown) {
    log('failed to get profile nfts', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile nfts');
  }
};

export const updateProfile = async (
  payload: IUpdateProfilePayload
): Promise<IUpdateProfileResponse> => {
  try {
    const res = await put<IUpdateProfilePayload, IUpdateProfileResponse>(
      API_PATH,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to update profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error();
  }
};

// Collected tab

export const getCollectedNFTs = async (
  btcAddress: string
): Promise<ICollectedNFTItem[]> => {
  try {
    const res = await get<IGetCollectedNFTsResp>(
      `/wallet/wallet-info?address=${btcAddress}`
    );
    if (res && res.inscriptions && res.inscriptions.length > 0) {
      const tasks = res.inscriptions.map(
        (data: IGetCollectedNFTInsciptionResp) => {
          return {
            id: data.id || '',
            inscriptionID: data.inscription_id,
            inscriptionNumber: `${data.number}`,
            contentType: data.content_type,
            name: '',
            projectName: data.project_name,
            projectID: data.project_id,
            image: data.thumbnail,
            isCancel: false,
            status: CollectedNFTStatus.Success,
            statusText: '',
          } as ICollectedNFTItem;
        }
      );
      const data = await Promise.all(tasks);
      return data;
    }
    return [];
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    return [];
  }
};

export const getMintingCollectedNFTs = async (
  btcAddress: string
): Promise<ICollectedNFTItem[]> => {
  try {
    const res = await get<Array<IGetMintingCollectedNFTResp>>(
      `/wallet/mint-status?address=${btcAddress}`
    );
    let tasks: ICollectedNFTItem[] = [];
    if (res && res.length > 0) {
      tasks = res.map((item: IGetMintingCollectedNFTResp) => {
        return {
          id: item.id,
          image: item.fileURI || item.projectImage,
          name: '',
          projectName: item.projectName,
          projectID: item.projectID,
          inscriptionID: item.inscriptionID || '',
          isCancel: item.isCancel || false,
          status: CollectedNFTStatus.Minting,
          statusText: item.status,
          receiveAddress: item.receiveAddress,
        };
      });
    }
    return tasks;
  } catch (err: unknown) {
    log('failed to get minting collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    return [];
  }
};

export const getDetailMintingCollectedNFT = async (
  mintID: string
): Promise<ICollectedNFTItemDetail> => {
  try {
    const res = await get<IGetMintingCollectedNFTResp>(
      `/mint-nft-btc/receive-address/${mintID}`
    );
    return {
      id: res.id || '',
      image: res.fileURI || res.projectImage,
      name: '',
      projectName: res.projectName,
      projectID: res.projectID,
      inscriptionID: res.inscriptionID || '',
      isCancel: res.isCancel || false,
      status: CollectedNFTStatus.Minting,
      statusText: res.status,
      receiveAddress: res.receiveAddress,
    };
  } catch (err: unknown) {
    log('failed to get detail collected NFT', LogLevel.ERROR, LOG_PREFIX);
    throw Error();
  }
};

export const cancelMintingCollectedNFT = async (
  mintID: string
): Promise<boolean> => {
  try {
    await del(`/mint-nft-btc/receive-address/${mintID}`);
    return true;
  } catch (err: unknown) {
    log('failed to get detail collected NFT', LogLevel.ERROR, LOG_PREFIX);
    throw Error();
  }
};

// Referral tab

export const withdrawRewardEarned = async (
  payload: IWithdrawRefereeRewardPayload
): Promise<void> => {
  // try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await post<IWithdrawRefereeRewardPayload, any>(
    `${API_PATH}/withdraw`,
    payload
  );
  return res;
  // } catch (err: unknown) {
  //   log('failed to withdraw', LogLevel.ERROR, LOG_PREFIX);
  //   throw Error();
  // }
};
