import { verifyToken } from "../helpers/token.helper.js";

const setupPolicies = (policies) => async (req, res, next) => {
  try {
    if (policies.includes("PUBLIC")) return next();

    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.json401();
    }

    const payload = verifyToken(token);
    req.user = payload;

    if (!policies.includes(payload.role)) {
      return res.json403();
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default setupPolicies;
