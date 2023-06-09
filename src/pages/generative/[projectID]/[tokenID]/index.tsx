import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import {
  SEO_DESCRIPTION,
  SEO_IMAGE,
  SEO_TITLE,
} from '@constants/seo-default-info';
import GenerativeTokenDetail from '@containers/GenerativeTokenDetail';
import MarketplaceLayout from '@layouts/Marketplace';
import { getTokenUri } from '@services/token-uri';
import { formatTokenId } from '@utils/format';
import { GetServerSidePropsContext, NextPage } from 'next';

const GenerativeTokenDetailPage: NextPage = () => {
  return (
    <MarketplaceLayout isDrops={true}>
      <GenerativeTokenDetail />
    </MarketplaceLayout>
  );
};

export default GenerativeTokenDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { tokenID } = query as { tokenID: string };
  try {
    const res = await getTokenUri({
      contractAddress: GENERATIVE_PROJECT_CONTRACT,
      tokenID,
    });
    const tokenName = `${res.project.name} #${formatTokenId(
      res.tokenID || ''
    )}`;

    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | ${tokenName}`,
          description: res.description,
          image: res.thumbnail || SEO_IMAGE,
        },
      },
    };
  } catch (e) {
    return {
      props: {
        seoInfo: {
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          image: SEO_IMAGE,
        },
      },
    };
  }
}
