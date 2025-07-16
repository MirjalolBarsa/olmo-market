import Category from "../models/category.model.js";
import { resSuccess, handleError } from "../helpers/error-success.js";

import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validations/category.validation.js";
import { isValidObjectId } from "mongoose";

export class CategoryController {
  async createCategory(req, res) {
    try {
      const { value, error } = createCategoryValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const existsName = await Category.findOne({ name: value.name });
      if (existsName) {
        return handleError(res, "Category already exists", 409);
      }

      const category = await Category.create({
        ...value,
      });
      return resSuccess(res, category, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllCategories(_req, res) {
    try {
      const categories = await Category.find();
      return resSuccess(res, categories);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getCategoryById(req, res) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Object Id", 400);
      }
      const category = await Category.findById(id);
      if (!category) {
        return handleError(res, "Category not found", 404);
      }
      return resSuccess(res, category);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;

      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }
      const { value, error } = updateCategoryValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }

      const category = await Category.findByIdAndUpdate(
        id,
        {
          name: value.name,
          description: value.description,
        },
        { new: true }
      );
      if (!category) {
        return handleError(res, "Category not found", 404);
      }
      return resSuccess(res, category);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async removeCategory(req, res) {
    try {
      const id = req.params.id;

      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid object Id", 400);
      }

      const category = await Category.findById(id);
      if (!category) {
        return handleError(res, "Category not found", 404);
      }
      await Category.findByIdAndDelete(id);
      return resSuccess(res, { message: "Category deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  }
}
