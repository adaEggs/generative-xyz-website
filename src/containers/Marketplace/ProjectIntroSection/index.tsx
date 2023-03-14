import ReportModal from './ReportModal';
import s from './styles.module.scss';
import {
  ProjectLayoutContext,
  ProjectLayoutProvider,
} from '@contexts/project-layout-context';
import LayoutForMintout from './LayoutForMintout';
import { useContext } from 'react';
import { Project } from '@interfaces/project';
import { PaymentMethod } from '@enums/mint-generative';
import LayoutForMinting from '@containers/Marketplace/ProjectIntroSection/LayoutForMinting';
import { IProjectMintFeeRate } from '@interfaces/api/project';

type Props = {
  project?: Project | null;
  projectFeeRate?: IProjectMintFeeRate | null;
  openMintBTCModal: (s: PaymentMethod) => void;
  isWhitelist?: boolean;
};

const ProjectIntroSection = () => {
  const { showReportModal, setShowReportModal, hasReported, isLimitMinted } =
    useContext(ProjectLayoutContext);

  return (
    <div
      className={`${s.wrapper} ${
        !isLimitMinted ? `${s.minted} container` : ''
      }`}
    >
      {!isLimitMinted ? <LayoutForMintout /> : <LayoutForMinting />}
      <ReportModal
        isShow={showReportModal}
        onHideModal={() => setShowReportModal(false)}
        isReported={hasReported}
      />
    </div>
  );
};

const ProjectIntroSectionWrap = ({
  project,
  projectFeeRate,
  openMintBTCModal,
  isWhitelist = false,
}: Props): JSX.Element => {
  return (
    <ProjectLayoutProvider
      project={project}
      projectFeeRate={projectFeeRate}
      openMintBTCModal={openMintBTCModal}
      isWhitelist={isWhitelist}
    >
      <ProjectIntroSection />
    </ProjectLayoutProvider>
  );
};

export default ProjectIntroSectionWrap;
