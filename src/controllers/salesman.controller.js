import Salesman from "../models/salesman.model.js";
import { resSuccess, handleError } from "../helpers/error-success.js";
import {
  createSalesmanValidator,
  updateSalesmanValidator,
} from "../validations/salesman.validation.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import { isValidObjectId } from "mongoose";

const crypto = new Crypto();

export class SalesmanController {
  async createSalesman(req, res) {
    try {
      const { value, error } = createSalesmanValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const duplicate = await Salesman.findOne({
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
      const salesman = await Salesman.create({
        ...value,
        username: value.username,
        full_name: value.full_name,
        phoneNumber: value.phoneNumber,
        address: value.address,
        email: value.email,
        hashedPassword: hashedPassword,
      });
      salesman.hashedPassword = undefined;
      return resSuccess(res, salesman, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllSalesman(_req, res) {
    try {
      const salesmans = await Salesman.find().populate("product_id");
      salesmans.hashedPassword = undefined;
      return resSuccess(res, salesmans);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getSalesmanById(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const salesman = await Salesman.findById(id)
        .populate("product_id")
        .lean();
      if (!salesman) {
        return handleError(res, "Salesman not found", 404);
      }
      delete salesman.hashedPassword;
      return resSuccess(res, salesman);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateSalesman(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const { value, error } = updateSalesmanValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const salesman = await Salesman.findByIdAndUpdate(
        id,
        {
          ...value,
        },
        { new: true }
      );
      if (!salesman) {
        return handleError(res, "Salesman not found", 404);
      }
      return resSuccess(res, salesman);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async removeSalesman(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const salesman = await Salesman.findByIdAndDelete(id);
      if (!salesman) {
        return handleError(res, "Salesman not found", 404);
      }
      return resSuccess(res, { message: "Salesman deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  }
}
