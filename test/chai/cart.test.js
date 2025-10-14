import "dotenv/config.js";
import { cartsManager, productsManager } from "../../src/dao/mongo.manager.js";
import dbConnect from "../../src/helpers/dbConnect.helper.js";
import { expect } from "chai";

describe("TESTING: Servicio de Productos", () => {
  let productId;
  let cart;
  before(async () => {
    console.log("🧪 Base de datos utilizada:", process.env.LINK_DB);
    await dbConnect(process.env.LINK_DB);

    // Crear un producto real
    const product = await productsManager.createOne({
      title: "producto test carrito",
      code: `cart-${Date.now()}`,
      price: 50,
      stock: 10,
    });
    productId = product._id;
  });
  it("Debe crear un carrito correctamente con un producto", async () => {
    const response = await cartsManager.createOne({
      products: [{ product: productId, quantity: 3 }],
    });

    expect(response).to.have.property("_id");
    expect(response.products).to.be.an("array");
    expect(response.products[0]).to.have.property("product");
    expect(response.products[0].product.toString()).to.equal(
      productId.toString()
    );
    expect(response.products[0].quantity).to.equal(3);

    cart = response;
  });
});
