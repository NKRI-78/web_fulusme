type LogLevel = "log" | "info" | "warn" | "error" | "debug";

const isDev = process.env.NODE_ENV === "development";

const formatMessage = (
  level: LogLevel,
  message: unknown,
  optionalParams: unknown[],
) => {
  const timestamp = new Date().toISOString();
  return [
    `[${timestamp}] [${level.toUpperCase()}]`,
    message,
    ...optionalParams,
  ];
};

const createLogger = () => {
  if (!isDev) {
    return {
      log: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };
  }

  return {
    log: (message: unknown, ...optionalParams: unknown[]) =>
      console.log(...formatMessage("log", message, optionalParams)),

    info: (message: unknown, ...optionalParams: unknown[]) =>
      console.info(...formatMessage("info", message, optionalParams)),

    warn: (message: unknown, ...optionalParams: unknown[]) =>
      console.warn(...formatMessage("warn", message, optionalParams)),

    error: (message: unknown, ...optionalParams: unknown[]) =>
      console.error(...formatMessage("error", message, optionalParams)),

    debug: (message: unknown, ...optionalParams: unknown[]) =>
      console.debug(...formatMessage("debug", message, optionalParams)),
  };
};

export const logger = createLogger();
