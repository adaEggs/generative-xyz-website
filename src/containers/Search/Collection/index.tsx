import React from 'react';

import { Row, Col } from 'react-bootstrap';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { Project } from '@interfaces/project';
import Slider from '@components/Slider';
import { ProjectCard } from '@components/ProjectCard';

import s from './Collection.module.scss';
import useSearchApi from '../useApi';

interface CollectionProps {
  className?: string;
}

interface IProjectItem {
  project: Project;
}

export const CollectionItem = ({ project }: IProjectItem): JSX.Element => {
  return <ProjectCard className="col-xs-6 col-md-3" project={project} />;
};

const Collection = ({ className }: CollectionProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '' } = router.query;
  const { resultByCollection } = useSearchApi({ keyword });

  const collections = resultByCollection?.result || [];

  if (collections?.length < 1) return <></>;

  const SLIDER_SETTING = {
    className: s.collection_slider,
    slidesToShow: 4,
    slidesToScroll: 4,
    infinite: collections.length > 4,
    dots: true,
    arrows: true,
  };

  return (
    <div className={cn(s.collection, className)}>
      <Row className={s.collection_resetRowGap}>
        <h6 className={s.collection_title}>Collection results</h6>
        {collections.length <= 4 ? (
          <Row>
            {collections.map(collection => (
              <CollectionItem
                key={collection?.project?.tokenID}
                project={collection?.project}
              />
            ))}
          </Row>
        ) : (
          <Col md={12}>
            <Slider settings={SLIDER_SETTING}>
              {collections.map(collection => (
                <div key={collection?.project?.tokenID}>
                  <CollectionItem project={collection?.project} />
                </div>
              ))}
            </Slider>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default React.memo(Collection);
