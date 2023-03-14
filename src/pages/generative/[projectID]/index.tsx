import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import { ROUTE_PATH } from '@constants/route-path';
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

  if (projectID && projectID === SATOSHIS_PROJECT_ID) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_PATH.SATOSHIS_PAGE,
      },
    };
  }

  try {
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
  } catch (err: unknown) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_PATH.NOT_FOUND,
      },
    };
  }
}
