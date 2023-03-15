import ButtonIcon from '@components/ButtonIcon';
import { GridDebug } from '@components/Grid/grid';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { SetStateAction, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FileUploader } from 'react-drag-drop-files';
import s from './styles.module.scss';
import { getSupportedFileExtList } from '@utils/file';

const InscribeLanding = ({
  onChangeFile,
}: {
  onChangeFile: React.Dispatch<SetStateAction<File | null>>;
}) => {
  const { processing, onButtonClick } = useBTCSignOrd();
  const user = useAppSelector(getUserSelector);

  const onConnect = () => {
    onButtonClick({});
  };

  const isUser = useMemo((): boolean => {
    return Boolean(user);
  }, [user]);

  return (
    <div className={s.wrapper}>
      <Container className={s.wrapper_container}>
        <Row className={s.metamaskContainer}>
          <Col md={'12'} xl={'6'} className={s.leftContainer}>
            <Heading as="h2" className={s.title}>
              Inscribe your NFTs on Bitcoin—for FREE!
            </Heading>
            <div className={s.content}>
              <Text size="20">
                At Generative, we’ve made it a cinch to inscribe your NFTs on
                the most trusted blockchain, Bitcoin, at no cost. <br />
                <br /> Just upload your picture, GIF, video,… and we’ll take
                care of the rest.
              </Text>
              <Text color="black-60">*A network fee still applies.</Text>
            </div>

            {isUser ? (
              <div className={s.upload}>
                <ButtonIcon
                  variants="blue-deep"
                  className={`${s.login} pointer-none`}
                  sizes={'xlarge'}
                  disabled={processing}
                  startIcon={
                    <SvgInset
                      size={22}
                      svgUrl={`${CDN_URL}/icons/ic-upload.svg`}
                    />
                  }
                >
                  <Text size="18" fontWeight="medium">
                    Inscribe now
                  </Text>
                </ButtonIcon>
                <FileUploader
                  handleChange={onChangeFile}
                  name={'fileUploader'}
                  // maxSize={MINT_TOOL_MAX_FILE_SIZE}
                  // onSizeError={onSizeError}
                  // onTypeError={onTypeError}
                  // fileOrFiles={fileOrFiles}
                  classes={s.dropZoneContainer}
                  // classes={s.dropZone}
                  // types={fileTypes}
                ></FileUploader>
              </div>
            ) : (
              <ButtonIcon
                sizes={'xlarge'}
                variants="blue"
                className={s.login}
                disabled={processing}
                onClick={onConnect}
              >
                <img
                  src={`${CDN_URL}/icons/ic-metamask.png`}
                  className={s.icMetamask}
                  alt="ic-metamask"
                />
                Login via MetaMask
              </ButtonIcon>
            )}
            <Text className={s.content_support} color="black-60">
              Select a file to inscribe ({getSupportedFileExtList().join(', ')})
            </Text>
            <Text className={s.content_size} color="black-60">
              Maximum 380Kb
            </Text>
          </Col>
          <Col md={'12'} xl={'6'} className={s.poster}>
            <img alt="banner" src={`${CDN_URL}/images/free-background.png`} />
          </Col>
        </Row>
      </Container>
      <GridDebug />
    </div>
  );
};

export default InscribeLanding;
