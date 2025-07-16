import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    reuired: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    reuired: true,
    trim: true,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  salesman_id: {
    type: Schema.Types.ObjectId,
    ref: "Salesman",
    required: true,
  },
});

const Product = model("Product", ProductSchema);
export default Product;
