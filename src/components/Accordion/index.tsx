import React, { ReactNode, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import styles from './styles.module.scss';
import Text from '@components/Text';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import cs from 'classnames';

type Props = {
  header: ReactNode;
  content: string | ReactNode;
  className?: string;
};

const AccordionComponent = ({ header, content, className }: Props) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={cs(styles.wrapper, className)}>
      <Accordion>
        <Accordion.Item eventKey="0" className={styles.accordion_item}>
          <Accordion.Header
            className={styles.accordion_header}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <Text fontWeight="medium" className="black-100">
              {header}
            </Text>
            <div className={styles.accordion_icon}>
              <SvgInset
                size={20}
                className={collapsed ? styles.icOpen : styles.icClose}
                svgUrl={`${CDN_URL}/icons/arrow-up.svg`}
              />
            </div>
          </Accordion.Header>
          <Accordion.Body className={styles.accordion_body}>
            {content}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default AccordionComponent;
