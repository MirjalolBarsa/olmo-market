import { Schema, model } from "mongoose";

const SalesmanSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    reuired: true,
    trim: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    trim: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

const Salesman = model("Salesman", SalesmanSchema);
export default Salesman;
