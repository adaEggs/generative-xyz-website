import React, { useState } from 'react';
import { CDN_URL } from '@constants/config';
import s from './styles.module.scss';
import Text from '@components/Text';
import { IconVerified } from '@components/IconVerified';
import Image from 'next/image';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const SocialVerify: React.FC<{
  link: string;
  isTwVerified: boolean;
}> = ({ link = '#', isTwVerified = false }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
      className={s.whiteList_icon}
    >
      {isTwVerified ? (
        <IconVerified />
      ) : (
        <>
          <OverlayTrigger
            placement="bottom"
            show={show}
            delay={{ show: 0, hide: 200 }}
            overlay={
              <Tooltip id="btc-fee-tooltip">
                <div
                  onMouseEnter={() => {
                    setShow(true);
                  }}
                  onMouseLeave={() => {
                    setShow(false);
                  }}
                >
                  <Text
                    className={s.whiteList_icon_tooltip}
                    size="14"
                    fontWeight="semibold"
                    color="primary-333"
                  >
                    Want to get verified? Ping us at{' '}
                    <a href={link} target="_blank" rel="noreferrer">
                      @generative_xyz.
                    </a>
                  </Text>
                </div>
              </Tooltip>
            }
          >
            <Image
              width={34}
              height={34}
              src={`${CDN_URL}/icons/badge-question.svg`}
              alt={'badge-question'}
            />
          </OverlayTrigger>
        </>
      )}
    </div>
  );
};
