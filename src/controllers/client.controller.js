import Client from "../models/client.model.js";
import { resSuccess, handleError } from "../helpers/error-success.js";
import {
  confirmSignInClientValidator,
  createClientValidator,
  signInClientValidator,
  signUpClientValidator,
  updateClientValidator,
} from "../validations/client.validation.js";
import { Token } from "../utils/token-service.js";
import { generateOTP } from "../helpers/otp-generate.js";
import config from "../config/index.js";
import { isValidObjectId } from "mongoose";
import { transporter } from "../helpers/send-mail.js";
import NodeCache from "node-cache";

const token = new Token();
const cache = new NodeCache();

export class ClientController {
  async createClient(req, res) {
    try {
      const { value, error } = createClientValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const isEmail = await Client.findOne({ email: value.email });
      if (isEmail) {
        return handleError(res, "This Email already exists", 409);
      }
      const client = await Client.create({
        ...value,
        full_name: value.full_name,
        email: value.email,
      });
      return resSuccess(res, client, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async signUp(req, res) {
    try {
      const { value, error } = signUpClientValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const existEmail = await Client.findOne({ email: value.email });
      if (existEmail) {
        return handleError(res, "Email already registered", 409);
      }

      const client = await Client.create({
        ...value,
        full_name: value.full_name,
        email: value.email,
      });
      const payload = { id: client._id };

      const accessToken = await token.generateAccessToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);

      res.cookie("refreshTokenClient", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return resSuccess(
        res,
        {
          data: client,
          token: accessToken,
        },
        201
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async sigIn(req, res) {
    try {
      const { value, error } = signInClientValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }

      const email = value.email;
      const client = await Client.findOne({ email });
      if (!client) {
        return handleError(res, "Email or password is incorrect", 404);
      }

      const otp = generateOTP();

      const mailOptions = {
        from: config.MAIL_USER,
        to: email,
        subject: "Olmo.uz",
        text: otp,
      };

      // ⚠️ sendMail hatolik bo‘lsa throw qiladi
      const info = await transporter.sendMail(mailOptions);
      console.log(info);

      cache.set(email, otp, 120);

      return resSuccess(res, {
        message: "OTP sent to email successfully",
      });
    } catch (error) {
      console.error(error); // <-- log uchun foydali
      return handleError(res, "Error sending email", 500); // yoki error o‘zini qaytarish ham mumkin
    }
  }

  async confirmSignIn(req, res) {
    try {
      const { value, error } = confirmSignInClientValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const client = await Client.findOne({ email: value.email });
      if (!client) {
        return handleError(res, "Client not found", 404);
      }

      const cacheOTP = cache.get(value.email);
      if (!cacheOTP || cacheOTP != value.otp) {
        return handleError(res, "OTP expired", 400);
      }
      const payload = { id: client.id };
      const accessToken = await token.generateAccessToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenClient", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return resSuccess(
        res,
        {
          data: client,
          token: accessToken,
        },
        201
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async newAccessToken(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenClient;
      if (!refreshToken) {
        return handleError(res, "RefreshToken expired", 400);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 404);
      }

      const client = await Client.findById(decodedToken.id);
      if (!client) {
        return handleError(res, "Client not found", 404);
      }

      const payload = { id: client.id };
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
      const refreshToken = req.cookies?.refreshTokenClient;
      if (!refreshToken) {
        return handleError(res, "Refresh Token expired", 400);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.ACCESS_TOKEN_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid Token", 400);
      }
      const client = await Client.findById(decodedToken.id);
      if (!client) {
        return handleError(res, "Client not found", 404);
      }
      res.clearCookie("refreshTokenClient");
      return resSuccess(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllClient(_req, res) {
    try {
      const clients = await Client.find();
      return resSuccess(res, clients);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getClientById(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Object Id", 400);
      }

      const client = await Client.findById(id).lean();
      if (!client) {
        return handleError(res, "Client not found", 404);
      }
      delete client.hashedPassword;
      return resSuccess(res, client);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateClient(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const { value, error } = updateClientValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }

      const client = await Client.findByIdAndUpdate(
        id,
        {
          ...value,
        },
        { new: true }
      ).lean();
      if (!client) {
        return handleError(res, "Client not found", 404);
      }
      return resSuccess(res, client);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async removeClient(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }

      const client = await Client.findByIdAndDelete(id).lean();
      if (!client) {
        return handleError(res, "Client not found", 404);
      }
      return resSuccess(res, { message: "Client deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  }
}
