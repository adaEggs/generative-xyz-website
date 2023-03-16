import React, { useState } from 'react';
import { CDN_URL } from '@constants/config';
import s from './styles.module.scss';
import Text from '@components/Text';
import { IconVerified } from '@components/IconVerified';
import Image from 'next/image';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import cs from 'classnames';
import Link from 'next/link';
import { ROUTE_PATH } from '@constants/route-path';

export const SocialVerify: React.FC<{
  isTwVerified: boolean;
  width?: number;
  height?: number;
  className?: string;
}> = ({ isTwVerified = false, width = 34, height = 34, className }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
      className={cs(s.whiteList_icon, className)}
    >
      {isTwVerified ? (
        <IconVerified width={width} height={height} />
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
                    Click{' '}
                    <Link className={s.link} href={ROUTE_PATH.DAO}>
                      here
                    </Link>{' '}
                    to get verified by the community!
                  </Text>
                </div>
              </Tooltip>
            }
          >
            <Image
              width={width}
              height={height}
              src={`${CDN_URL}/icons/badge-question.svg`}
              alt={'badge-question'}
            />
          </OverlayTrigger>
        </>
      )}
    </div>
  );
};
