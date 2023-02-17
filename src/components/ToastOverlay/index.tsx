import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import Image from 'next/image';
import React from 'react';
import { Stack } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';

const ToastOverlay = () => {
  return (
    <Toaster
      containerStyle={{
        top: 120,
        left: 20,
        bottom: 20,
        right: 20,
      }}
      toastOptions={{
        success: {
          className: 'toast-success',
          style: {
            padding: '0',
            border: '1px solid #00AA6C',
            color: '#00AA6C',
            background: '#FFFFFF',
          },
          icon: (
            <Image
              src={`${CDN_URL}/icons/ic-check.svg`}
              alt={'success icon'}
              width={36}
              height={36}
            />
          ),
        },
        error: {
          className: 'toast-error',
          style: {
            border: '1px solid #FF4747',
            color: '#FF4747',
            background: '#FFFFFF',
            justifyContent: 'center',
          },
          icon: (
            <Stack direction="horizontal" gap={3} className="items-center">
              <Image
                src={`${CDN_URL}/icons/ic-danger.svg`}
                alt={'danger icon'}
                width={20}
                height={20}
              />
              <Text size="14" fontWeight="bold">
                Error:{' '}
              </Text>
            </Stack>
          ),
        },
        style: {
          padding: '10px 32px',
          boxShadow: '8px 7px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '2px',
          minWidth: '500px',
          width: '100%',
          justifyContent: 'center',
        },
      }}
    />
  );
};

export default ToastOverlay;
