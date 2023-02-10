import { validate } from 'bitcoin-address-validation';

export const validateWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateBTCWalletAddress = (_address: string): boolean => {
  return validate(_address);
};
