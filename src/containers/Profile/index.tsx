import useBitcoin from '@bitcoin/useBitcoin';
import { Loading } from '@components/Loading';
import ClientOnly from '@components/Utils/ClientOnly';
import BalanceTab from '@containers/Profile/BalanceTab';
import HistoryModal from '@containers/Profile/Collected/Modal/History';
import { CreatedTab } from '@containers/Profile/Created';
import { UserInfo } from '@containers/Profile/UserInfo';
import { ProfileContext, ProfileProvider } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { formatBTCPrice } from '@utils/format';
import React, { useContext } from 'react';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { Collected } from './Collected';
import FreeInscriptions from './Free';
import s from './Profile.module.scss';
import ReferralTab from './Referral';

const Profile: React.FC = (): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const {
    isLoaded,
    profileProjects,
    collectedNFTs,
    totalFreeInscription,
    isLoadingUTXOs,
    currentUser,
  } = useContext(ProfileContext);
  const [showModal, setShowModal] = React.useState(false);
  const { satoshiAmount } = useBitcoin();
  const isOwner = currentUser?.id === user?.id;

  return (
    <div className={s.profile}>
      <Container>
        <Row>
          <Col xl={3}>
            <UserInfo toggle={() => setShowModal(true)} />
          </Col>
          <Col xl={9}>
            <ClientOnly>
              <div className={s.wrapTabs}>
                <Tabs className={s.tabs}>
                  <Tab
                    tabClassName={s.tab}
                    eventKey="collectedTab"
                    title={<>{collectedNFTs.length} Collected</>}
                  >
                    <Collected />
                  </Tab>

                  <Tab
                    tabClassName={s.tab}
                    eventKey="createdTab"
                    title={<>{profileProjects?.total || 0} Created</>}
                  >
                    <CreatedTab />
                  </Tab>
                  {/* Wait for design to implement. Do not remove */}
                  {isOwner && (
                    <Tab
                      tabClassName={s.tab}
                      eventKey="referralTab"
                      title={'Activities'}
                    >
                      <ReferralTab />
                    </Tab>
                  )}
                  {isOwner && (
                    <Tab
                      tabClassName={s.tab}
                      eventKey="balanceTab"
                      title={
                        isLoadingUTXOs
                          ? 'loading...'
                          : `${formatBTCPrice(satoshiAmount.toString())} BTC`
                      }
                    >
                      <BalanceTab />
                    </Tab>
                  )}
                  <Tab
                    tabClassName={s.tab}
                    eventKey="freeTab"
                    title={<>{totalFreeInscription} Free</>}
                  >
                    <FreeInscriptions />
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
