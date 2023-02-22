import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { ellipsisCenter, formatAddress } from '@utils/format';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import s from './UserInfo.module.scss';
import { toast } from 'react-hot-toast';
import { SocialVerify } from '@components/SocialVerify';
import { SOCIALS } from '@constants/common';

export const UserInfo = (): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const { currentUser } = useContext(ProfileContext);
  const router = useRouter();

  const isTwVerified = useMemo(() => {
    return currentUser?.profileSocial?.twitterVerified || false;
  }, [currentUser?.profileSocial]);

  return (
    <div className={s.userInfo}>
      <div className={s.userInfo_content}>
        <div className={s.userInfo_content_avatar}>
          <Image
            src={
              currentUser?.avatar
                ? currentUser.avatar
                : `${CDN_URL}/images/default-avatar.jpeg`
            }
            alt={currentUser?.displayName || ''}
            width={100}
            height={100}
          />
        </div>
        {
          <div className={s.userInfo_content_wrapper}>
            <div className={s.userInfo_content_wrapper_info}>
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
              {currentUser?.profileSocial?.twitter && (
                <div className={s.creator_social}>
                  <span className={s.creator_divider}></span>
                  <div
                    className={`${s.creator_social_item} ${
                      isTwVerified ? s.isVerified : ''
                    }`}
                  >
                    <div className={s.creator_social_item_inner}>
                      <SvgInset
                        className={`${s.creator_social_twitter}`}
                        size={20}
                        svgUrl={`${CDN_URL}/icons/ic-twitter-20x20.svg`}
                      />
                      <Text size={'18'} color="black-60">
                        <Link
                          href={currentUser?.profileSocial?.twitter || ''}
                          target="_blank"
                        >
                          @
                          {currentUser?.profileSocial?.twitter.split('/').pop()}
                        </Link>
                      </Text>
                    </div>
                    {!isTwVerified && (
                      <>
                        <SocialVerify social="Twitter" link={SOCIALS.twitter} />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={s.userInfo_content_address}>
              {currentUser?.walletAddressBtcTaproot && (
                <div className={s.userInfo_content_btcWallet}>
                  <Text size={'18'} color={'black-06'} fontWeight={'semibold'}>
                    <span
                      style={{
                        color: 'orange',
                        fontSize: 24,
                        marginRight: 8,
                      }}
                    >
                      ₿
                    </span>{' '}
                    {ellipsisCenter({
                      str: currentUser?.walletAddressBtcTaproot || '',
                      limit: 10,
                    })}
                  </Text>
                  <SvgInset
                    onClick={() => {
                      copy(currentUser?.walletAddressBtcTaproot || '');
                      toast.remove();
                      toast.success('Copied');
                    }}
                    className={s.iconCopy}
                    size={20}
                    svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                  />
                </div>
              )}
              <div className={s.userInfo_content_evmWallet}>
                <Text size={'18'} color={'black-06'} fontWeight={'semibold'}>
                  <span
                    style={{
                      color: '#9AA9DD',
                      fontSize: 24,
                      marginRight: 8,
                    }}
                  >
                    Ξ
                  </span>{' '}
                  {ellipsisCenter({
                    str: currentUser?.walletAddress || '',
                    limit: 10,
                  })}
                </Text>
                <SvgInset
                  onClick={() => {
                    copy(currentUser?.walletAddress || '');
                    toast.remove();
                    toast.success('Copied');
                  }}
                  className={s.iconCopy}
                  size={20}
                  svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                />
              </div>
            </div>
            {currentUser?.id === user?.id && (
              <div className={s.editProfile}>
                <ButtonIcon
                  sizes="medium"
                  variants={'outline'}
                  onClick={() => router.push(ROUTE_PATH.EDIT_PROFILE)}
                >
                  <Text fontWeight="medium" as="span">
                    Edit Profile
                  </Text>
                </ButtonIcon>
              </div>
            )}

            {currentUser?.bio && (
              <Text size={'18'} fontWeight="regular" className={s.bio}>
                “{currentUser?.bio}”
              </Text>
            )}
          </div>
        }
      </div>

      {/*<Container>*/}
      {/*  <Row>*/}
      {/*    <Col md={8}>*/}
      {/*      */}
      {/*    </Col>*/}
      {/*    <Col xs={4}>*/}
      {/*      <div className={s.userInfo_socials}>*/}
      {/*        <ul className={s.userInfo_socials_list}>*/}
      {/*          {currentUser?.profileSocial?.web && (*/}
      {/*            <li className={s.userInfo_socials_item}>*/}
      {/*              <Link*/}
      {/*                target={'_blank'}*/}
      {/*                href={currentUser.profileSocial.web || '#'}*/}
      {/*              >*/}
      {/*                <SvgInset svgUrl={SOCIAL_ICONS.web} />*/}
      {/*              </Link>*/}
      {/*            </li>*/}
      {/*          )}*/}

      {/*          {currentUser?.profileSocial?.etherScan && (*/}
      {/*            <li className={s.userInfo_socials_item}>*/}
      {/*              <Link*/}
      {/*                target={'_blank'}*/}
      {/*                href={currentUser.profileSocial.etherScan || '#'}*/}
      {/*              >*/}
      {/*                <SvgInset svgUrl={SOCIAL_ICONS.etherScan} />*/}
      {/*              </Link>*/}
      {/*            </li>*/}
      {/*          )}*/}

      {/*          {currentUser?.profileSocial?.discord && (*/}
      {/*            <li className={s.userInfo_socials_item}>*/}
      {/*              <Link*/}
      {/*                target={'_blank'}*/}
      {/*                href={currentUser.profileSocial.discord}*/}
      {/*              >*/}
      {/*                <SvgInset svgUrl={SOCIAL_ICONS.discrod} />*/}
      {/*              </Link>*/}
      {/*            </li>*/}
      {/*          )}*/}

      {/*          {currentUser?.profileSocial?.twitter && (*/}
      {/*            <li className={s.userInfo_socials_item}>*/}
      {/*              <Link*/}
      {/*                target={'_blank'}*/}
      {/*                href={currentUser.profileSocial.twitter}*/}
      {/*              >*/}
      {/*                <SvgInset svgUrl={SOCIAL_ICONS.twitter} />*/}
      {/*              </Link>*/}
      {/*            </li>*/}
      {/*          )}*/}
      {/*        </ul>*/}
      {/*      </div>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</Container>*/}
    </div>
  );
};
