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
    <>
      <Container className={s.wrapper}>
        <Row className={s.metamaskContainer}>
          <Col md={'12'} xl={'6'} className={s.leftContainer}>
            <Heading as="h2" className={s.title}>
              Inscribe NFTs on Bitcoin. For free
            </Heading>
            <div className={s.content}>
              <Text size="20">
                Generative makes it quick and easy to inscribe BTC NFTs with
                zero fee.
              </Text>
              <Text size="20" className={s.bullet}>
                <SvgInset
                  size={20}
                  svgUrl={`${CDN_URL}/icons/check-circle.svg`}
                />
                No fees charged by Generative. Only the network fee need to be
                paid.
              </Text>
              <Text size="20" className={s.bullet}>
                <SvgInset
                  size={20}
                  svgUrl={`${CDN_URL}/icons/check-circle.svg`}
                />
                Not necessary to set up a full node, ord indexer, or any other
                technical infrastructure.
              </Text>
              <Text size="20" className={s.bullet}>
                <SvgInset
                  size={20}
                  svgUrl={`${CDN_URL}/icons/check-circle.svg`}
                />
                Make inscribing as easy as a piece of cake.
              </Text>
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
                {/* <DropFile
                  className={s.dropZoneContainer}
                  onChange={onChangeFile}
                  fileOrFiles={null}
                  setFileError={setFileError}
                /> */}
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
            <Text color="black-60">
              Select a file to inscribe (text, jpg, mp3, etc.)
            </Text>
            <Text color="black-60">Maximum 380Kb</Text>
          </Col>
          <Col md={'12'} xl={'6'} className={s.poster}>
            <img alt="banner" src={`${CDN_URL}/images/free-background.png`} />
          </Col>
        </Row>
      </Container>
      <GridDebug />
    </>
  );
};

export default InscribeLanding;
