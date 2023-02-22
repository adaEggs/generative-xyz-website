import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from '@components/ButtonIcon';
import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Heading from '@components/Heading';
import Text from '@components/Text';
import Input from '@components/Formik/Input';
import { reportProject } from '@services/project';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';

type Props = {
  isShow: boolean;
  onHideModal: () => void;
};

const LOG_PREFIX = 'ReportModal';

const ReportModal = (props: Props) => {
  const { isShow, onHideModal } = props;

  const router = useRouter();
  const { projectID } = router.query as { projectID: string };

  const handleSubmitReport = async () => {
    const payload = {
      originalLink: '',
    };

    try {
      await reportProject({ projectID }, payload);
      toast.success('Thank you for your report. We will review it soon.');
      //   onHideModal();
    } catch (err: unknown) {
      log('failed to report project', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
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
        <Heading as="h5" fontWeight="medium">
          Report this collection
        </Heading>
        <div className={s.reportWrapper}>
          <Text size="18" fontWeight="medium">
            I think this collection is fake collection or possible scam.
          </Text>
          <Input
            name={'originalCreator'}
            label="ORIGINAL COLLECTION"
            sizes={'small'}
            className={s.original_input}
            //   onChange={debounce(e => {
            //     setDelegateAddress(e.target.value);
            //   }, 500)}
            placeholder="Link to original creator"
          />
        </div>

        <div className={s.actionWrapper}>
          <Button
            // disabled={isDelegating}
            onClick={onHideModal}
            className={s.actionBtn}
            variants="secondary"
          >
            Cancel
          </Button>
          <Button
            // disabled={isDelegating}
            onClick={handleSubmitReport}
            className={s.actionBtn}
          >
            {'Confirm'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
