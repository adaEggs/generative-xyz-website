import React from 'react';
import Text from '@components/Text';
import classNames from 'classnames';
import Button from '@components/Button';
import Heading from '@components/Heading';
import { setIsScrolling } from '@redux/general/action';
import { gsap } from 'gsap';
import { useDispatch } from 'react-redux';
import s from './QuickBuy.module.scss';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';

interface IProp {
  isShow: boolean;
}

const QuickBuy: React.FC<IProp> = ({ isShow = false }): React.ReactElement => {
  const router = useRouter();
  const dispatch = useDispatch();
  const scrollTo = () => {
    dispatch(setIsScrolling(true));
    gsap.to(window, {
      scrollTo: '#tech-spec',
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => {
        setTimeout(() => {
          dispatch(setIsScrolling(false));
        }, 1500);
      },
    });
  };

  const scrollTop = () => {
    dispatch(setIsScrolling(true));
    gsap.to(window, {
      scrollTo: 0,
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => {
        setTimeout(() => {
          dispatch(setIsScrolling(false));
        }, 1500);
      },
    });
  };

  const onClick = () => {
    router.push(ROUTE_PATH.ORDER_NOW);
  };

  return (
    <div className={`${s.quickBuy} ${isShow ? s.isShow : ''}`}>
      <Container>
        <div className={s.quickBuy_inner}>
          <div className={s.quickBuy_left}>
            <Heading as={'h5'} className={`${s.quickBuy_heading}`}>
              Generative Display
            </Heading>
            <span onClick={scrollTop} className={s.quickBuy_scroller}>
              Overview
            </span>
            <span onClick={scrollTo} className={s.quickBuy_scroller}>
              Tech specs
            </span>
          </div>
          <div className={s.quickBuy_right}>
            <div className={s.quickBuy_right_price}>
              <Text size={'14'} color={'black-06'}>
                From
              </Text>
              <Text size={'18'} fontWeight={'semibold'} color={'black-002'}>
                5 ETH
              </Text>
            </div>
            <Button
              size="lg"
              variant="black"
              className={classNames(s.Home_video_content_ctas_orderBtn)}
              onClick={onClick}
            >
              <span className="text">Order Now</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default QuickBuy;
