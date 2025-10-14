import { genSaltSync, hashSync, compareSync } from "bcrypt";

const createHash = (password) => {
  const salt = genSaltSync(10);
  const hashPassword = hashSync(password, salt);
  return hashPassword;
};

const compareHash = (bodyPassword, mongoPassword) => {
  const verify = compareSync(bodyPassword, mongoPassword);
  return verify;
};

export { createHash, compareHash };
