import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
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
});

const Category = model("Category", CategorySchema);
export default Category;
