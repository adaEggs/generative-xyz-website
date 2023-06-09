import React from 'react';
import s from './styles.module.scss';
interface IProps {
  width?: number;
  height?: number;
  isLoaded?: boolean;
  fill?: boolean;
  className?: string;
}

const Skeleton = ({ width, height, isLoaded, fill, className }: IProps) => {
  if (isLoaded) return null;
  return (
    <div
      className={`${s.skeleton} ${className}`}
      style={
        fill
          ? { width: '100%', height: '100%' }
          : { width: `${width}px`, height: `${height}px` }
      }
    ></div>
  );
};

export default Skeleton;
