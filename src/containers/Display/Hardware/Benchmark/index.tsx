import s from '@containers/Display/Hardware/hardware.module.scss';
import { BenchmarkItem } from '../BenchmarkItem';
import classNames from 'classnames';

export const Benchmark = (): JSX.Element => {
  return (
    <div className={classNames(s.hardWare_benchmark, 'container')}>
      <div className={`row ${s.hardWare_benchmark_header}`}>
        <div className="col-xxxl-6 col-xl-7 offset-xxxl-3 offset-xl-2 col-md-10 offset-md-1 col-12">
          <h3 className={`heading heading__medium`}>Benchmark</h3>
          <p className={`desc__medium`}>
            Grail has set a rising standard in showcasing living art — with
            numbers that speak for themselves.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-xxxl-6 col-xl-8 offset-xxxl-3 offset-xl-2 col-md-10 offset-md-1 col-12">
          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            title={'Cosmic Reef #242'}
            artLink={
              'https://generator.artblocks.io/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/250000242'
            }
            color={'dep-yellow'}
            artCreatorName={`Leo Villareal`}
            target1={{ title: 'Grail', value: 59 }}
            target2={{ title: 'Macbook Pro 16 2019', value: 14 }}
          />

          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            color={'yellow'}
            title={'The Field #0'}
            artLink={`https://generator.artblocks.io/0x99a9b7c1116f9ceeb1652de04d5969cce509b069/399000000`}
            artCreatorName={`Beervangeer`}
            target1={{ title: 'Grail', value: 58.5 }}
            target2={{ title: 'Macbook Pro 16 2019', value: 6 }}
          />

          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            title={'Aurora IV #52'}
            artLink={
              'https://generator.artblocks.io/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/56000052'
            }
            color={'dep-blue'}
            artCreatorName={`ge1doot`}
            target1={{ title: 'Grail', value: 58.4 }}
            target2={{ title: 'Macbook Pro 16 2019', value: 29 }}
          />
        </div>
      </div>
    </div>
  );
};
