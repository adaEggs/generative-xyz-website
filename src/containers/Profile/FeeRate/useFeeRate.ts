import { useContext, useState } from 'react';
import { FeeRateName } from '@interfaces/api/bitcoin';
import { ProfileContext } from '@contexts/profile-context';

const useFeeRate = () => {
  const { feeRate: RATE } = useContext(ProfileContext);
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

  return {
    selectedRate,
    allRate: FEE_RATE,
    customRate,
    handleChangeFee,
    handleChangeCustomRate,
  };
};

export default useFeeRate;
