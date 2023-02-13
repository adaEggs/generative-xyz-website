import { useMemo } from 'react';

import Heading from '@components/Heading';
import Skeleton from '@components/Skeleton';
import Text from '@components/Text';
import cs from 'classnames';
import s from './styles.module.scss';

type TProgressBar = {
  current?: number;
  total?: number;
  size?: 'regular' | 'small';
  className?: string;
  isHideBar?: boolean;
};

const ProgressBar = ({
  current,
  total,
  size = 'regular',
  className,
  isHideBar = false,
}: TProgressBar) => {
  const calcMintProgress = useMemo(() => {
    if (!current || !total) return 0;
    return (current / total) * 100;
  }, [total, current]);

  return (
    <div className={cs(s.wrapper, className)}>
      <div className={s.stats}>
        {size === 'regular' && (
          <>
            <Heading as="h6" fontWeight="medium">
              {total ? (
                `${current}/${total}`
              ) : (
                <Skeleton width={60} height={34} />
              )}
              <Text color="black-60" as="span">
                {' '}
                minted
              </Text>
            </Heading>
          </>
        )}
        {size === 'small' && (
          <Text size="18" fontWeight="medium">
            {`${current}/${total}`}
            <Text size="12" fontWeight="regular" as="span" color="black-60">
              &nbsp; minted
            </Text>
          </Text>
        )}
      </div>
      {!isHideBar && (
        <div className={s.progressWrapper}>
          <div
            className={s.progressBar}
            style={{
              width: `${calcMintProgress}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
