import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import React, { useMemo } from 'react';
import s from './styles.module.scss';
import ClientOnly from '@components/Utils/ClientOnly';
import { Loading } from '@components/Loading';

interface IProps {
  url: string;
}

const PDFPreview: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { url } = props;

  const renderLoading = useMemo(() => <Loading isLoaded={false} />, []);

  const renderError = useMemo(
    () => (
      <div className={s.centerContainer}>
        <p className={s.errorMessage}>An error occurred!</p>
      </div>
    ),
    []
  );

  return (
    <ClientOnly>
      <div className={s.pdfPreview}>
        <Document file={url} loading={renderLoading} error={renderError}>
          <Page pageIndex={0} />
        </Document>
      </div>
    </ClientOnly>
  );
};

export default PDFPreview;
