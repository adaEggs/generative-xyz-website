import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import { SocialAndReport } from '@containers/Marketplace/ProjectIntroSection/SocailAndReport';
import { RenderProjectAttrs } from '@containers/Marketplace/ProjectIntroSection/ProjectAttrs';

export const RenderMetaContent = (): JSX.Element => {
  return (
    <>
      <div className={s.project_info}>
        <RenderProjectAttrs />
      </div>
      <SocialAndReport />
    </>
  );
};
