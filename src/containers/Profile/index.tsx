import { Loading } from '@components/Loading';
import ClientOnly from '@components/Utils/ClientOnly';
import { CreatedTab } from '@containers/Profile/Created';
import { UserInfo } from '@containers/Profile/UserInfo';
import { ProfileContext, ProfileProvider } from '@contexts/profile-context';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Container, Tab, Tabs, Row, Col } from 'react-bootstrap';
import { Collected } from './Collected';
import s from './Profile.module.scss';

const Profile: React.FC = (): React.ReactElement => {
  const { isLoaded, profileProjects, collectedNFTs } =
    useContext(ProfileContext);

  const router = useRouter();
  const { walletAddress } = router.query as { walletAddress: string };

  return (
    <div className={s.profile}>
      <Container>
        <Row>
          <Col xl={3}>
            <UserInfo />
          </Col>
          <Col xl={9}>
            <ClientOnly>
              <div className={s.wrapTabs}>
                <Tabs className={s.tabs}>
                  {!walletAddress && (
                    <Tab
                      tabClassName={s.tab}
                      eventKey="collectedTab"
                      title={`Collected (${collectedNFTs.length})`}
                    >
                      <Collected />
                    </Tab>
                  )}

                  <Tab
                    tabClassName={s.tab}
                    eventKey="createdTab"
                    title={`Created (${profileProjects?.total || 0})`}
                  >
                    <CreatedTab />
                  </Tab>
                </Tabs>
              </div>
            </ClientOnly>
          </Col>
        </Row>
      </Container>
      <Loading
        className={s.profile_loading}
        isLoaded={isLoaded}
        isPage={true}
      />
    </div>
  );
};

const ProfileWrapper = () => {
  return (
    <ProfileProvider>
      <Profile />
    </ProfileProvider>
  );
};

export default ProfileWrapper;
