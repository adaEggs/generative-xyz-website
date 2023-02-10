import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import TokenID from '@containers/Bazaar/TokenID';

const TokenIDPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <TokenID />
    </MarketplaceLayout>
  );
};

export default TokenIDPage;

// Todo
// export async function getServerSideProps() {
//   return {
//     props: {
//       seoInfo: {
//         title: 'Generative | Collect',
//         description: 'Unique artwork at your fingertips to mint and buy',
//         image: `${CDN_URL}/images/collect.jpg`,
//       },
//     },
//   };
// }
