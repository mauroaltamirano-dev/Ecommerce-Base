import errors from "../helpers/errors/errors.js";

const errorHandler = (err, req, res, next) => {
  const { method, originalUrl: url } = req;
  const error = err.message || errors.fatal.message;
  const statusCode = err.statusCode || errors.fatal.statusCode;
  res.status(statusCode).json({
    error,
    method,
    url,
  });
};

export default errorHandler;
