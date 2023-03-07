import { SeeMore } from '@components/SeeMore';
import { ReactNode, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import s from './styles.module.scss';
import cs from 'classnames';

type Props = {
  desc: string;
  hasInteraction?: boolean;
  profileBio?: string;
  tokenDetail?: ReactNode | null;
  attributes?: ReactNode | null;
};

const ProjectDescription = ({
  desc,
  hasInteraction = false,
  profileBio,
  tokenDetail,
  attributes,
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
    if (hasInteraction && desc) {
      const splitDesc = desc.split('Interaction');
      setProjectDescription(splitDesc[0]);
      setProjectInteraction(splitDesc[1]);
    }
  }, [desc, hasInteraction]);

  useEffect(() => {
    setDefaultActiveKey(handleSetDefaultActiveKey());
  }, [desc, profileBio, attributes, tokenDetail]);

  // if (!hasInteraction) {
  //   return (
  //     <div className={s.project_desc}>
  //       <Text
  //         size="14"
  //         color="black-40"
  //         fontWeight="medium"
  //         className="text-uppercase"
  //       >
  //         description
  //       </Text>
  //       <SeeMore>{desc || ''}</SeeMore>
  //     </div>
  //   );
  // }

  return (
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
          <div className={s.project_desc}>
            {/* <SeeMore render={render}>{attributes || ''}</SeeMore> */}
            {attributes}
          </div>
        </Tab>
      )}

      {!!tokenDetail && (
        <Tab tabClassName={cs(s.tab)} eventKey="token" title={`ORDINAL THEORY`}>
          <div className={s.project_desc}>
            {tokenDetail}
            {/* <SeeMore render={render}>{tokenDetail || ''}</SeeMore> */}
          </div>
        </Tab>
      )}
    </Tabs>
  );
};

export default ProjectDescription;
