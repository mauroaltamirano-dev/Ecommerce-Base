import "./src/helpers/env.js";
import express from "express";
import path from "path";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import sections from "express-handlebars-sections";
import helpers from "handlebars-helpers";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import moment from "moment";
import cookieParser from "cookie-parser";
import compression from "express-compression";
import cluster from "cluster";
import { cpus } from "os";
import { serve, setup } from "swagger-ui-express";
import swaggerSpecs from "./src/helpers/swagger.helper.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";
import indexRouter from "./src/routers/index.router.js";
import winston from "./src/middlewares/winston.mid.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";
import argvs from "./src/helpers/arguments.helper.js";
import logger from "./src/helpers/logger.helper.js";
import jwt from "jsonwebtoken";

const server = express();
const port = process.env.PORT || 8090;
const ready = async () => {
  logger.INFO(`Server ready on port ${port} and mode ${argvs.mode}`);
  logger.INFO("server ready on pid " + process.pid);
  await dbConnect(process.env.LINK_DB);
};

// 1) config handlebars
const mathHelpers = helpers({
  handlebars: Handlebars,
});

server.engine(
  "handlebars",
  engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      multiply: (a, b) => a * b,
      formatNumber: (value) => {
        if (typeof value !== "number") return "—";
        return value.toLocaleString("es-AR");
      },
      formatDate: (fecha) => moment(fecha).format("DD/MM/YYYY HH:mm:ss") + "hs",
      gt: mathHelpers.gt,
      ifEquals: (a, b, options) =>
        a === b ? options.fn(this) : options.inverse(this),
      section: sections(),
      json: (context) => JSON.stringify(context, null, 2),
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

server.set("view engine", "handlebars");
server.set("views", path.join(__dirname, "src", "views"));

// 2) midds globals
server.use(compression({ brotli: { enable: true, zlib: {} } }));
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(winston);
server.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});
server.use((req, res, next) => {
  const token = req.cookies.token;
  const cid = req.cookies.cid;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      res.locals.usuario = {
        name: decoded.name || "",
        last_name: decoded.last_name || "",
        email: decoded.email,
        role: decoded.role,
      };
      // console.log("🧠 Nuevo token payload:", decoded);
      // console.log(" CID:", cid);
    } catch (e) {
      res.locals.usuario = null;
    }
  } else {
    res.locals.usuario = null;
  }
  next();
});
server.use(express.static(path.join(__dirname, "public")));

// 3) swagger
server.use("/api/docs", serve, setup(swaggerSpecs));

// 4) routers
server.use("/", indexRouter);

// 5) handlers de error
server.use(errorHandler);
server.use(pathHandler);

// 6) cluster y arranque
if (cluster.isPrimary) {
  const numWorkers = cpus().length;
  logger.INFO(`Master ${process.pid} forking ${numWorkers - 1} workers`);
  for (let i = 1; i < numWorkers; i++) {
    cluster.fork();
  }
} else {
  dbConnect(process.env.LINK_DB)
    .then(() => {
      server.listen(port, ready);
    })
    .catch((err) => {
      console.error("❌ Error al conectar a la DB:", err);
    });
}
