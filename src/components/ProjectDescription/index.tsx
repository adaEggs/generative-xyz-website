import { SeeMore } from '@components/SeeMore';
import { ReactNode, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import s from './styles.module.scss';
import cs from 'classnames';

type Props = {
  desc: string;
  hasInteraction?: boolean;
  profileBio?: string;
  descInteraction?: string;
  tokenDetail?: ReactNode | null;
  attributes?: ReactNode | null;
  onlyDesc?: boolean;
};

const ProjectDescription = ({
  desc,
  hasInteraction = false,
  profileBio,
  tokenDetail,
  attributes,
  descInteraction = '',
  onlyDesc,
}: Props) => {
  const [projectDescription, setProjectDescription] = useState('');
  const [projectInteraction, setProjectInteraction] = useState('');
  const [render, setRender] = useState(false);
  const [defaultActiveKey, setDefaultActiveKey] = useState('description');

  const handleSetDefaultActiveKey = () => {
    if (desc) return 'description';
    if (profileBio) return 'profile';
    if (attributes) return 'features';
    return 'token';
  };

  const handleSelectTab = (tab: string) => {
    setDefaultActiveKey(tab);
    setRender(!render);
  };

  useEffect(() => {
    if (hasInteraction && (desc || descInteraction)) {
      const splitDesc = (descInteraction || desc).split('Interaction');
      setProjectDescription(splitDesc[0]);
      setProjectInteraction(splitDesc[1]);
    }
  }, [desc, hasInteraction, descInteraction]);

  useEffect(() => {
    setDefaultActiveKey(handleSetDefaultActiveKey());
  }, [desc, profileBio, attributes, tokenDetail]);

  return onlyDesc ? (
    <div className={s.project_desc}>
      <SeeMore>{hasInteraction ? projectDescription : desc}</SeeMore>
    </div>
  ) : (
    <Tabs
      className={s.tabs}
      activeKey={defaultActiveKey}
      onSelect={tab => handleSelectTab(tab || 'description')}
    >
      {!!desc && (
        <Tab tabClassName={s.tab} eventKey="description" title={`Description`}>
          <div className={s.project_desc}>
            <SeeMore>{hasInteraction ? projectDescription : desc}</SeeMore>
          </div>
        </Tab>
      )}

      {!!projectInteraction && (
        <Tab tabClassName={s.tab} eventKey="interaction" title={`Interaction`}>
          <div className={s.project_desc}>
            <SeeMore render={render}>{projectInteraction || ''}</SeeMore>
          </div>
        </Tab>
      )}
      {!!profileBio && (
        <Tab tabClassName={s.tab} eventKey="profile" title={`Artist Profile`}>
          <div className={s.project_desc}>
            <SeeMore render={render}>{profileBio || ''}</SeeMore>
          </div>
        </Tab>
      )}
      {!!attributes && (
        <Tab tabClassName={s.tab} eventKey="features" title={`Features`}>
          <div className={s.project_desc}>{attributes}</div>
        </Tab>
      )}

      {!!tokenDetail && (
        <Tab tabClassName={cs(s.tab)} eventKey="token" title={`ORDINAL THEORY`}>
          <div className={s.project_desc}>{tokenDetail}</div>
        </Tab>
      )}
    </Tabs>
  );
};

export default ProjectDescription;
