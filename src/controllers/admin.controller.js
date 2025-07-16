import Admin from "../models/admin.model.js";
import { resSuccess, handleError } from "../helpers/error-success.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import {
  createAdminValidator,
  updateAdminValidator,
  signInAdminValidator,
} from "../validations/admin.validation.js";
import { isValidObjectId } from "mongoose";
import { transporter } from "../helpers/send-mail.js";
import { generateOTP } from "../helpers/otp-generate.js";
import { Token } from "../utils/token-service.js";
import config from "../config/index.js";

const crypto = new Crypto();
const token = new Token();

export class AdminController {
  async createAdmin(req, res) {
    try {
      const { value, error } = createAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const duplicate = await Admin.findOne({
        $or: [
          { username: value.username },
          { phoneNumber: value.phoneNumber },
          { email: value.email },
        ],
      });

      if (duplicate) {
        if (duplicate.username === value.username) {
          return handleError(res, "Username already exists", 409);
        }
        if (duplicate.phoneNumber === value.phoneNumber) {
          return handleError(res, "PhoneNumber already exists", 409);
        }
        if (duplicate.email === value.email) {
          return handleError(res, "Email already exists", 409);
        }
      }
      const hashedPassword = await crypto.encrypt(value.password);
      const admin = await Admin.create({
        username: value.username,
        email: value.email,
        phoneNumber: value.phoneNumber,
        hashedPassword: hashedPassword,
      });
      admin.hashedPassword = undefined;
      return resSuccess(res, admin, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async signIn(req, res) {
    try {
      const { value, error } = signInAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const admin = await Admin.findOne({ username: value.username });
      if (!admin) {
        return handleError(res, "@Username or password incorrect", 400);
      }

      const isPassword = await crypto.compare(
        value.password,
        admin.hashedPassword
      );
      if (!isPassword) {
        return handleError(res, "@Username or password incorrect", 400);
      }
      const payload = { id: admin._id, role: admin.role };
      const accessToken = await token.generateAccessToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenAdmin", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return resSuccess(
        res,
        {
          data: admin,
          token: accessToken,
        },
        200
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async newAccessToken(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenAdmin;
      if (!refreshToken) {
        return handleError(res, "Token has expired", 401);
      }

      const decodedToken = await token.verifyToken(
        refreshToken,
        config.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid Token", 401);
      }

      const admin = await AdminController.findAdminById(res, decodedToken.id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }

      const payload = { id: admin._id, role: admin.role };
      const accessToken = await token.generateAccessToken(payload);

      return resSuccess(res, {
        token: accessToken,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async logOut(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenAdmin;
      if (!refreshToken) {
        return handleError(res, "Token has expired", 401);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 401);
      }
      const admin = await Admin.findById(decodedToken.id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      res.clearCookie("refreshTokenAdmin");
      return resSuccess(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllAdmin(_req, res) {
    try {
      const admins = await Admin.find();
      return resSuccess(res, admins);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAdminById(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const admin = await Admin.findById(id).lean();
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      delete admin.hashedPassword;
      return resSuccess(res, admin);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateAdmin(req, res) {
    try {
      const id = req.params.id;

      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object ID", 400);
      }
      const { value, error } = updateAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const admin = await Admin.findById(id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      let hashedPassword = admin.hashedPassword;
      if (value.password) {
        hashedPassword = await crypto.encrypt(value.password);
      }
      const updateAdmin = await Admin.findByIdAndUpdate(
        id,
        {
          ...value,
          hashedPassword,
        },
        { new: true }
      );
      return resSuccess(res, updateAdmin);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async removeAdmin(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const admin = await Admin.findById(id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      await Admin.findByIdAndDelete(id);
      return resSuccess(res, { message: "Admin deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async findAdminById(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Object Id", 400);
      }
      const admin = await Admin.findById(id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      return admin;
    } catch (error) {
      return handleError(res, error);
    }
  }
}
