import { Schema, Types, model } from "mongoose";

const collection = "carts";
const schema = new Schema({
  products: [
    {
      product: {
        type: Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = model(collection, schema);
export default Cart;
