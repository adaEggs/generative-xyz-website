import Heading from '@components/Heading';
import { Loading } from '@components/Loading';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext, ProfileProvider } from '@contexts/profile-context';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import FormEditProfile from './FormEditProfile';
import s from './styles.module.scss';

const EditProfile = (): JSX.Element => {
  const [tab, setTab] = useState<string>('account');
  const { isLoaded } = useContext(ProfileContext);

  return (
    <div className={s.editProfile}>
      <Container>
        <Row className={s.editProfile_row}>
          <Col xl={4}>
            <div className={s.editProfile_titleContainer}>
              <Link href={ROUTE_PATH.PROFILE}>
                <img
                  className={s.editProfile_titleContainer_icon}
                  alt="back"
                  src={`${CDN_URL}/icons/ic-back-profile.png`}
                />
              </Link>
              <Heading as={'h4'}>Settings</Heading>
            </div>
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
