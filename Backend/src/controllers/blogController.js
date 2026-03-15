import { sendSuccess, sendError } from "../utils/response.js";
import Blog from "../models/Blog.js";
import {
  uploadToCloudinary,
  deleteMultipleFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

export const addBlog = async (req, res) => {
  try {
    const { date, title, slug, description } = req.body;

    const files = req.files;

    if (
      !date ||
      !title ||
      !slug ||
      !files ||
      files.length === 0 ||
      !description
    ) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(
        res,
        "Date, title, slug, pictures, and description are required",
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
      slug: slug.toLowerCase().trim(),
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
      const field = Object.keys(error.keyPattern)[0];
      if (field === "slug") {
        return sendError(res, "Blog slug already exists", 400);
      }
      return sendError(res, `Blog ${field} already exists`, 400);
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
export const getBlogById = async (req, res) => {
  try {
    const slug = req.params.id.trim().toLowerCase();

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return sendError(res, "Blog not found", 404);
    }

    sendSuccess(res, blog, "Blog retrieved successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params; // This is now the slug
    const {
      date,
      title,
      slug: newSlug,
      description,
      existingImages,
    } = req.body;
    const files = req.files || [];

    // Find blog by current slug (id param)
    const blog = await Blog.findOne({ slug: id.toLowerCase().trim() });
    if (!blog) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(res, "Blog not found", 404);
    }

    // Validate required fields
    if (!date || !title) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(res, "Date and title are required", 400);
    }

    // Parse existingImages if it's a string
    let parsedExistingImages = [];
    if (existingImages) {
      parsedExistingImages =
        typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;
    }

    // Handle image updates
    let pictures_link_list = parsedExistingImages;
    let cloudinary_public_ids = [];

    // Extract public IDs from existing images that are kept
    if (parsedExistingImages && parsedExistingImages.length > 0) {
      cloudinary_public_ids = blog.cloudinary_public_ids.filter((_, index) =>
        parsedExistingImages.includes(blog.pictures_link_list[index]),
      );
    }

    // Upload new images if provided
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file, "blogs"),
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Clean up temp files
      files.forEach((file) => fs.unlinkSync(file.path));

      const newPictureLinks = uploadResults.map((result) => result.url);
      const newPublicIds = uploadResults.map((result) => result.public_id);

      pictures_link_list = [...parsedExistingImages, ...newPictureLinks];
      cloudinary_public_ids = [...cloudinary_public_ids, ...newPublicIds];
    }

    // Delete images that were removed
    const imagesToDelete = blog.cloudinary_public_ids.filter(
      (publicId, index) =>
        !parsedExistingImages.includes(blog.pictures_link_list[index]),
    );

    if (imagesToDelete.length > 0) {
      await deleteMultipleFromCloudinary(imagesToDelete);
    }

    // Ensure at least one image remains
    if (pictures_link_list.length === 0) {
      return sendError(res, "Blog must have at least one image", 400);
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      {
        date: new Date(date),
        title,
        slug: newSlug ? newSlug.toLowerCase().trim() : blog.slug,
        pictures_link_list,
        cloudinary_public_ids,
        description:
          typeof description === "string"
            ? JSON.parse(description)
            : description,
      },
      { new: true, runValidators: true },
    );

    sendSuccess(res, updatedBlog, "Blog updated successfully", 200);
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return sendError(res, `Blog ${field} already exists`, 400);
    }
    sendError(res, error.message, 500);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const slug = req.params.id.trim().toLowerCase(); // This is now the slug

    const blog = await Blog.findOneAndDelete({ slug });

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
  getBlogById,
  updateBlog,
  deleteBlog,
};
