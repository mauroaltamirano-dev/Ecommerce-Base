import CustomRouter from "../../helpers/CustomRouter.helper.js";

class SessionRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.read("/current", ["USER", "ADMIN"], this.currentSession);
  };

  currentSession = async (req, res) => {
    if (!req.user)
      return res.status(401).json({ error: "Usuario no autenticado" });

    const { _id, email, name, last_name, role } = req.user;
    res.json200({ _id, email, name, last_name, role });
  };
}

const sessionRouter = new SessionRouter();

export default sessionRouter.getRouter();
