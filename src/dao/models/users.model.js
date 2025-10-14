import { Schema, model, Types } from "mongoose";

const collection = "users";

const userSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      index: true,
    },
    googleId: {
      type: String,
      required: function () {
        return this.provider === "google";
      },
    },
    name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://miro.medium.com/v2/resize:fit:640/format:webp/1*W35QUSvGpcLuxPo3SRTH4w.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "PREM"],
      default: "USER",
      index: true,
    },
  },
  {
    collection,
    timestamps: true,
  }
);

export default model(collection, userSchema);
