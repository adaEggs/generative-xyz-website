import s from './styles.module.scss';
import React, { useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { MINT_STEPS } from '@constants/mint-generative';
import { IMintStep } from '@interfaces/mint-generative';
import cs from 'classnames';
import Text from '@components/Text';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';

const StepHeader: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { stepParam } = router.query;
  const { currentStep } = useContext(MintBTCGenerativeContext);

  const handleNavigate = useCallback(
    (step: IMintStep): void => {
      if (currentStep <= step.stepIndex) {
        return;
      }
      router.push(`/mint-btc-generative/${step.path}`, undefined, {
        shallow: false,
      });
    },
    [currentStep]
  );

  return (
    <div className={s.stepHeader}>
      <ul className={s.stepList}>
        {MINT_STEPS.map((step: IMintStep) => (
          <li
            className={cs(s.stepItem, {
              [`${s.stepItem__active}`]: stepParam === step.path,
              [`${s.stepItem__disabled}`]: currentStep < step.stepIndex,
            })}
            key={step.stepIndex}
            onClick={() => handleNavigate(step)}
          >
            <div className={s.stepIndexWrapper}>
              <Text
                as="span"
                size="24"
                color={'black-40-solid'}
                fontWeight={'medium'}
                className={s.stepIndex}
              >
                {step.stepIndex}
              </Text>
            </div>
            <div className={s.stepTitleWrapper}>
              <span className={s.stepActiveDot} />
              <Text
                as={'span'}
                size={'18'}
                color={'black-40-solid'}
                fontWeight={'medium'}
                className={s.stepTitle}
              >
                {step.title}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepHeader;
