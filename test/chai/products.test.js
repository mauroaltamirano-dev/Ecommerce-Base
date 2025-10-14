import "dotenv/config.js";
import { productsManager } from "../../src/dao/mongo.manager.js";
import dbConnect from "../../src/helpers/dbConnect.helper.js";
import { expect } from "chai";

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
    expect(response).to.have.property("_id");
    expect(response._id).to.be.a("object");
    expect(response).to.have.property("stock");
    expect(response.stock).to.be.a("number");
    expect(response).to.have.property("onsale");
    expect(response.onsale).to.be.a("boolean");
    expect(response).to.have.property("price");
    expect(response.price).to.be.a("number");
    expect(response).to.have.property("description");
    expect(response.description).to.be.a("string");
  });
  it("Se deben leer todos los productos de la base de datos", async () => {
    const response = await productsManager.readAll();
    expect(Array.isArray(response)).to.be.true;
  });
  it("No se deben leer todos los productos de la base de datos cuando mando filter incorrecto", async () => {
    const response = await productsManager.readAll({
      title: "AAAAAA",
    });
    expect(response).to.have.lengthOf(0);
  });
  it("No se debe crear productos con datos incorrectos", async () => {
    try {
      await productsManager.createOne({});
    } catch (error) {
      expect(error).to.have.property("message");
    }
  });
  it("Se debe modificar un producto de la base de datos", async () => {
    const response = await productsManager.updateById(productId, {
      stock: 1000,
    });
    expect(response.stock).to.be.equals(1000);
  });
  it("Se debe eliminar un producto de la db", async () => {
    await productsManager.destroyById(productId);
    const one = await productsManager.readById(productId);
    expect(one).to.be.a("null");
  });
});
