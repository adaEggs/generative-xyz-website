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
import { TwitterShareButton } from 'react-share';
import s from './styles.module.scss';

const MintSuccess = () => {
  const router = useRouter();
  const { mintedProjectID } = useContext(MintBTCGenerativeContext);
  const user = useAppSelector(getUserSelector);
  const mintedProjectUrl = `/generative/${mintedProjectID}`;

  const handleGoToProjectDetailPage = (): void => {
    if (mintedProjectID) {
      router.push(mintedProjectUrl);
    }
  };

  const handleOpenLink = (): void => {
    window.open(SOCIALS.discord);
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
        </div>
        <Button
          sizes="large"
          variants="outline-small"
          disabled={!mintedProjectID}
          onClick={handleGoToProjectDetailPage}
        >
          Go to project page
        </Button>
      </div>
    </div>
  );
};

export default MintSuccess;
