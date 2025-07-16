import { Schema, model } from "mongoose";

const soldProductSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  client_id: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: String,
    required: true,
  },
});

const SoldProduct = model("SoldProduct", soldProductSchema);
export default SoldProduct;
