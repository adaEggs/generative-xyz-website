import { BITCOIN_PROJECT_FLOOR_ID } from '@constants/generative';
import { formatAddressDisplayName } from '@utils/format';
import { Project } from '@interfaces/project';
import { wordCase } from '@utils/common';

export const checkIsBitcoinProject = (projectID: string) => {
  const id = parseInt(projectID, 10);
  return id > BITCOIN_PROJECT_FLOOR_ID;
};

export const filterCreatorName = (project: Project): string => {
  const creatorName =
    project?.creatorProfile?.displayName ||
    formatAddressDisplayName(
      project?.creatorProfile?.walletAddressBtcTaproot ||
        project?.creatorProfile?.walletAddress ||
        ''
    );

  if (creatorName.toLowerCase() === 'authentic user') {
    return wordCase(
      `${project?.name.indexOf('Ordinal') === -1 ? 'Ordinal' : ''} ${
        project?.name ||
        formatAddressDisplayName(
          project?.creatorProfile?.walletAddressBtcTaproot ||
            project?.creatorProfile?.walletAddress ||
            ''
        )
      }`
    );
  } else if (creatorName.toLowerCase() === 'unverified user') {
    return (
      project?.name ||
      formatAddressDisplayName(
        project?.creatorProfile?.walletAddressBtcTaproot ||
          project?.creatorProfile?.walletAddress ||
          ''
      )
    );
  }
  return creatorName;
};
