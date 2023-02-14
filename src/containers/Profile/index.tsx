import ClientOnly from '@components/Utils/ClientOnly';
// import { OfferTab } from '@containers/Profile/Offer';
// import { OwnedTab } from '@containers/Profile/OwnedTab';
import { UserInfo } from '@containers/Profile/UserInfo';
import { ProfileContext, ProfileProvider } from '@contexts/profile-context';
import React, { useContext } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import s from './Profile.module.scss';
import { Loading } from '@components/Loading';
import { CreatedTab } from '@containers/Profile/Created';
// import { ListingTab } from '@containers/Profile/Listing';
// import TableActivities from '@containers/Profile/Activity';

const Profile: React.FC = (): React.ReactElement => {
  const { isLoaded, profileProjects } = useContext(ProfileContext);

  return (
    <div className={s.profile}>
      <UserInfo />
      <Container>
        <ClientOnly>
          <div className={s.wrapTabs}>
            <Tabs className={s.tabs} defaultActiveKey="createdTab">
              {/*<Tab*/}
              {/*  tabClassName={s.tab}*/}
              {/*  eventKey="ownedTab"*/}
              {/*  title={`Owned (${profileTokens?.total || 0})`}*/}
              {/*>*/}
              {/*  <OwnedTab />*/}
              {/*</Tab>*/}

              <Tab
                tabClassName={s.tab}
                eventKey="createdTab"
                title={`Created (${profileProjects?.total || 0})`}
              >
                <CreatedTab />
              </Tab>

              {/*<Tab tabClassName={s.tab} eventKey="offerTab" title={`Offer`}>*/}
              {/*  <OfferTab />*/}
              {/*</Tab>*/}
              {/*<Tab*/}
              {/*  tabClassName={s.tab}*/}
              {/*  eventKey="listingTab"*/}
              {/*  title={`Listing (${profileListing?.total || 0})`}*/}
              {/*>*/}
              {/*  <ListingTab />*/}
              {/*</Tab>*/}
            </Tabs>
          </div>
        </ClientOnly>
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
