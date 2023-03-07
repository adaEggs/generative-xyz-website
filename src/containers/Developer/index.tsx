import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { useRouter } from 'next/router';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import s from './Developer.module.scss';
// import copy from 'copy-to-clipboard';
// import { toast } from 'react-hot-toast';

const Developer = () => {
  const router = useRouter();

  const user = useAppSelector(getUserSelector);

  const onClickGenerate = () => {
    if (user && user.id) {
      router.push(`${ROUTE_PATH.EDIT_PROFILE}?developers=true`);
    } else {
      router.push(ROUTE_PATH.WALLET);
    }
  };

  const onClickDocs = () => {
    window.open(
      'https://docs.generative.xyz/issa-api-docs/step-by-step-instructions'
    );
  };

  // const onClickCopy = (text: string) => {
  //   copy(text);
  //   toast.remove();
  //   toast.success('Copied');
  // };

  const renderDescItem = (child: () => React.ReactElement) => {
    return (
      <div className={s.descItem}>
        <SvgInset
          size={20}
          svgUrl={`${CDN_URL}/icons/check-circle.svg`}
          className={s.icon}
        />
        {child()}
      </div>
    );
  };

  // const renderItemCode = (
  //   title: string,
  //   desc: string,
  //   requestCode: string,
  //   responseCode: string
  // ) => {
  //   return (
  //     <div className={s.code}>
  //       <p className={s.title}>{title}</p>
  //       <p className={s.subTitle}>{desc}</p>
  //       <p className={s.subTitle}>Example request:</p>
  //       <div className={s.exampleContainer}>
  //         <img
  //           src={`${CDN_URL}/icons/ic-copy.svg`}
  //           className={s.icCopy}
  //           alt="ic-metamask"
  //           onClick={() => onClickCopy(requestCode)}
  //         />
  //         <pre className={s.example}>
  //           <code>{requestCode}</code>
  //         </pre>
  //       </div>
  //       <p className={s.subTitle}>Example response:</p>
  //       <div className={s.exampleContainer}>
  //         <img
  //           src={`${CDN_URL}/icons/ic-copy.svg`}
  //           className={s.icCopy}
  //           alt="ic-metamask"
  //           onClick={() => onClickCopy(responseCode)}
  //         />
  //         <pre className={s.example}>
  //           <code>{responseCode}</code>
  //         </pre>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <Container>
      <Row className={s.metamaskContainer}>
        <Col md={'12'} xl={'6'} className={s.leftContainer}>
          <p className={s.title}>Generative API</p>
          <Text className={s.subTitle}>
            Easily integrate Ordinal inscription services into your existing
            workflows and systems, saving you engineering time and
            infrastructure maintenance effort.
          </Text>
          {renderDescItem(() => (
            <Text className={s.text}>
              Works seamlessly with standard Ordinal operations.
            </Text>
          ))}
          {renderDescItem(() => (
            <Text className={s.text}>
              Full API set for inscribing, tracking inscribing status, and
              browsing Bitcoin inscriptions.
            </Text>
          ))}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 64,
            }}
          >
            <ButtonIcon
              variants="blue-deep"
              className={s.login}
              onClick={onClickGenerate}
              endIcon={
                <SvgInset
                  svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                />
              }
            >
              Generate API Key
            </ButtonIcon>

            <div className={s.generate} onClick={onClickDocs}>
              Read the docs
            </div>
          </div>
        </Col>
        <Col md={'12'} xl={'6'}>
          <img alt="banner" src={`${CDN_URL}/images/developer_banner.png`} />
        </Col>
      </Row>
    </Container>
  );
};

export default Developer;
