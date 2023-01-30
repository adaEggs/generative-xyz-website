import React, { useContext } from 'react';
import Text from '@components/Text';
import classNames from 'classnames';
import Button from '@components/Button';
import { setIsScrolling } from '@redux/general/action';
import { gsap } from 'gsap';
import { useDispatch } from 'react-redux';
import s from './QuickBuy.module.scss';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';
import { isPhoneScreen, isTabletScreen } from '@utils/common';
import { NavigationContext } from '@contexts/navigation-context';
import { SOCIALS } from '@constants/common';

const QuickBuy = (): React.ReactElement => {
  const { isTechSpecz } = useContext(NavigationContext);

  const router = useRouter();
  const dispatch = useDispatch();
  const scrollTo = () => {
    dispatch(setIsScrolling(true));
    gsap.to(window, {
      scrollTo: {
        y: '#tech-spec',
        offsetY: isPhoneScreen() ? 0 : isTabletScreen() ? -25 : -60,
      },
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
    <div className={`${s.quickBuy}`}>
      <Container>
        <div className={s.quickBuy_inner}>
          <div className={s.quickBuy_left}>
            <Text
              as={'span'}
              size={'18'}
              fontWeight="medium"
              className={`${s.quickBuy_heading}`}
            >
              Generative Display
            </Text>
          </div>
          <div className={s.quickBuy_right}>
            <span
              onClick={scrollTop}
              className={`${!isTechSpecz ? s.isActive : ''} ${
                s.quickBuy_scroller
              }`}
            >
              Overview
            </span>
            <span
              onClick={scrollTo}
              className={`${s.quickBuy_scroller} ${
                isTechSpecz ? s.isActive : ''
              }`}
            >
              Tech specs
            </span>

            <span
              onClick={() => {
                window.open(SOCIALS.bookATour);
              }}
              className={`${s.quickBuy_scroller}`}
            >
              Book a tour
            </span>
            <Button
              size="sm"
              variant="black"
              className={classNames(s.quickBuy_right_orderBtn)}
              onClick={onClick}
            >
              <span className="text">Buy</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default QuickBuy;
