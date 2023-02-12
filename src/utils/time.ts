import moment from 'moment';

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

export { formatUnixDateTime, formatDateTime };
