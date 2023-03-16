import LayoutForMinting from '@containers/Marketplace/ProjectIntroSection/LayoutForMinting';
import {
  ProjectLayoutContext,
  ProjectLayoutProvider,
} from '@contexts/project-layout-context';
import { PaymentMethod } from '@enums/mint-generative';
import { IProjectMintFeeRate } from '@interfaces/api/project';
import { Project } from '@interfaces/project';
import { useContext } from 'react';
import LayoutForMintout from './LayoutForMintout';
import s from './styles.module.scss';

type Props = {
  project?: Project | null;
  projectFeeRate?: IProjectMintFeeRate | null;
  openMintBTCModal: (s: PaymentMethod) => void;
  isWhitelist?: boolean;
};

const ProjectIntroSection = () => {
  const { isLimitMinted } = useContext(ProjectLayoutContext);

  return (
    <div className={`${s.wrapper} ${!isLimitMinted ? `${s.minted}` : ''}`}>
      <div className={'container'}>
        {!isLimitMinted ? <LayoutForMintout /> : <LayoutForMinting />}
      </div>
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
