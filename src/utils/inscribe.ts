import { MINT_TRANSFER_FEE } from '@constants/config';
import { InscribeMintFeeRate } from '@enums/inscribe';

export const calculateMintFee = (
  feeRate: InscribeMintFeeRate,
  fileSizeByte: number,
  transferFee = MINT_TRANSFER_FEE
): number => {
  const minSize = 1024 * 4;
  if (fileSizeByte < minSize) {
    fileSizeByte = minSize;
  }
  return (feeRate * fileSizeByte) / 4 + transferFee;
};

export const calculateNetworkFee = (
  feeRate: InscribeMintFeeRate,
  fileBase64: string,
  transferFee = MINT_TRANSFER_FEE
): number => {
  const fileSizeByte = new Blob([fileBase64]).size;
  return (feeRate * fileSizeByte) / 4 + transferFee;
};
