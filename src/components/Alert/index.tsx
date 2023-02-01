import React, { ReactNode } from 'react';
import cs from 'classnames';
import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import Image from 'next/image';
import { Toast } from 'react-hot-toast';
import Text from '@components/Text';
import { Stack } from 'react-bootstrap';

type AlertProps = {
  message: ReactNode;
  className?: string;
  info: Toast;
};

const Alert = ({ message, className, info }: AlertProps) => {
  const { type } = info;
  return (
    <div className={cs(s.alert, s[`${type}`], className)}>
      {type === 'success' ? (
        <Image
          src={`${CDN_URL}/icons/ic-check.svg`}
          alt={'success icon'}
          width={20}
          height={20}
        />
      ) : (
        <Image
          src={`${CDN_URL}/icons/ic-danger.svg`}
          alt={'danger icon'}
          width={20}
          height={20}
        />
      )}
      <Stack direction="horizontal" gap={2}>
        {type === 'error' && (
          <Text size="14" fontWeight="bold">
            Error:
          </Text>
        )}
        <Text size="14" fontWeight="medium">
          {message}
        </Text>
      </Stack>
    </div>
  );
};

export default Alert;
