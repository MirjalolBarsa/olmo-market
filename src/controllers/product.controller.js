import Product from "../models/product.model.js";
import { resSuccess, handleError } from "../helpers/error-success.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../validations/product.validation.js";
import { isValidObjectId } from "mongoose";

export class ProductController {
  async createProduct(req, res) {
    try {
      const { value, error } = createProductValidator(req.body);
      if (error) {
        return handleError(res, error);
      }
      const existsName = await Product.findOne({ name: value.name });
      if (existsName) {
        return handleError(res, "This name product already exists", 409);
      }
      const product = await Product.create({
        ...value,
        description: value.description,
        price: value.price,
        quantity: value.quantity,
        color: value.color,
        category_id: value.category_id,
        salesman_id: value.salesman_id,
      });
      return resSuccess(res, product, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllProduct(_req, res) {
    try {
      const products = await Product.find()
        .populate("salesman_id")
        .populate("category_id");
      return resSuccess(res, products);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getProductById(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }

      const product = await Product.findById(id)
        .populate("salesman_id")
        .populate("category_id");
      if (!product) {
        return handleError(res, "Product not found", 404);
      }
      return resSuccess(res, product);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const { value, error } = updateProductValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }

      const updateProduct = await Product.findByIdAndUpdate(
        id,
        {
          ...value,
        },
        { new: true }
      );
      if (!updateProduct) {
        return handleError(res, "Product not found", 404);
      }
      return resSuccess(res, updateProduct);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async removeProduct(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return handleError(res, "Product not found", 404);
      }
      return handleError(res, { message: "Product deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  }
}
