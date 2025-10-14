import { usersManager } from "../dao/mongo.manager.js";
import { createToken } from "../helpers/token.helper.js";

const register = async (req, res) => {
  const user = req.user;
  res.redirect("/login?registroExitoso=true");
};

const login = async (req, res) => {
  const { token, user } = req;
  const opts = { maxAge: 60 * 60 * 24 * 7 * 1000 };
  res.cookie("token", token, opts).redirect("/");
};

const signout = (req, res) => {
  res.clearCookie("token").redirect("/");
};

const online = (req, res) => res.json200("It's online");

const google = async (req, res) => {
  const { token, user } = req;
  const opts = { maxAge: 60 * 60 * 24 * 7 * 1000 };
  res.cookie("token", token, opts).redirect("/");
};

const failure = (req, res) => res.redirect("/login?error=login_failed");

const setAdmin = async (req, res) => {
  try {
    const user = await usersManager.readById(req.user.user_id);
    if (!user) return res.status(404).send("❌ Usuario no encontrado");

    user.role = "ADMIN";
    await user.save();

    const token = createToken({
      user_id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      last_name: user.last_name,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect("/?rol=admin");
  } catch (error) {
    res.status(500).send("❌ No se pudo cambiar el rol.");
  }
};

const setUser = async (req, res) => {
  try {
    const user = await usersManager.readById(req.user.user_id);
    if (!user) return res.status(404).send("❌ Usuario no encontrado");

    user.role = "USER";
    await user.save();

    const token = createToken({
      user_id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      last_name: user.last_name,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect("/?rol=user");
  } catch (error) {
    res.status(500).send("❌ No se pudo cambiar el rol.");
  }
};

export { register, login, signout, online, google, failure, setAdmin, setUser };
