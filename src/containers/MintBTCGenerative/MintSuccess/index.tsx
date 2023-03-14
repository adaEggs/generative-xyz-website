import Button from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import { SOCIALS } from '@constants/common';
import { CDN_URL } from '@constants/config';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { TwitterShareButton } from 'react-share';
import s from './styles.module.scss';
import { sendAAEvent } from '@services/aa-tracking';
import { BTC_PROJECT } from '@constants/tracking-event-name';

const MintSuccess = () => {
  const router = useRouter();
  const { mintedProject } = useContext(MintBTCGenerativeContext);
  const user = useAppSelector(getUserSelector);
  const mintedProjectUrl = `/generative/${mintedProject?.tokenID}`;

  const handleGoToProjectDetailPage = (): void => {
    if (mintedProject?.tokenID) {
      router.push(mintedProjectUrl);
    }
  };

  const handleOpenLink = (): void => {
    window.open(SOCIALS.discord);
    sendAAEvent({
      eventName: BTC_PROJECT.SHARE_REFERRAL_LINK,
      data: {
        project_id: mintedProject?.tokenID,
        project_name: mintedProject?.name,
        project_image: mintedProject?.image,
        referrer_id: user?.id,
        referrer_name: user?.displayName,
        referrer_address: user?.walletAddress,
        referrer_taproot_address: user?.walletAddressBtcTaproot,
        type: 'discord_share',
      },
    });
  };

  const handleCopyLink = (url: string): void => {
    navigator.clipboard.writeText(url);
    toast.remove();
    toast.success('Copied');
    sendAAEvent({
      eventName: BTC_PROJECT.SHARE_REFERRAL_LINK,
      data: {
        project_id: mintedProject?.tokenID,
        project_name: mintedProject?.name,
        project_image: mintedProject?.image,
        referrer_id: user?.id,
        referrer_name: user?.displayName,
        referrer_address: user?.walletAddress,
        referrer_taproot_address: user?.walletAddressBtcTaproot,
        type: 'refer_share',
      },
    });
  };

  return (
    <div className={s.mintSuccess}>
      <h2 className={s.title}> Introduce your art to the world!</h2>
      <Heading as="h5">
        Promote yourself to communities and invite other artists to join.
      </Heading>
      <div className={s.actionWrapper}>
        <div className={s.social_btns}>
          <TwitterShareButton
            url={`${location.origin}${mintedProjectUrl}?referral_code=${user?.id}`}
            className={s.shareBtn}
          >
            <Button
              sizes="large"
              variants="outline-small"
              className={s.twitter_btn}
              onClick={() => {
                sendAAEvent({
                  eventName: BTC_PROJECT.SHARE_REFERRAL_LINK,
                  data: {
                    project_id: mintedProject?.tokenID,
                    project_name: mintedProject?.name,
                    project_image: mintedProject?.image,
                    referrer_id: user?.id,
                    referrer_name: user?.displayName,
                    referrer_address: user?.walletAddress,
                    referrer_taproot_address: user?.walletAddressBtcTaproot,
                    type: 'twitter_share',
                  },
                });
              }}
              startIcon={
                <SvgInset
                  size={20}
                  svgUrl={`${CDN_URL}/icons/ic-twitter-outline.svg`}
                />
              }
            >
              Share
            </Button>
          </TwitterShareButton>
          <div className={s.shareBtn}>
            <Button
              sizes="large"
              variants="outline-small"
              onClick={handleOpenLink}
              className={s.discord_btn}
              startIcon={
                <SvgInset
                  className={s.icon}
                  svgUrl={`${CDN_URL}/icons/ic-discord-outline.svg`}
                />
              }
            >
              Share
            </Button>
          </div>
          <div className={s.shareBtn}>
            <Button
              sizes="large"
              onClick={() =>
                handleCopyLink(
                  `${location.origin}${mintedProjectUrl}?referral_code=${user?.id}`
                )
              }
            >
              Refer your friends
            </Button>
          </div>
        </div>
        <Button
          sizes="large"
          variants="outline-small"
          disabled={!mintedProject?.tokenID}
          onClick={handleGoToProjectDetailPage}
        >
          Go to project page
        </Button>
      </div>
    </div>
  );
};

export default MintSuccess;
