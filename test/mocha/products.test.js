import "dotenv/config.js";
import assert from "assert";
import { productsManager } from "../../src/dao/mongo.manager.js";
import dbConnect from "../../src/helpers/dbConnect.helper.js";
import logger from "../../src/helpers/logger.helper.js";

describe("TESTING: Servicio de Productos", () => {
  let productId;
  before(async () => {
    console.log("🧪 Base de datos utilizada:", process.env.LINK_DB);
    console.log("🧪 PORT utilizado:", process.env.PORT);
    await dbConnect(process.env.LINK_DB);
  });

  it("Se debe crear un producto correctamente", async () => {
    const response = await productsManager.createOne({
      title: "producto de prueba",
      code: 1421253,
      price: 20,
      stock: 10,
    });
    productId = response._id;
    assert.ok(response._id);
  });
  //   it("Se debe crear un producto con stock correcto", async () => {
  //     const response = await productsManager.createOne({
  //       title: "producto de prueba",
  //       code: 123,
  //       price: 20,
  //     });
  //     assert.ok(response.stock === 0);
  //   });
  //   it("Se debe crear un producto con stock tipo numérico", async () => {
  //     const response = await productsManager.createOne({
  //       title: "producto de prueba",
  //       code: 123,
  //       price: 20,
  //       stock: 20,
  //     });
  //     assert.ok(typeof response.stock === "number");
  //   });
  //   it("Se debe crear un producto con el precio correcto", async () => {
  //     const response = await productsManager.createOne({
  //       title: "producto de prueba",
  //       code: 123,
  //       price: 20,
  //     });
  //     assert.ok(response.price);
  //   });
  //   it("Se debe crear un producto con el precio tipo numérico", async () => {
  //     const response = await productsManager.createOne({
  //       title: "producto de prueba",
  //       code: 123,
  //       price: 200,
  //     });
  //     assert.ok(typeof response.price === "number");
  //   });
  //   it("Se debe crear un producto con oferta correcta", async () => {
  //     const response = await productsManager.createOne({
  //       title: "producto de prueba",
  //       code: 123,
  //       price: 20,
  //     });
  //     assert.ok(response.onsale === false);
  //   });
  //   it("Se debe crear un producto con oferta tipo boolean", async () => {
  //     const response = await productsManager.createOne({
  //       title: "producto de prueba",
  //       code: 123,
  //       price: 20,
  //     });
  //     assert.ok(typeof response.onsale === "boolean");
  //   });
  //   it("Se no debe crear productos con datos incorrectos", async () => {
  //     try {
  //       await productsManager.createOne({});
  //     } catch (error) {
  //       assert.ok(error.message);
  //     }
  //   });
  it("Se deben leer todos los productos de la base de datos", async () => {
    const response = await productsManager.readAll();
    assert.ok(response.length > 0);
  });
  it("No se deben leer todos los productos de la base de datos cuando mando filter incorrecto", async () => {
    const response = await productsManager.readAll({
      title: "AAAAAA",
    });
    assert.ok(response.length === 0);
  });
  it("Se debe leer un producto de la db", async () => {
    const response = await productsManager.readById(productId);
    assert.ok(response._id);
  });
  it("Se debe modificar un producto de la base de datos", async () => {
    const response = await productsManager.updateById(productId, {
      stock: 1000,
    });
    assert.strictEqual(response.stock, 1000);
  });
  it("Se debe eliminar un producto de la db", async () => {
    const response = await productsManager.destroyById(productId);
    const one = await productsManager.readById(productId);
    assert.ok(one === null);
  });
});
