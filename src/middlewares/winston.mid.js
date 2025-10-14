import logger from "../helpers/logger.helper.js";

const winston = (req, res, next) => {
  req.logger = logger;
  logger.HTTP(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

export default winston;
