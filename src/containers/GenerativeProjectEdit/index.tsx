import React, { useContext } from 'react';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import FormEditProject from '@containers/GenerativeProjectEdit/FormEditProject';
import s from './styles.module.scss';
import { Container } from 'react-bootstrap';

const GenerativeProjectEdit = (): JSX.Element => {
  const { projectData } = useContext(GenerativeProjectDetailContext);

  const renderLeftContent = () => {
    return (
      <div className={s.info}>
        <FormEditProject />
      </div>
    );
  };

  return (
    <Container>
      <div className={s.wrapper}>
        {renderLeftContent()}
        <div className={s.wrapper_image}>
          <img src={projectData?.image} alt="projectData_image" />
        </div>
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
