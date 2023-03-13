import Button from '@components/ButtonIcon';
import Input from '@components/Formik/Input';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { BTC_PROJECT } from '@constants/tracking-event-name';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { sendAAEvent } from '@services/aa-tracking';
import { reportProject } from '@services/project';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import s from './styles.module.scss';

type Props = {
  isShow: boolean;
  onHideModal: () => void;
  isReported?: boolean;
};

const LOG_PREFIX = 'ReportModal';

const ReportModal = (props: Props) => {
  const { isShow, onHideModal, isReported = false } = props;
  const walletCtx = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const { projectID } = router.query as { projectID: string };
  const [reportLink, setReportLink] = useState('');
  const [reported, setReported] = useState(false);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await walletCtx.connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!user) {
      await handleConnectWallet();
    }

    const payload = {
      originalLink: reportLink,
    };

    try {
      setIsConnecting(true);
      await reportProject({ projectID }, payload);
      toast.success('Thank you for your report. We will review it soon.');

      sendAAEvent({
        eventName: BTC_PROJECT.REPORT_PROJECT,
        data: {
          projectId: projectID,
        },
      });
      setReported(true);
      onHideModal();
    } catch (err: unknown) {
      log('failed to report project', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Modal
      show={isShow}
      onHide={onHideModal}
      centered
      className={s.modalWrapper}
    >
      <Modal.Header className={s.modalHeader}>
        <Button onClick={onHideModal} className={s.closeBtn} variants="ghost">
          <SvgInset
            className={s.closeIcon}
            svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
          />
        </Button>
      </Modal.Header>
      <Modal.Body>
        {isReported || reported ? (
          <>
            <Heading as="h5" fontWeight="medium">
              Thank you for making Generative safe!
            </Heading>
            <div className={s.reportWrapper}>
              <Text fontWeight="medium">
                This collection is currently under review and action will be
                taken.
              </Text>
            </div>
          </>
        ) : (
          <>
            <Heading as="h5" fontWeight="medium">
              Copypasta Alert
            </Heading>
            <div className={s.reportWrapper}>
              <Text fontWeight="medium">
                Thank you for alerting! Please let us know the original artwork,
                and we’ll review it ASAP.
              </Text>
              <Input
                name={'originalCreator'}
                sizes={'small'}
                className={s.original_input}
                onBlur={e => setReportLink(e.target.value)}
                placeholder="Enter the original artwork URL"
              />
            </div>

            <div className={s.actionWrapper}>
              <Button
                disabled={isConnecting}
                onClick={handleSubmitReport}
                className={s.actionBtn}
              >
                Alert
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
