import { Router } from "express";
import productsRouter from "./api/products.router.js";
import mocksRouter from "./api/mocks.router.js";
import usersRouter from "./api/users.router.js";
import authRouter from "./api/auth.router.js";
import cartsRouter from "./api/carts.router.js";
import ticketsRouter from "./api/tickets.router.js";
import sessionsRouter from "./api/sessions.router.js";
import { sumar } from "calculator-tuki-backend";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/sessions", sessionsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/carts", cartsRouter);
apiRouter.use("/mocks", mocksRouter);
apiRouter.use("/tickets", ticketsRouter);
apiRouter.get("/sumar/:n1/:n2", (req, res) => {
  const { n1, n2 } = req.params;
  res.status(200).json({ result: sumar(n1, n2) });
});
apiRouter.get("/sumar/pocos", (req, res) => {
  let total = 1;
  for (let i = 1; i < 100; i++) {
    total = total + i * i;
  }
  res.json({ total });
});
apiRouter.get("/sumar/muchos", (req, res) => {
  let total = 1;
  for (let i = 1; i < 10000000; i++) {
    total = total + i * i;
  }
  res.json({ total });
});

export default apiRouter;
