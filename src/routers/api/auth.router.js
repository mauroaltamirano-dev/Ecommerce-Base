import CustomRouter from "../../helpers/CustomRouter.helper.js";
import {
  register,
  login,
  signout,
  online,
  google,
  failure,
  setAdmin,
  setUser,
} from "../../controllers/auth.controller.js";
import passportCb from "../../middlewares/passportCb.mid.js";
import passport from "../../middlewares/passport.mid.js";

class AuthRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/register", ["PUBLIC"], passportCb("register"), register);
    this.create("/login", ["PUBLIC"], passportCb("login"), login);
    this.read("/signout", ["USER", "ADMIN"], signout);
    this.create("/online", ["USER", "ADMIN"], online);
    this.read(
      "/google",
      ["PUBLIC"],
      passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
        prompt: "select_account",
      })
    );
    this.read("/google/callback", ["PUBLIC"], passportCb("google"), google);
    this.read("/google/failure", ["PUBLIC"], failure);

    // Rutas de cambio de rol
    this.create("/setadmin", ["USER", "ADMIN"], setAdmin);
    this.create("/setuser", ["USER", "ADMIN"], setUser);
  };
}

const authRouter = new AuthRouter();
export default authRouter.getRouter();
