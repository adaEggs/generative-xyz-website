import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import { SocialVerify } from '@components/SocialVerify';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { IC_EDIT_PROJECT } from '@constants/icons';
import { ROUTE_PATH } from '@constants/route-path';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { filterCreatorName } from '@utils/generative';
import cs from 'classnames';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectStats } from '../ProjectStats';
import s from './../styles.module.scss';

const LayoutForMintout = () => {
  const { project, isHasBtcWallet, creatorAddress, isTwVerified, isEdit } =
    useContext(ProjectLayoutContext);
  const router = useRouter();

  return (
    <div className={s.projectInfo}>
      <div className={`${s.projectInfo_inner}`}>
        <div className={`${s.projectInfo_left}`}>
          <div className={`${s.projectInfo_content}`}>
            <div className={s.info_inner}>
              {/* <div
                className={`${s.projectCard_thumb} ${
                  thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
                }`}
              >
                <div className={s.projectCard_thumb_inner}>
                  <img
                    onError={onThumbError}
                    src={thumb}
                    alt={project?.name}
                    loading={'lazy'}
                    ref={imgRef}
                    onLoad={handleOnImgLoaded}
                  />
                </div>
              </div> */}
              <div className={s.projectName}>
                <div className={s.projectName_creator}>
                  {isHasBtcWallet ? (
                    <Link
                      href={`${ROUTE_PATH.PROFILE}/${creatorAddress}`}
                      className={cs(
                        s.creator_info,
                        !project?.creatorProfile?.walletAddressBtcTaproot &&
                          !project?.creatorProfile?.walletAddress &&
                          'pointer-none'
                      )}
                    >
                      <Heading
                        className={s.projectHeader_creator}
                        as="h6"
                        fontWeight="medium"
                      >
                        {project && filterCreatorName(project)}
                      </Heading>
                    </Link>
                  ) : (
                    <div
                      className={cs(
                        s.creator_info,
                        !project?.creatorProfile?.walletAddressBtcTaproot &&
                          'pointer-none'
                      )}
                    >
                      <Heading
                        className={s.projectHeader_creator}
                        as="h6"
                        fontWeight="medium"
                      >
                        {project && filterCreatorName(project)}
                      </Heading>
                    </div>
                  )}

                  <SocialVerify
                    isTwVerified={isTwVerified}
                    width={18}
                    height={18}
                    className={s.small}
                  />
                </div>
                <div className={s.creator_info_name}>
                  <Heading as="h6" fontWeight="medium" className="font-italic">
                    {project?.name}
                  </Heading>
                  {isEdit && (
                    <div className={s.projectHeader_btn}>
                      <ButtonIcon
                        sizes="xsmall"
                        variants={'ghost'}
                        endIcon={<SvgInset svgUrl={IC_EDIT_PROJECT} />}
                        onClick={() =>
                          router.push(
                            `${ROUTE_PATH.GENERATIVE_EDIT}/${project?.tokenID}`
                          )
                        }
                      >
                        <Text fontWeight="medium" as="span">
                          Edit
                        </Text>
                      </ButtonIcon>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${s.projectInfo_right}`}>
          <div className={s.projectInfo_right_inner}>{<ProjectStats />}</div>
        </div>
      </div>
    </div>
  );
};

export default LayoutForMintout;
