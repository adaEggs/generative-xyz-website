import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { SEO_TITLE } from '@constants/seo-default-info';
import GenerativeProjectEditWrapper from '@containers/GenerativeProjectEdit';
import MarketplaceLayout from '@layouts/Marketplace';
import { getProjectDetail } from '@services/project';
import { GetServerSidePropsContext, NextPage } from 'next';

const GenerativeProjectEditPage: NextPage = () => {
  return (
    <MarketplaceLayout isDrops={true}>
      <GenerativeProjectEditWrapper />
    </MarketplaceLayout>
  );
};

export default GenerativeProjectEditPage;

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
