import styles from './styles.module.scss';

type IProps = React.HTMLProps<HTMLDivElement>;

const Instruction: React.FC<IProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.instruction} ${className}`}>
      <div className={styles.container}>
        <div className={styles.row}>
          <b>
            <u>V</u>
          </b>{' '}
          to <i>change fly mode</i>
        </div>
        <div className={styles.row}>
          <b>
            <u>WASD</u>
          </b>{' '}
          to <i>move</i>
        </div>
        <div className={styles.row}>
          <b>
            <u>SPACE</u>
          </b>{' '}
          to <i>jump</i>
        </div>

        <div className={styles.row}>
          <b>
            <u>MOUSE</u>
          </b>{' '}
          to <i>forward direction</i>
        </div>
      </div>
    </div>
  );
};

export default Instruction;
