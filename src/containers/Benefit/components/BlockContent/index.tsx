import Heading from '@components/Heading';
import Text from '@components/Text';
import s from './BlockContent.module.scss';
import { ReactNode } from 'react';

interface IProps {
  heading: string;
  className?: string;
  children: ReactNode;
}

export const BlockContent = ({
  heading,
  children,
  className,
}: IProps): JSX.Element => {
  return (
    <div className={`${s.blockContent} ${className}`}>
      <Heading as="h5" color={'white'}>
        {heading}
      </Heading>
      <Text as="p" color={'white-60'} size="18">
        {children}
      </Text>
    </div>
  );
};