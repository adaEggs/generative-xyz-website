import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import {
  ellipsisCenter,
  formatAddress,
  formatBTCPrice,
  formatWebDomain,
} from '@utils/format';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import s from './UserInfo.module.scss';
import { toast } from 'react-hot-toast';
import { SocialVerify } from '@components/SocialVerify';
import { SOCIALS } from '@constants/common';
import { DEFAULT_USER_AVATAR } from '@constants/common';
import { IC_EDIT_PROFILE } from '@constants/icons';
import ButtonSendBTC from '@containers/Profile/ButtonSendBTC';
import { Col, Row } from 'react-bootstrap';
import useBitcoin from '@bitcoin/useBitcoin';
import ButtonReceiver from '@containers/Profile/ButtonReceiver';

export const UserInfo = ({
  toggleModal,
}: {
  toggleModal: () => void;
}): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const { currentUser, isLoadingHistory, history } = useContext(ProfileContext);
  const router = useRouter();
  const { satoshiAmount } = useBitcoin();

  const isTwVerified = useMemo(() => {
    return currentUser?.profileSocial?.twitterVerified || false;
  }, [currentUser?.profileSocial]);

  return (
    <div className={s.userInfo}>
      <div className={s.userInfo_content}>
        <div className={s.userInfo_content_avatar}>
          <Image
            src={currentUser?.avatar ? currentUser.avatar : DEFAULT_USER_AVATAR}
            alt={currentUser?.displayName || ''}
            width={100}
            height={100}
          />
        </div>
        {
          <div className={s.userInfo_content_wrapper}>
            <div className={s.userInfo_content_wrapper_info}>
              <div className={s.userInfo_content_wrapper_info_inner}>
                <Heading
                  as={'h4'}
                  title={
                    currentUser?.displayName ||
                    formatAddress(currentUser?.walletAddress)
                  }
                  className={s.userInfo_content_wrapper_info_name}
                >
                  {currentUser?.displayName ||
                    formatAddress(currentUser?.walletAddress)}
                </Heading>
                <div className={s.userInfo_content_wrapper_info_icon}>
                  <SocialVerify
                    isTwVerified={isTwVerified}
                    link={SOCIALS.twitter}
                  />
                </div>
              </div>
            </div>
            <Row
              style={{
                rowGap: '12px',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Col xl="6" className={s.userInfo_content_address}>
                {currentUser?.walletAddressBtcTaproot && (
                  <>
                    <Text
                      color="black-40-solid"
                      size="12"
                      className={s.userInfo_content_title}
                    >
                      MY WALLET
                    </Text>
                    <div
                      className={`${s.userInfo_content_btcWallet} ${s.userInfo_content_wallet}`}
                    >
                      <SvgInset
                        size={24}
                        svgUrl={`${CDN_URL}/icons/Frame%20427319538.svg`}
                      />
                      <Text size={'20'} fontWeight="medium">
                        {ellipsisCenter({
                          str: currentUser?.walletAddressBtcTaproot || '',
                          limit: 6,
                        })}
                      </Text>
                      <SvgInset
                        onClick={() => {
                          copy(currentUser?.walletAddressBtcTaproot || '');
                          toast.remove();
                          toast.success('Copied');
                        }}
                        className={s.iconCopy}
                        size={18}
                        svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                      />
                    </div>
                  </>
                )}
              </Col>
              <Col xl={{ order: 1, span: 6 }}>
                <Text
                  color="black-40-solid"
                  size="12"
                  className={s.userInfo_content_title}
                >
                  Total balance
                </Text>
                <div
                  className={`${s.userInfo_content_btcWallet} ${s.userInfo_content_wallet}`}
                >
                  <Text size={'20'} fontWeight="medium">
                    {formatBTCPrice(satoshiAmount.toString())} BTC
                  </Text>
                  {!isLoadingHistory && !!history && !!history.length && (
                    <div
                      className={s.userInfo_content_wrapper_icHistory}
                      onClick={toggleModal}
                    >
                      <SvgInset
                        size={20}
                        className={s.iconHistory}
                        svgUrl={`${CDN_URL}/icons/ic-history.svg`}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <div className={s.userInfo_content_ctas}>
              <ButtonReceiver />
              <ButtonSendBTC />
            </div>
            <div className={s.creator_social}>
              {currentUser?.profileSocial?.twitter && (
                <div className={`${s.creator_social_item}`}>
                  <div className={s.creator_social_item_inner}>
                    <SvgInset
                      className={`${s.creator_social_twitter}`}
                      size={24}
                      svgUrl={`${CDN_URL}/icons/Twitter.svg`}
                    />
                    <Text size={'18'}>
                      <Link
                        href={currentUser?.profileSocial?.twitter || ''}
                        target="_blank"
                      >
                        @{currentUser?.profileSocial?.twitter.split('/').pop()}
                      </Link>
                    </Text>
                  </div>
                </div>
              )}
              {currentUser?.profileSocial?.web && (
                <div className={`${s.creator_social_item}`}>
                  <div className={s.creator_social_item_inner}>
                    <SvgInset
                      className={`${s.creator_social_twitter}`}
                      size={26}
                      svgUrl={`${CDN_URL}/icons/link-copy.svg`}
                    />
                    <Text size={'18'}>
                      <Link
                        href={currentUser?.profileSocial?.web || ''}
                        target="_blank"
                      >
                        {formatWebDomain(currentUser?.profileSocial?.web || '')}
                      </Link>
                    </Text>
                  </div>
                </div>
              )}
            </div>

            {currentUser?.bio && (
              <Text size={'18'} fontWeight="regular" className={s.bio}>
                {currentUser?.bio}
              </Text>
            )}

            {currentUser?.id === user?.id && (
              <div className={s.editProfile}>
                <ButtonIcon
                  sizes="large"
                  variants={'ghost'}
                  onClick={() => router.push(ROUTE_PATH.EDIT_PROFILE)}
                  startIcon={
                    <>
                      <SvgInset size={20} svgUrl={IC_EDIT_PROFILE} />
                    </>
                  }
                >
                  <Text fontWeight="medium" as="span">
                    Edit Profile
                  </Text>
                </ButtonIcon>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
};
