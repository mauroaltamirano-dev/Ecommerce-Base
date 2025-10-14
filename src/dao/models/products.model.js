import { Schema, Types, model } from "mongoose";

// Nombre de la colección en MongoDB
const collection = "products";

// Definición de los valores permitidos para la categoría
const categoryEnum = [
  "Tablets",
  "Smartphones",
  "Laptops",
  "Smartwatches",
  "Headphones",
  "Speakers",
  "Desktops",
  "Streaming Devices",
  "Keyboards",
  "Accessories",
  "Virtual Reality",
  "Fitness",
  "Cameras",
  "Gaming",
  "Televisions",
  "Soundbars",
];

const productSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: categoryEnum,
      default: "Laptops",
      index: true,
    },
    image: {
      type: String,
      required: true,
      default:
        "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-60nw-1552421075.jpg",
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    code: { type: String, required: true, unique: true, index: true },
    onsale: { type: Boolean, default: false },
    owner_id: { type: Types.ObjectId, ref: "users", index: true },
  },
  {
    collection,
    timestamps: true,
  }
);

productSchema.pre(/^find/, function () {
  this.populate("owner_id", "email avatar");
});

const Product = model("Product", productSchema);
export default Product;
