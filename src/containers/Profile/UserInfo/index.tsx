import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { IC_EDIT_PROFILE, SOCIAL_ICONS } from '@constants/icons';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { ellipsisCenter } from '@utils/format';
import cn from 'classnames';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import s from './UserInfo.module.scss';
import { toast } from 'react-hot-toast';

export const UserInfo = (): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const { currentUser } = useContext(ProfileContext);
  const router = useRouter();

  return (
    <div className={s.userInfo}>
      <div
        className={cn(
          s.userInfo_cover,
          currentUser?.bgCover ? s.isBg : s.empty
        )}
      >
        {currentUser?.bgCover && (
          <img src={currentUser.bgCover} alt="user-cover" />
        )}
      </div>
      <Container>
        <Row>
          <Col md={8}>
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
                <Row className={s.userInfo_content_wrapper}>
                  <Heading className={s.userInfo_conent_displayName}>
                    {currentUser?.displayName && (
                      <>{currentUser?.displayName}</>
                    )}
                  </Heading>

                  <div className={s.userInfo_content_address}>
                    <div className={s.userInfo_content_btcWallet}>
                      <Text
                        size={'18'}
                        color={'black-06'}
                        fontWeight={'semibold'}
                      >
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
                    <div className={s.userInfo_content_evmWallet}>
                      <Text
                        size={'18'}
                        color={'black-06'}
                        fontWeight={'semibold'}
                      >
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
                        sizes="large"
                        variants={'ghost'}
                        startIcon={<SvgInset svgUrl={IC_EDIT_PROFILE} />}
                        onClick={() => router.push(ROUTE_PATH.EDIT_PROFILE)}
                      >
                        <Text fontWeight="medium" as="span">
                          Edit profile
                        </Text>
                      </ButtonIcon>
                    </div>
                  )}
                </Row>
              }
            </div>
          </Col>
          <Col xs={4}>
            <div className={s.userInfo_socials}>
              <ul className={s.userInfo_socials_list}>
                {currentUser?.profileSocial?.web && (
                  <li className={s.userInfo_socials_item}>
                    <Link
                      target={'_blank'}
                      href={currentUser.profileSocial.web || '#'}
                    >
                      <SvgInset svgUrl={SOCIAL_ICONS.web} />
                    </Link>
                  </li>
                )}

                {currentUser?.profileSocial?.etherScan && (
                  <li className={s.userInfo_socials_item}>
                    <Link
                      target={'_blank'}
                      href={currentUser.profileSocial.etherScan || '#'}
                    >
                      <SvgInset svgUrl={SOCIAL_ICONS.etherScan} />
                    </Link>
                  </li>
                )}

                {currentUser?.profileSocial?.discord && (
                  <li className={s.userInfo_socials_item}>
                    <Link
                      target={'_blank'}
                      href={currentUser.profileSocial.discord}
                    >
                      <SvgInset svgUrl={SOCIAL_ICONS.discrod} />
                    </Link>
                  </li>
                )}

                {currentUser?.profileSocial?.twitter && (
                  <li className={s.userInfo_socials_item}>
                    <Link
                      target={'_blank'}
                      href={currentUser.profileSocial.twitter}
                    >
                      <SvgInset svgUrl={SOCIAL_ICONS.twitter} />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
