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
  const [selectedRate, setRate] = useState<FeeRateName>(
    FeeRateName.halfHourFee
  );

  const handleChangeFee = (fee: FeeRateName): void => {
    setRate(fee);
  };

  return {
    selectedRate,
    allRate: FEE_RATE,
    handleChangeFee,
  };
};

export default useFeeRate;
