import { sendSuccess, sendError } from "../utils/response.js";
import Category from "../models/Category.js";

export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return sendError(res, "Category name is required", 400);
    }

    const existingCategory = await Category.findOne({ category });

    if (existingCategory) {
      return sendError(res, "Category already exists", 400);
    }

    const newCategory = await Category.create({ category });

    sendSuccess(res, newCategory, "Category added successfully", 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Category already exists", 400);
    }
    sendError(res, error.message, 500);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Category.countDocuments();

    sendSuccess(
      res,
      {
        data: categories,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Categories retrieved successfully",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return sendError(res, "Category not found", 404);
    }

    sendSuccess(res, {}, "Category deleted successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  addCategory,
  getAllCategories,
  deleteCategory,
};
