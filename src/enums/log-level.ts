export enum LogLevel {
  /**
   * Used for tests only
   */
  TEST = 'test',
  /**
   * Verbose logging.
   * Not recommended for production use.
   */
  VERBOSE = 'verbose',
  /**
   * Debug logging.
   * Not recommended for production use.
   */
  DEBUG = 'debug',
  /**
   * Info logging.
   * May be useful for production use for new services.
   */
  INFO = 'info',
  /**
   * Warnings and above.
   * Recommended for production use.
   */
  WARNING = 'warning',
  /**
   * HIGHest log level.
   *
   * Recommended for production use only if you really
   * want to ignore warnings.
   */
  ERROR = 'error',
}
