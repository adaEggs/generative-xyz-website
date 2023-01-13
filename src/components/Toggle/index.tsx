import { Form } from 'react-bootstrap';
import s from './styles.module.scss';

type TToogleSwitch = {
  id?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
};

const ToogleSwitch = ({
  id,
  label,
  checked,
  disabled,
  onChange,
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
        className={s.switch_btn}
      />
    </Form>
  );
};

export default ToogleSwitch;
