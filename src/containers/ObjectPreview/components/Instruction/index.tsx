import styles from './styles.module.scss';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  download?: boolean;
  url?: string;
}

const Instruction: React.FC<IProps> = ({
  className = '',
  download = false,
  url,
}) => {
  return (
    <div className={`${styles.instruction} ${className}`}>
      <div className={styles.container}>
        <div className={styles.left}>
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

        <div className={styles.right}>
          {download && (
            <div className={styles.row}>
              <b>
                <u>
                  <i>
                    <a download href={url}>
                      Download
                    </a>
                  </i>
                </u>
              </b>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instruction;
