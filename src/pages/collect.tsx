import { NextPage } from 'next';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CollectPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(`${ROUTE_PATH.MARKETPLACE}`);
  }, []);
  return <></>;
};

export default CollectPage;
