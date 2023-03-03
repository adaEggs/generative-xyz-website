import { Col, Container, Row } from 'react-bootstrap';
import FormEditProfile from './FormEditProfile';
import s from './styles.module.scss';
import { ProfileContext, ProfileProvider } from '@contexts/profile-context';
import { Loading } from '@components/Loading';
import React, { useContext, useState } from 'react';
import Heading from '@components/Heading';
import Text from '@components/Text';

const EditProfile = (): JSX.Element => {
  const [tab, setTab] = useState<string>('account');
  const { isLoaded } = useContext(ProfileContext);

  return (
    <div className={s.editProfile}>
      <Container>
        <Row className={s.editProfile_row}>
          <Col xl={4}>
            <Heading as={'h4'}>Edit Profile</Heading>
            <ul className={s.editProfile_tabs}>
              <li
                className={`${tab === 'account' ? s.isActive : ''}`}
                onClick={() => setTab('account')}
              >
                <Text as={'span'} size={'20'}>
                  Account Info
                </Text>
              </li>
              <li
                className={`${tab === 'wallet' ? s.isActive : ''}`}
                onClick={() => setTab('wallet')}
              >
                <Text as={'span'} size={'20'}>
                  Artist Payments
                </Text>
              </li>
              <li
                className={`${tab === 'export' ? s.isActive : ''}`}
                onClick={() => setTab('export')}
              >
                <Text as={'span'} size={'20'}>
                  Key
                </Text>
              </li>
              <li
                className={`${tab === 'developer' ? s.isActive : ''}`}
                onClick={() => setTab('developer')}
              >
                <Text as={'span'} size={'20'}>
                  Developer
                </Text>
              </li>
            </ul>
            <div className={s.wrapper}>
              <FormEditProfile tab={tab} />
            </div>
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

const WrapEditProfile = (): JSX.Element => {
  return (
    <ProfileProvider>
      <EditProfile />
    </ProfileProvider>
  );
};

export default WrapEditProfile;
