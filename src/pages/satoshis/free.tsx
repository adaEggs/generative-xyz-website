import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import { SEO_TITLE } from '@constants/seo-default-info';
import GenerativeProjectDetailWrapper from '@containers/GenerativeProjectDetail';
import { Project } from '@interfaces/project';
import MarketplaceLayout from '@layouts/Marketplace';
import { getProjectDetail } from '@services/project';
import { NextPage } from 'next';

const GenerativeProjectDetailPage: NextPage<{ projectInfo: Project }> = ({
  projectInfo,
}) => {
  return (
    <MarketplaceLayout isDrops={true}>
      <GenerativeProjectDetailWrapper
        isWhitelist={true}
        project={projectInfo}
      />
    </MarketplaceLayout>
  );
};

export default GenerativeProjectDetailPage;

export async function getServerSideProps() {
  // const { query } = context;
  // const { projectName } = query as { projectID: string };
  const res = await getProjectDetail({
    contractAddress: GENERATIVE_PROJECT_CONTRACT,
    projectID: SATOSHIS_PROJECT_ID,
  });

  return {
    props: {
      seoInfo: {
        title: `${SEO_TITLE} | ${res.name} `,
        description: res.desc || res.itemDesc,
        image: res.image,
      },
      projectInfo: res,
    },
  };
}
