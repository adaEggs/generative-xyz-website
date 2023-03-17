import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { isNumeric } from '@utils/string';
import { useContext, useEffect, useState } from 'react';

export type IFeeRateType = 'economy' | 'faster' | 'fastest' | 'customRate';

const useMintFeeRate = () => {
  const { projectFeeRate, debounceFetchProjectFeeRate, projectData } =
    useContext(GenerativeProjectDetailContext);

  const [rateType, setRateType] = useState<IFeeRateType>('fastest');
  const [customRate, setCustomRate] = useState<string>('');

  const minFeeRate = 3;

  const currentFee = projectFeeRate
    ? rateType === 'customRate' &&
      isNumeric(customRate) &&
      projectFeeRate.customRate
      ? projectFeeRate.customRate
      : projectFeeRate[rateType]
    : null;

  useEffect(() => {
    const intervalID = setInterval(() => {
      debounceFetchProjectFeeRate(projectData || undefined, Number(customRate));
    }, 10000);
    return () => {
      clearInterval(intervalID);
    };
  }, [customRate]);

  const handleChangeRateType = (feeType: IFeeRateType): void => {
    setRateType(feeType);
  };

  const handleChangeCustomRate = (rate: string): void => {
    setCustomRate(rate);
    if (Number(rate) < minFeeRate) {
      setCustomRate('');
    }
    if (projectData) {
      debounceFetchProjectFeeRate(
        projectData,
        Number(rate) < minFeeRate ? 0 : Number(rate)
      );
    }
  };

  return {
    minFeeRate,

    projectFeeRate,
    currentFee,

    customRate,
    handleChangeCustomRate,

    rateType,
    handleChangeRateType,
  };
};

export default useMintFeeRate;
