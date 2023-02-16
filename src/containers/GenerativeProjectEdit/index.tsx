import React, { useContext, useEffect, useState } from 'react';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import useWindowSize from '@hooks/useWindowSize';
import { Token } from '@interfaces/token';
import { base64ToUtf8, escapeSpecialChars } from '@utils/format';
import ThumbnailPreview from '@components/ThumbnailPreview';
import FormEditProject from '@containers/GenerativeProjectEdit/FormEditProject';
import s from './styles.module.scss';
import { Container } from 'react-bootstrap';

const GenerativeProjectEdit = (): JSX.Element => {
  const { mobileScreen } = useWindowSize();
  const [projectDetail, setProjectDetail] = useState<Omit<Token, 'owner'>>();
  const { projectData: project, isBitcoinProject } = useContext(
    GenerativeProjectDetailContext
  );

  const renderLeftContent = () => {
    return (
      <div className={s.info}>
        <FormEditProject />
      </div>
    );
  };

  useEffect(() => {
    if (!project) return;
    const _projectDetail = base64ToUtf8(
      project.projectURI.replace('data:application/json;base64,', '')
    );
    if (_projectDetail) {
      let projectDetailJSON = _projectDetail;
      if (!isBitcoinProject) {
        projectDetailJSON = escapeSpecialChars(_projectDetail);
      }
      const projectDetailObj = JSON.parse(projectDetailJSON);
      setProjectDetail(projectDetailObj);
    }
  }, [project?.id]);

  return (
    <Container>
      <div className={s.wrapper}>
        {renderLeftContent()}
        <div />
        {!mobileScreen && (
          <div>
            <ThumbnailPreview data={projectDetail as Token} allowVariantion />
          </div>
        )}
      </div>
    </Container>
  );
};

const GenerativeProjectEditWrapper = (): JSX.Element => {
  return (
    <GenerativeProjectDetailProvider>
      <GenerativeProjectEdit />
    </GenerativeProjectDetailProvider>
  );
};

export default GenerativeProjectEditWrapper;
