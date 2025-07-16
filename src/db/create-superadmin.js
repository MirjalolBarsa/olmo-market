import Admin from "../models/admin.model.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import config from "../config/index.js";

const crypto = new Crypto();

export const CreateSuperadmin = async () => {
  try {
    const existsSuperadmin = await Admin.findOne({ role: "superadmin" });
    if (!existsSuperadmin) {
      const hashedPassword = await crypto.encrypt(config.SUPERADMIN_PASSWORD);
      await Admin.create({
        username: config.SUPERADMIN_USERNAME,
        email: config.SUPERADMIN_EMAIL,
        phoneNumber: config.SUPERADMIN_PHONENUMBER,
        hashedPassword,
        role: "superadmin",
        is_active: true,
      });
      console.log(`Superadmin created successfully`);
    }
  } catch (error) {
    console.log(`Error on creating superadmin ${error}`);
  }
};
