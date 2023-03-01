import { Form } from 'react-bootstrap';
import s from './styles.module.scss';
import cs from 'classnames';

type TToogleSwitch = {
  id?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  size?: '16' | '20' | '24';
};

const ToogleSwitch = ({
  id,
  label,
  checked,
  disabled,
  onChange,
  size = '24',
}: TToogleSwitch) => {
  return (
    <Form>
      <Form.Check
        type="switch"
        id={id}
        label={label}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={cs(s.switch_btn, s[`size-${size}`])}
      />
    </Form>
  );
};

export default ToogleSwitch;
