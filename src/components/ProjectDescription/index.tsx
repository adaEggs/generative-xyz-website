import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { SeeMore } from '@components/SeeMore';
import Text from '@components/Text';
import s from './styles.module.scss';

type Props = {
  desc: string;
  hasInteraction?: boolean;
};

const ProjectDescription = ({ desc, hasInteraction = false }: Props) => {
  const [projectDescription, setProjectDescription] = useState('');
  const [projectInteraction, setProjectInteraction] = useState('');

  useEffect(() => {
    if (hasInteraction) {
      const splitDesc = desc.split('Interaction') || '';
      setProjectDescription(splitDesc[0]);
      setProjectInteraction(splitDesc[1]);
    }
  }, [desc]);

  if (!hasInteraction) {
    return (
      <div className={s.project_desc}>
        <Text
          size="14"
          color="black-40"
          fontWeight="medium"
          className="text-uppercase"
        >
          description
        </Text>
        <SeeMore>{desc || ''}</SeeMore>
      </div>
    );
  }

  return (
    <Tabs className={s.tabs} defaultActiveKey="description">
      <Tab tabClassName={s.tab} eventKey="description" title={`Description`}>
        <div className={s.project_desc}>
          {/* <Text
                    size="14"
                    color="black-40"
                    fontWeight="medium"
                    className="text-uppercase"
                  >
                    description
                  </Text> */}
          <SeeMore>{projectDescription || ''}</SeeMore>
        </div>
      </Tab>
      <Tab tabClassName={s.tab} eventKey="interaction" title={`Interaction`}>
        <div className={s.project_desc}>
          {/* <Text
                    size="14"
                    color="black-40"
                    fontWeight="medium"
                    className="text-uppercase"
                  >
                    description
                  </Text> */}
          <SeeMore>{projectInteraction || ''}</SeeMore>
        </div>
      </Tab>
    </Tabs>
  );
};

export default ProjectDescription;
