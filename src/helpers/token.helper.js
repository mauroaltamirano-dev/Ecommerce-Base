import jwt from "jsonwebtoken";

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

const verifyToken = (token) => {
  if (!token) {
    const err = new Error("Token is required");
    err.statusCode = 401;
    throw err;
  }

  try {
    return jwt.verify(token, process.env.JWT_KEY, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }
};

export { createToken, verifyToken };
