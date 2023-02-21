import React from 'react';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from './styles.module.scss';
import { SOCIALS } from '@constants/common';
import Text from '@components/Text';

export const SocialVerify: React.FC<{
  social: string;
}> = ({ social = '' }) => {
  return (
    <div className={s.whiteList_icon}>
      <SvgInset size={20} svgUrl={`${CDN_URL}/icons/ic-question-circle.svg`} />
      <div className={`whiteList_content ${s.whiteList_content} tooltip`}>
        <div className={`${s.whiteList_content_inner}`}>
          <div className={'tooltip-arrow'} />
          <div className={'tooltip-inner'}>
            <Text size="14" fontWeight="semibold" color="primary-333">
              Please send a direct message to{' '}
              <a href={SOCIALS.discord} target="_blank" rel="noreferrer">
                @generative_xyz
              </a>{' '}
              to verify your {social}.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
