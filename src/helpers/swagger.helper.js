import swaggerJsDoc from "swagger-jsdoc";
import __dirname from "../../utils.js";

const opts = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "CODER BACKEND III TUKI",
      description: "Documentación de la API de CoderBackend",
    },
  },
  apis: [__dirname + "/src/docs/*.yaml"],
};
const swaggerSpecs = swaggerJsDoc(opts);

export default swaggerSpecs;
