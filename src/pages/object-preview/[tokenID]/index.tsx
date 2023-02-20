import ClientOnly from '@components/Utils/ClientOnly';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { ROUTE_PATH } from '@constants/route-path';
import { SEO_IMAGE, SEO_TITLE } from '@constants/seo-default-info';
import ObjectPreview from '@containers/ObjectPreview';
import { Token } from '@interfaces/token';
import { getTokenUri } from '@services/token-uri';
import { formatTokenId } from '@utils/format';
import { GetServerSidePropsContext, NextPage } from 'next';

interface IPageProps {
  token: Token;
}

const ObjectPreviewPage: NextPage<IPageProps> = ({ token }) => {
  return (
    <ClientOnly>
      <ObjectPreview token={token} />
    </ClientOnly>
  );
};

export default ObjectPreviewPage;

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
          title: `${SEO_TITLE} | ${tokenName} `,
          description: res.description,
          image: res.thumbnail || SEO_IMAGE,
        },
        token: res,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: ROUTE_PATH.NOT_FOUND,
        permanent: false,
      },
    };
  }
}
