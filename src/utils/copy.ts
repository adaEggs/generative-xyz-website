import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';

const onClickCopy = (text: string) => {
  copy(text);
  toast.remove();
  toast.success('Copied');
};

export { onClickCopy };
