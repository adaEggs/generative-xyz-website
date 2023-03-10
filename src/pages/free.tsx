import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import Inscribe from '@containers/Inscribe';
import { CDN_URL } from '@constants/config';
import InscribeLanding from '@containers/Inscribe/Landing';
import { useState } from 'react';

const MintToolPage: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <MarketplaceLayout isHideFaucet={true}>
      {!file && <InscribeLanding onChangeFile={setFile} />}
      {file && <Inscribe uploadedFile={file} setUploadedFile={setFile} />}
    </MarketplaceLayout>
  );
};

export default MintToolPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Free',
        description: 'Inscribe NFTs on Bitcoin. For free.',
        image: `${CDN_URL}/images/marketplace.jpg`,
      },
    },
  };
}
