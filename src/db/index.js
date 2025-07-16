import config from "../config/index.js";
import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(config.MONGO_URI);
    console.log(`Database connected successfully`);
  } catch (error) {
    console.log(`Error on connecting database ${error}`);
  }
};
