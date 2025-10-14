import passport from "./passport.mid.js";

function passportCb(strategy) {
  return async function (req, res, next) {
    return passport.authenticate(strategy, (err, user, info) => {
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          const error = new Error(info.message || "Bad Auth");
          error.statusCode = info.statusCode || 401;
          throw error;
        }
        req.user = user;
        next();
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };
}

export default passportCb;
