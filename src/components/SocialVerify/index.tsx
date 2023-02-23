import React from 'react';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from './styles.module.scss';
import Text from '@components/Text';

export const SocialVerify: React.FC<{
  link: string;
}> = ({ link = '#' }) => {
  return (
    <div className={s.whiteList_icon}>
      <SvgInset size={34} svgUrl={`${CDN_URL}/icons/badge-question.svg`} />
      <div className={`whiteList_content ${s.whiteList_content} tooltip`}>
        <div className={`${s.whiteList_content_inner}`}>
          <div className={'tooltip-arrow'} />
          <div className={'tooltip-inner'}>
            <Text size="14" fontWeight="semibold" color="primary-333">
              Is this you? Ping us at{' '}
              <a href={link} target="_blank" rel="noreferrer">
                @generative_xyz
              </a>{' '}
              to get verified.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
