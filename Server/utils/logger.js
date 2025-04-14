import { createLogger, format, transports } from "winston";

const logToFile = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({
      maxFiles: 5,
      colorize: true,
      filename: `logs/error.log`,
      maxsize: 52000000, // 52MB
    }),
  ],
});

const logFormatter = format.printf((info) => {
  const { timestamp, level, stack, message } = info;
  const errorMessage = stack || message;
  return `${timestamp} ${level}: ${errorMessage}`;
});

const logToConsole = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.errors({ stack: true }),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.timestamp(),
        logFormatter
      ),
    }),
  ],
});

const logger = {
  info: (message, meta) => {
    logToFile.info(message, meta);
    logToConsole.info(message, meta);
  },
  error: (message, meta) => {
    logToFile.error(message, meta);
    logToConsole.error(message, meta);
  },
  success: (message, meta) => {
    logToFile.info(message, meta);
    logToConsole.info(message, meta);
  },
  debug: (message, meta) => {
    logToConsole.debug(message, meta);
  }
};

export default logger;
