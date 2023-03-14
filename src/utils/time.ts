import moment from 'moment';
import isNumber from 'lodash/isNumber';

const FORMAT_PATTERN = 'DD MMM hh:mm A';

interface IFormatDate {
  dateTime: number;
  formatPattern?: string;
}
const formatUnixDateTime = ({
  dateTime,
  formatPattern = FORMAT_PATTERN,
}: IFormatDate) => moment.unix(dateTime).format(formatPattern);

const formatDateTime = ({
  dateTime,
  formatPattern = FORMAT_PATTERN,
}: IFormatDate) => moment(dateTime).format(formatPattern);

interface IExpired {
  time: number | string | undefined;
  expiredMin?: number;
}

const isExpiredTime = ({ time, expiredMin = 1 }: IExpired) => {
  if (!time || !isNumber(time)) return false;
  const now = Math.floor(new Date().getTime() / 1000);
  expiredMin = expiredMin * 60;
  return now - Number(time) > expiredMin;
};

const isExpiredTimeClone = ({ time, expiredMin = 1 }: IExpired) => {
  if (!time || !isNumber(time)) return false;
  const now = Math.floor(new Date().getTime() / 1000);
  expiredMin = expiredMin * 60;
  return now - Number(time) > expiredMin;
};

export {
  formatUnixDateTime,
  formatDateTime,
  isExpiredTime,
  isExpiredTimeClone,
};
