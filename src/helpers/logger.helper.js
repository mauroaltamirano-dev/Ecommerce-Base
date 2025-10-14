import { addColors, createLogger, format, transports } from "winston";

const { colorize, simple } = format;

const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  HTTP: 3,
};

const colors = {
  ERROR: "red",
  WARN: "yellow",
  INFO: "blue",
  HTTP: "green",
};

addColors(colors);

const logger = createLogger({
  levels,
  format: colorize(),
  transports: [
    new transports.Console({ level: "HTTP", format: simple() }),
    new transports.File({
      level: "WARN",
      format: simple(),
      filename: "./src/helpers/errors/errors.log",
    }),
  ],
});

export default logger;
