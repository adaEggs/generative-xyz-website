import s from '@containers/Display/components/hardware/hardware.module.scss';
import { BenchmarkItem } from '../benchmark-item';
import classNames from 'classnames';

export const Benchmark = (): JSX.Element => {
  return (
    <div className={classNames(s.hardWare_benchmark, 'container')}>
      <div className={`row ${s.hardWare_benchmark_header}`}>
        <div className="col-xl-6 offset-xl-3 col-md-10 offset-md-1 col-12">
          <h3 className={`heading heading__medium`}>Benchmark</h3>
          <p className={`desc__medium`}>
            Generative Display has set a rising standard in showcasing living
            art — with numbers that speak for themselves.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 offset-xl-3 col-md-10 offset-md-1 col-12">
          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            title={'Cosmic Reef #242'}
            artLink={
              'https://generator.artblocks.io/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/250000242'
            }
            color={'dep-yellow'}
            artCreatorName={`Leo Villareal`}
            artCreatorLink={`https://www.artblocks.io/user/0x960881ac22e23ad3c64291ad45a5de9cb113351a`}
            target1={{ title: 'Generative Display', value: 59 }}
            target2={{ title: 'Macbook Pro 16', value: 14 }}
          />
          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            title={'Act of Emotion #200'}
            artLink={
              'https://generator.artblocks.io/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/364000200'
            }
            color={'dep-blue'}
            artCreatorName={`Kelly Milligan`}
            artCreatorLink={`https://www.artblocks.io/user/0x3b1383e08e7022ad9c12a62902d0fd6a65f350da`}
            target1={{ title: 'Generative Display', value: 58 }}
            target2={{ title: 'Apple M1 8 core', value: 12 }}
          />
          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            color={'yellow'}
            title={'The Field #0'}
            artLink={`https://generator.artblocks.io/0x99a9b7c1116f9ceeb1652de04d5969cce509b069/399000000`}
            artCreatorName={`Beervangeer`}
            artCreatorLink={`https://www.artblocks.io/user/0x35f64560c51c8772f75186a8931929589b7c8d80`}
            target1={{ title: 'Generative Display', value: 58.5 }}
            target2={{ title: 'Apple M1 8 core', value: 6 }}
          />
        </div>
      </div>
    </div>
  );
};
