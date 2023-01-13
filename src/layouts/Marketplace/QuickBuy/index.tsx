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

interface IProp {
  isShow: boolean;
}
const QuickBuy: React.FC<IProp> = ({ isShow = false }): React.ReactElement => {
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

  return (
    <div className={`${s.quickBuy} ${isShow ? s.isShow : ''}`}>
      <Container>
        <div className={s.quickBuy_inner}>
          <Heading as={'h5'} className={`${s.quickBuy_heading}`}>
            Generative Display
          </Heading>
          <div className={s.quickBuy_right}>
            <div className={s.quickBuy_right_price}>
              <Text size={'14'} color={'black-60'}>
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
              onClick={scrollTo}
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
