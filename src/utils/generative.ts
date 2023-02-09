import { BITCOIN_PROJECT_FLOOR_ID } from '@constants/generative';

export const checkIsBitcoinProject = (projectID: string) => {
  const id = parseInt(projectID, 10);
  return id > BITCOIN_PROJECT_FLOOR_ID;
};
