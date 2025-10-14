import { Schema, model, Types } from "mongoose";

const collection = "tickets";

const ticketSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
    products: [
      {
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    cartId: {
      type: Types.ObjectId,
      ref: "carts",
    },
  },
  {
    collection,
    timestamps: true,
  }
);

const Ticket = model(collection, ticketSchema);
export default Ticket;
