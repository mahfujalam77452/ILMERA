import { sendSuccess, sendError } from "../utils/response.js";
import Picture from "../models/Picture.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

export const addPicture = async (req, res) => {
  try {
    const { category } = req.body;
    const file = req.file;

    if (!category || !file) {
      if (file) fs.unlinkSync(file.path);
      return sendError(res, "Category and picture are required", 400);
    }

    const cloudinaryResult = await uploadToCloudinary(file, "pictures");
    fs.unlinkSync(file.path);

    const picture = await Picture.create({
      category,
      picture_link: cloudinaryResult.url,
      cloudinary_public_id: cloudinaryResult.public_id,
    });

    const populatedPicture = await picture.populate("category");

    sendSuccess(res, populatedPicture, "Picture added successfully", 201);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    sendError(res, error.message, 500);
  }
};

export const getAllPictures = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const category = req.query.category;

    const query = {};
    if (category) {
      query.category = category;
    }

    const pictures = await Picture.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Picture.countDocuments(query);

    sendSuccess(
      res,
      {
        pictures,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Pictures retrieved successfully",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const deletePicture = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const picture = await Picture.findByIdAndDelete(id);

    if (!picture) {
      return sendError(res, "Picture not found", 404);
    }

    if (picture.cloudinary_public_id) {
      await deleteFromCloudinary(picture.cloudinary_public_id);
    }

    sendSuccess(res, {}, "Picture deleted successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  addPicture,
  getAllPictures,
  deletePicture,
};
