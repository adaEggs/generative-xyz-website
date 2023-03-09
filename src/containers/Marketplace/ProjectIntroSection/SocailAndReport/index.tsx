import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import { TwitterShareButton } from 'react-share';
import { ROUTE_PATH } from '@constants/route-path';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Text from '@components/Text';
import { useContext } from 'react';
import { ProjectLayoutContext } from '@contexts/project-layout-context';

export const SocialAndReport = (): JSX.Element => {
  const { project, showReportMsg, setShowReportModal, origin } =
    useContext(ProjectLayoutContext);
  return (
    <div className={s.shares_wrapper}>
      <ul className={s.shares}>
        <li>
          <div>
            <TwitterShareButton
              url={`${origin}${ROUTE_PATH.GENERATIVE}/${project?.tokenID}`}
              title={''}
              hashtags={[]}
            >
              <ButtonIcon
                sizes="small"
                variants="outline-small"
                className={s.projectBtn}
                startIcon={
                  <SvgInset
                    size={14}
                    svgUrl={`${CDN_URL}/icons/ic-twitter-20x20.svg`}
                  />
                }
              >
                Share
              </ButtonIcon>
            </TwitterShareButton>
          </div>
        </li>
        <li>
          <div className={s.reportBtn} onClick={() => setShowReportModal(true)}>
            <SvgInset size={14} svgUrl={`${CDN_URL}/icons/ic-flag.svg`} />
            <Text as="span" size="14" fontWeight="medium">
              Report
            </Text>
          </div>
        </li>
      </ul>

      {showReportMsg && (
        <div className={s.reportMsg}>
          <SvgInset size={18} svgUrl={`${CDN_URL}/icons/ic-bell-ringing.svg`} />
          <Text size={'14'} fontWeight="bold">
            This collection is currently under review.
          </Text>
        </div>
      )}
    </div>
  );
};
