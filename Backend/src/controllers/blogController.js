import { sendSuccess, sendError } from "../utils/response.js";
import Blog from "../models/Blog.js";
import {
  uploadToCloudinary,
  deleteMultipleFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

export const addBlog = async (req, res) => {
  try {
    const { date, title, description } = req.body;
   
    const files = req.files;

    if (!date || !title || !files || files.length === 0 || !description) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(
        res,
        "Date, title, pictures, and description are required",
        400,
      );
    }

    // Upload all pictures to Cloudinary
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, "blogs"),
    );
    const uploadResults = await Promise.all(uploadPromises);

    // Clean up temp files
    files.forEach((file) => fs.unlinkSync(file.path));

    const pictures_link_list = uploadResults.map((result) => result.url);
    const cloudinary_public_ids = uploadResults.map(
      (result) => result.public_id,
    );

    const blog = await Blog.create({
      date: new Date(date),
      title,
      pictures_link_list,
      cloudinary_public_ids,
      description: JSON.parse(description),
    });

    sendSuccess(res, blog, "Blog added successfully", 201);
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    if (error.code === 11000) {
      return sendError(res, "Blog title already exists", 400);
    }
    sendError(res, error.message, 500);
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments();

    sendSuccess(
      res,
      {
        blogs,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Blogs retrieved successfully",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return sendError(res, "Blog not found", 404);
    }

    if (blog.cloudinary_public_ids && blog.cloudinary_public_ids.length > 0) {
      await deleteMultipleFromCloudinary(blog.cloudinary_public_ids);
    }

    sendSuccess(res, {}, "Blog deleted successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  addBlog,
  getAllBlogs,
  deleteBlog,
};
