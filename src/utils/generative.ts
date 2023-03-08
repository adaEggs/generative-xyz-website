import { BITCOIN_PROJECT_FLOOR_ID } from '@constants/generative';
import { formatAddress } from '@utils/format';
import { Project } from '@interfaces/project';

export const checkIsBitcoinProject = (projectID: string) => {
  const id = parseInt(projectID, 10);
  return id > BITCOIN_PROJECT_FLOOR_ID;
};

export const filterCreatorName = (project: Project): string => {
  const creatorName =
    project?.creatorProfile?.displayName ||
    formatAddress(
      project?.creatorProfile?.walletAddressBtcTaproot ||
        project?.creatorProfile?.walletAddress ||
        ''
    );

  if (
    creatorName.toLowerCase() === 'authentic user' ||
    creatorName.toLowerCase() === 'unverified user'
  ) {
    return `Ordinal ${
      project?.name ||
      formatAddress(
        project?.creatorProfile?.walletAddressBtcTaproot ||
          project?.creatorProfile?.walletAddress ||
          ''
      )
    }`;
  }
  return creatorName;
};
