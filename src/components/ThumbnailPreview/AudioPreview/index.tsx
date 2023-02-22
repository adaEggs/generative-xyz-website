import ClientOnly from '@components/Utils/ClientOnly';
import React from 'react';
import s from './styles.module.scss';
import {
  SpectrumVisualizer,
  SpectrumVisualizerTheme,
} from 'react-audio-visualizers';

interface IProps {
  url: string;
}

const AudioPreview: React.FC<IProps> = (props: IProps) => {
  const { url } = props;

  return (
    <ClientOnly>
      <div className={s.audioPreview}>
        <SpectrumVisualizer
          audio={url}
          theme={SpectrumVisualizerTheme.radialSquaredBars}
          iconsColor="#1c1c1c"
          backgroundColor="white"
          showMainActionIcon
          showLoaderIcon
          highFrequency={8000}
        />
      </div>
    </ClientOnly>
  );
};

export default AudioPreview;
