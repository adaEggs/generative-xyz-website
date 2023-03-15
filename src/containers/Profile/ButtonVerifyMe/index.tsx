import React, { useState } from 'react';
import cn from 'classnames';
import { toast } from 'react-hot-toast';

import { ErrorMessage } from '@enums/error-message';
import Button from '@components/Button';
import { createDaoArtist } from '@services/request';

import s from './styles.module.scss';

interface IProps {
  className?: string;
}

const ButtonVerifyMe = ({ className }: IProps) => {
  const [isClickedVerify, setIsClickedVerify] = useState<boolean>(false);
  const submitVerifyMe = async () => {
    toast.remove();
    const result = await createDaoArtist();
    if (result) {
      toast.success('Submit proposal successfully. View');
    } else {
      toast.error(ErrorMessage.DEFAULT);
    }
    setIsClickedVerify(true);
  };

  if (isClickedVerify) return null;

  return (
    <Button
      className={cn(s.buttonVerifyMe, className)}
      onClick={submitVerifyMe}
    >
      Verify me
    </Button>
  );
};

export default ButtonVerifyMe;
