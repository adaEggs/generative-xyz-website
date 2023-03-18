import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { formatAddressDisplayName, formatWebDomain } from '@utils/format';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import s from './UserInfo.module.scss';
import { toast } from 'react-hot-toast';
import { SocialVerify } from '@components/SocialVerify';
import { DEFAULT_USER_AVATAR } from '@constants/common';
import { IC_EDIT_PROFILE } from '@constants/icons';
import ButtonReceiver from '@containers/Profile/ButtonReceiver';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AssetsContext } from '@contexts/assets-context';
import { SeeMore } from '@components/SeeMore';
import ButtonVerifyMe from '../ButtonVerifyMe';

interface IProps {
  toggle: () => void;
}

export const UserInfo = ({ toggle }: IProps): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const { isLoadedHistory } = useContext(AssetsContext);
  const { currentUser } = useContext(ProfileContext);
  const router = useRouter();
  const { walletAddress } = router.query as { walletAddress: string };

  const isOwner = currentUser?.id === user?.id;
  const showHistory = isLoadedHistory && isOwner;

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
                    formatAddressDisplayName(
                      currentUser?.walletAddressBtcTaproot,
                      6
                    ) ||
                    formatAddressDisplayName(walletAddress)
                  }
                  className={s.userInfo_content_wrapper_info_name}
                >
                  {currentUser?.displayName ||
                    formatAddressDisplayName(
                      currentUser?.walletAddressBtcTaproot,
                      6
                    ) ||
                    formatAddressDisplayName(walletAddress)}
                </Heading>
                <div className={s.userInfo_content_wrapper_info_icon}>
                  <SocialVerify isTwVerified={isTwVerified} />
                </div>
                {isOwner && currentUser?.canCreateProposal && (
                  <ButtonVerifyMe />
                )}
              </div>
            </div>
            <div className={s.userInfo_content_address}>
              {currentUser?.walletAddressBtcTaproot && (
                <div
                  className={`${s.userInfo_content_btcWallet} ${s.userInfo_content_wallet}`}
                >
                  <SvgInset
                    size={24}
                    svgUrl={`${CDN_URL}/icons/Frame%20427319538.svg`}
                  />
                  <Text size={'18'} fontWeight={'regular'}>
                    {formatAddressDisplayName(
                      currentUser?.walletAddressBtcTaproot || '',
                      6
                    )}
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
                  {showHistory && (
                    <SvgInset
                      onClick={toggle}
                      size={18}
                      svgUrl={`${CDN_URL}/icons/ic-history.svg`}
                      className={s.iconHistory}
                    />
                  )}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 100, hide: 200 }}
                    overlay={
                      <Tooltip id="play-tooltip">
                        <div className={s.wallet_tooltip}>
                          <Text fontWeight="semibold" color="primary-333">
                            What is Generative wallet?
                          </Text>
                          <Text
                            size="14"
                            fontWeight="medium"
                            color="primary-333"
                          >
                            It’s your own BTC wallet built on your Metamask that
                            can receive and send inscriptions and BTC. Only you
                            can sign on Metamask to process a transaction. The
                            derived key is not saved in the browser’s local
                            storage.
                          </Text>
                        </div>
                      </Tooltip>
                    }
                  >
                    <div>
                      <SvgInset
                        size={20}
                        svgUrl={`${CDN_URL}/icons/ic-question-circle.svg`}
                        className={s.iconQuestion}
                      />
                    </div>
                  </OverlayTrigger>
                </div>
              )}
            </div>
            {isOwner && (
              <div className={s.userInfo_content_ctas}>
                <ButtonReceiver
                  sizes="medium"
                  className={s.userInfo_content_ctas_receiver}
                />
              </div>
            )}
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
                        {currentUser?.profileSocial?.twitter.split('/').pop()}
                      </Link>
                    </Text>
                  </div>
                </div>
              )}
              {currentUser?.profileSocial?.web && (
                <div className={`${s.creator_social_item}`}>
                  <div className={s.creator_social_item_inner}>
                    <SvgInset
                      // className={`${s.creator_social_twitter}`}
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
              <div className={`${s.creator_social_item}`}>
                <div
                  className={`${s.creator_social_item_inner} ${s.creator_bio}`}
                >
                  <SvgInset
                    size={16}
                    svgUrl={`${CDN_URL}/icons/ic-info.svg`}
                    className={s.info_icon}
                  />
                  <SeeMore render={Boolean(currentUser.bio)}>
                    {currentUser?.bio}
                  </SeeMore>
                  {/*<Text size={'18'} fontWeight="regular" className={s.bio}>*/}

                  {/*</Text>*/}
                </div>
              </div>
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
                    Settings
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
