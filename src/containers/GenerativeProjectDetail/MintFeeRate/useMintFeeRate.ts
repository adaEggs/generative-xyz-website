import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { isNumeric } from '@utils/string';
import { useContext, useEffect, useState } from 'react';

export type IFeeRateType = 'economy' | 'faster' | 'fastest';

const useMintFeeRate = () => {
  const { projectFeeRate, debounceFetchProjectFeeRate, projectData } =
    useContext(GenerativeProjectDetailContext);

  const [rateType, setRateType] = useState<IFeeRateType>('fastest');
  const [customRate, setCustomRate] = useState<string>('');

  const currentFee = projectFeeRate
    ? isNumeric(customRate) && projectFeeRate.customRate
      ? projectFeeRate.customRate
      : projectFeeRate[rateType]
    : null;

  useEffect(() => {
    debounceFetchProjectFeeRate(projectData || undefined);
  }, []);

  useEffect(() => {
    if (Number(customRate) <= 0) {
      setCustomRate('');
    }
    if (projectData) {
      debounceFetchProjectFeeRate(projectData, Number(customRate));
    }
  }, [customRate]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      debounceFetchProjectFeeRate(projectData || undefined, Number(customRate));
    }, 5000);
    return () => {
      clearInterval(intervalID);
    };
  }, [customRate]);

  const handleChangeRateType = (feeType: IFeeRateType): void => {
    setRateType(feeType);
    setCustomRate('');
  };

  const handleChangeCustomRate = (rate: string): void => {
    setCustomRate(rate);
  };

  return {
    projectFeeRate,
    currentFee,

    customRate,
    handleChangeCustomRate,

    rateType,
    handleChangeRateType,
  };
};

export default useMintFeeRate;
