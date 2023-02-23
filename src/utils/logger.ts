import dayjs from 'dayjs';
import { LogLevel } from '@enums/log-level';
import { APP_LOG_LEVEL } from '@constants/config';
import { LogItem } from '@interfaces/log';
import DatadogService from '@services/datadog';

const selectedLogLevel: LogLevel =
  (APP_LOG_LEVEL as undefined | LogLevel) ?? LogLevel.VERBOSE;

const logLevelSufficient = (
  logLevel: LogLevel,
  allowedLogLevel: LogLevel
): boolean => {
  // Mapping LogLevel to number
  const LOGLEVEL_PRIORITY: {
    [key: string]: number;
  } = {
    [LogLevel.TEST]: 0,
    [LogLevel.VERBOSE]: 10,
    [LogLevel.DEBUG]: 20,
    [LogLevel.INFO]: 30,
    [LogLevel.WARNING]: 40,
    [LogLevel.ERROR]: 99,
  };

  const logLevelPriority = LOGLEVEL_PRIORITY[logLevel];
  const allowedLogLevelPriority = LOGLEVEL_PRIORITY[allowedLogLevel];

  return logLevelPriority >= allowedLogLevelPriority;
};

const sendLogToSystem = (logRecord: LogItem): void => {
  const ddInstance = DatadogService.getInstance();
  ddInstance.ddLog(logRecord.message, logRecord);
};

const log = (
  msg: string | Error,
  logLevel: LogLevel,
  prefix?: string
): void => {
  if (!logLevelSufficient(logLevel, selectedLogLevel)) {
    return;
  }

  const timestamp: string = dayjs().format('YYYY-MM-DD, HH:mm:ss.SSS');

  const prettyPrefix = prefix ? ` [${prefix}]:` : '';

  const messagePrefix = `[${logLevel.toUpperCase()}] (${timestamp})${prettyPrefix}`;

  const eventLogItem: LogItem = {
    logLevel,
    message: `${messagePrefix} ${msg}`,
    timestamp: dayjs().unix(),
    module: prefix,
  };

  // Special case for error since we want to see the stacktrace
  if (logLevel === LogLevel.ERROR) {
    if ((msg as Error).message) {
      eventLogItem.message = `${messagePrefix} ${(msg as Error).message}`;
    }
    // eslint-disable-next-line no-console
    console.error(eventLogItem.message);

    if ((msg as Error).stack) {
      eventLogItem.stackTrace = (msg as Error).stack as string;
      // eslint-disable-next-line no-console
      console.error((msg as Error).stack);
    }

    sendLogToSystem(eventLogItem);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(eventLogItem.message);

  sendLogToSystem(eventLogItem);
};

export default log;
