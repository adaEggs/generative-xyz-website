import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { SEO_TITLE } from '@constants/seo-default-info';
import GenerativeProjectDetailWrapper from '@containers/GenerativeProjectDetail';
import MarketplaceLayout from '@layouts/Marketplace';
import { getProjectDetail } from '@services/project';
import { GetServerSidePropsContext, NextPage } from 'next';

const GenerativeProjectDetailPage: NextPage = () => {
  return (
    <MarketplaceLayout isDrops={true}>
      <GenerativeProjectDetailWrapper />
    </MarketplaceLayout>
  );
};

export default GenerativeProjectDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { projectID } = query as { projectID: string };
  const res = await getProjectDetail({
    contractAddress: GENERATIVE_PROJECT_CONTRACT,
    projectID,
  });

  return {
    props: {
      seoInfo: {
        title: `${SEO_TITLE} | ${res.name} `,
        description: res.desc || res.itemDesc,
        image: res.image,
      },
    },
  };
}
