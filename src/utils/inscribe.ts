import { MINT_TRANSFER_FEE } from '@constants/config';
import { InscribeMintFeeRate } from '@enums/inscribe';

export const calculateMintFee = (
  feeRate: InscribeMintFeeRate,
  fileSizeByte: number,
  transferFee = MINT_TRANSFER_FEE
): number => {
  return (feeRate * fileSizeByte) / 4 + transferFee;
};
