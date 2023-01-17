import { RecentWorks } from '@containers/Marketplace/RecentWorks';
import { Container } from 'react-bootstrap';

import s from './Marketplace.module.scss';

// const LOG_PREFIX = 'Marketplace';

const Marketplace = () => {
  // Do not remove comment code below, might use later
  // const [projectInfo, setProjectInfo] = useState<Project | undefined>();

  // const fetchRandomProject = async () => {
  //   try {
  //     const res = await getRandomProject();
  //     setProjectInfo(res);
  //   } catch (err: unknown) {
  //     log('failed to fetch random project', LogLevel.Error, LOG_PREFIX);
  //     throw Error();
  //   }
  // };

  // useEffect(() => {
  //   fetchRandomProject();
  // }, []);

  return (
    <>
      {/* <Container className={s.marketplaceContainer}>
        <ProjectIntroSection project={projectInfo} />
      </Container> */}
      <div className={s.marketplaceContainer_recentWorks}>
        <Container>
          <RecentWorks />
        </Container>
      </div>
    </>
  );
};

export default Marketplace;
