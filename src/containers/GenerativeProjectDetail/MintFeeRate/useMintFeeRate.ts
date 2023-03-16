import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { useContext, useEffect, useState } from 'react';

export type IFeeRateType = 'economy' | 'faster' | 'fastest' | 'customRate';

const useMintFeeRate = () => {
  const { projectFeeRate, debounceFetchProjectFeeRate, projectData } =
    useContext(GenerativeProjectDetailContext);

  const [customFeeRate, setCustomFeeRate] = useState<string>('');

  const [currentFeeRateType, setCurrentFeeRateType] =
    useState<IFeeRateType>('fastest');
  const currentFeeRate = projectFeeRate
    ? projectFeeRate[currentFeeRateType]
    : null;

  useEffect(() => {
    const intervalID = setInterval(() => {
      debounceFetchProjectFeeRate(
        projectData || undefined,
        Number(customFeeRate) > (projectFeeRate?.economy.rate || 0)
          ? Number(customFeeRate)
          : undefined
      );
    }, 10000);
    return () => {
      clearInterval(intervalID);
    };
  }, [customFeeRate]);

  const handleChangeRateType = (feeType: IFeeRateType): void => {
    setCurrentFeeRateType(feeType);
    setCustomFeeRate('');
  };

  const handleChangeCustomRate = (rate: string): void => {
    setCustomFeeRate(rate);
    if (Number(rate) < (projectFeeRate?.economy.rate || 0)) {
      setCustomFeeRate('');
    }
    debounceFetchProjectFeeRate(
      projectData || undefined,
      Number(rate) > (projectFeeRate?.economy.rate || 0)
        ? Number(rate)
        : undefined
    );
  };

  return {
    projectFeeRate,
    currentFeeRate,

    customFeeRate,
    handleChangeCustomRate,

    currentFeeRateType,
    handleChangeRateType,
  };
};

export default useMintFeeRate;
