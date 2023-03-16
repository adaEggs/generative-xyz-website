import { useContext, useState } from 'react';
import { FeeRateName } from '@interfaces/api/bitcoin';
import { AssetsContext } from '@contexts/assets-context';
import { isNumeric } from '@utils/string';

const useFeeRate = () => {
  const { feeRate: RATE } = useContext(AssetsContext);
  const FEE_RATE = RATE || {
    fastestFee: 15,
    halfHourFee: 10,
    hourFee: 5,
  };
  const [selectedRate, setRate] = useState<FeeRateName>(FeeRateName.fastestFee);
  const [customRate, setCustomRate] = useState<string>('');

  const handleChangeFee = (fee: FeeRateName): void => {
    setRate(fee);
    setCustomRate('');
  };

  const handleChangeCustomRate = (rate: string): void => {
    setCustomRate(rate);
  };

  const currentRate =
    customRate && isNumeric(customRate)
      ? Number(customRate)
      : FEE_RATE[selectedRate];

  return {
    selectedRate,
    allRate: FEE_RATE,
    customRate,
    currentRate,
    handleChangeFee,
    handleChangeCustomRate,
  };
};

export default useFeeRate;
