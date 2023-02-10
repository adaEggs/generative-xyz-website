export const validateWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateBTCWalletAddress = (_address: string): boolean => {
  return true;
  // return /^[13][a-zA-Z0-9]{26,33}$/.test(address);
};
