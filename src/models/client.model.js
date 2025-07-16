import { Schema, model } from "mongoose";

const ClientSchema = new Schema({
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
});

const Client = model("Client", ClientSchema);
export default Client;
