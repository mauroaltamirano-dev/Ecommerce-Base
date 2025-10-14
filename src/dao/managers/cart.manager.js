import MongoManager from "./mongo.manager.js";
import Cart from "../models/cart.model.js";

class CartManager extends MongoManager {
  constructor() {
    super(Cart);
  }

  readByIdWithPopulate = async (cid) => {
    return this.model.findById(cid).populate("products.product");
  };
}

export default CartManager;
