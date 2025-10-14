import CustomRouter from "../../helpers/CustomRouter.helper.js";
import { cartsController } from "../../controllers/controller.js";
import cartCustomController from "../../controllers/cart.controller.js";

class CartsRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.create("/", ["PUBLIC"], cartsController.createOne);
    this.read("/", ["PUBLIC"], cartsController.readAll);

    this.read("/:cid", ["PUBLIC"], cartCustomController.readByCid);
    this.read(
      "/:cid/products",
      ["PUBLIC"],
      cartCustomController.readAllProducts
    );

    this.create(
      "/:cid/products/:pid",
      ["PUBLIC"],
      cartCustomController.addProductToCart
    );
    this.destroy(
      "/:cid/products/:pid",
      ["PUBLIC"],
      cartCustomController.deleteOnTheCart
    );
    this.destroy("/:cid", ["PUBLIC"], cartCustomController.cleanCart);
    this.patch(
      "/:cid/products/:pid/increment",
      ["PUBLIC"],
      cartCustomController.incrementQuantity
    );
    this.patch(
      "/:cid/products/:pid/decrement",
      ["PUBLIC"],
      cartCustomController.decrementQuantity
    );
    this.read(
      "/:cid/validate",
      ["USER", "ADMIN"],
      cartCustomController.validate
    );
  };
}

export default new CartsRouter().getRouter();
