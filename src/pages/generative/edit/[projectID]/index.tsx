import GenerativeProjectEditWrapper from '@containers/GenerativeProjectEdit';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const GenerativeProjectEditPage: NextPage = () => {
  return (
    <MarketplaceLayout isDrops={true}>
      <GenerativeProjectEditWrapper />
    </MarketplaceLayout>
  );
};

export default GenerativeProjectEditPage;
