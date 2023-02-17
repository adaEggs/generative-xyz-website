import React, { useContext, useEffect } from 'react';
import {
  GenerativeProjectDetailContext,
  GenerativeProjectDetailProvider,
} from '@contexts/generative-project-detail-context';
import FormEditProject from '@containers/GenerativeProjectEdit/FormEditProject';
import s from './styles.module.scss';
import { Container } from 'react-bootstrap';
import Heading from '@components/Heading';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';

const GenerativeProjectEdit = (): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const { projectData } = useContext(GenerativeProjectDetailContext);

  useEffect(() => {
    if (!user || !projectData) return;
    if (user?.walletAddress !== projectData?.creatorAddr) {
      router.push(ROUTE_PATH.COLLECTIONS);
    }
  }, [user, projectData]);

  const renderLeftContent = () => {
    return (
      <div className={s.info}>
        <Heading as={'h3'} className={s.info_heading}>
          Edit project: {projectData?.name}
        </Heading>
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
