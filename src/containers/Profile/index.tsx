import { Loading } from '@components/Loading';
import ClientOnly from '@components/Utils/ClientOnly';
import { CreatedTab } from '@containers/Profile/Created';
import { UserInfo } from '@containers/Profile/UserInfo';
import { ProfileContext, ProfileProvider } from '@contexts/profile-context';
import React, { useContext } from 'react';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { Collected } from './Collected';
import s from './Profile.module.scss';
import HistoryModal from '@containers/Profile/Collected/Modal/History';
import { isProduction } from '@utils/common';
import ReferralTab from './Referral';
import { useRouter } from 'next/router';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';

const Profile: React.FC = (): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const { isLoaded, profileProjects, collectedNFTs } =
    useContext(ProfileContext);
  const router = useRouter();

  const [showModal, setShowModal] = React.useState(false);
  const { walletAddress } = router.query as { walletAddress: string };
  const isOwner = !walletAddress || user?.walletAddress === walletAddress;

  return (
    <div className={s.profile}>
      <Container>
        <Row>
          <Col xl={3}>
            <UserInfo toggleModal={() => setShowModal(true)} />
          </Col>
          <Col xl={9}>
            <ClientOnly>
              <div className={s.wrapTabs}>
                <Tabs className={s.tabs}>
                  <Tab
                    tabClassName={s.tab}
                    eventKey="collectedTab"
                    title={
                      <>
                        Collected <sup>{collectedNFTs.length}</sup>
                      </>
                    }
                  >
                    <Collected />
                  </Tab>

                  <Tab
                    tabClassName={s.tab}
                    eventKey="createdTab"
                    title={
                      <>
                        Created <sup>{profileProjects?.total || 0}</sup>
                      </>
                    }
                  >
                    <CreatedTab />
                  </Tab>
                  {/* Wait for design to implement. Do not remove */}
                  {!isProduction() && isOwner && (
                    <Tab
                      tabClassName={s.tab}
                      eventKey="referralTab"
                      title={'Referral'}
                    >
                      <ReferralTab />
                    </Tab>
                  )}
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
      <HistoryModal showModal={showModal} onClose={() => setShowModal(false)} />
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
