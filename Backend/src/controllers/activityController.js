import { sendSuccess, sendError } from "../utils/response.js";
import Activity from "../models/Activity.js";
import {
  uploadToCloudinary,
  deleteMultipleFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

export const addActivity = async (req, res) => {
  try {
    const {
      title,
      slug,
      summary,
      video_link,
      project_goals,
      beneficiaries,
      expense_categories,
      project_area,
      duration,
      description,
    } = req.body;

    const files = req.files;

    if (!title || !slug || !files || files.length === 0 || !description) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(
        res,
        "Title, slug, pictures, and description are required",
        400,
      );
    }

    // Upload all pictures to Cloudinary
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, "activities"),
    );
    const uploadResults = await Promise.all(uploadPromises);

    // Clean up temp files
    files.forEach((file) => fs.unlinkSync(file.path));

    const pictures_link_list = uploadResults.map((result) => result.url);
    const cloudinary_public_ids = uploadResults.map(
      (result) => result.public_id,
    );

    const activity = await Activity.create({
      title,
      slug: slug.toLowerCase().trim(),
      summary,
      pictures_link_list,
      cloudinary_public_ids,
      video_link,
      project_goals: project_goals ? JSON.parse(project_goals) : undefined,
      beneficiaries: beneficiaries ? JSON.parse(beneficiaries) : undefined,
      expense_categories: expense_categories
        ? JSON.parse(expense_categories)
        : undefined,
      project_area,
      duration,
      description: JSON.parse(description),
    });

    sendSuccess(res, activity, "Activity added successfully", 201);
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return sendError(res, `Activity ${field} already exists`, 400);
    }
    sendError(res, error.message, 500);
  }
};

export const getAllActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments();

    sendSuccess(
      res,
      {
        activities,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Activities retrieved successfully",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const getActivityById = async (req, res) => {
  try {
    const slug = req.params.id.trim().toLowerCase();

    const activity = await Activity.findOne({ slug });

    if (!activity) {
      return sendError(res, "Activity not found", 404);
    }

    sendSuccess(res, activity, "Activity retrieved successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params; // This is now the slug
    const {
      title,
      slug: newSlug,
      summary,
      video_link,
      project_goals,
      beneficiaries,
      expense_categories,
      project_area,
      duration,
      description,
      existingImages,
    } = req.body;
    const files = req.files || [];

    // Find activity by current slug (id param)
    const activity = await Activity.findOne({ slug: id.toLowerCase().trim() });
    if (!activity) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(res, "Activity not found", 404);
    }

    if (!title) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(res, "Title is required", 400);
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
      cloudinary_public_ids = activity.cloudinary_public_ids.filter(
        (_, index) =>
          parsedExistingImages.includes(activity.pictures_link_list[index]),
      );
    }

    // Upload new images if provided
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file, "activities"),
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
    const imagesToDelete = activity.cloudinary_public_ids.filter(
      (publicId, index) =>
        !parsedExistingImages.includes(activity.pictures_link_list[index]),
    );

    if (imagesToDelete.length > 0) {
      await deleteMultipleFromCloudinary(imagesToDelete);
    }

    // Ensure at least one image remains
    if (pictures_link_list.length === 0) {
      return sendError(res, "Activity must have at least one image", 400);
    }

    // Update activity
    const updatedActivity = await Activity.findByIdAndUpdate(
      activity._id,
      {
        title,
        slug: newSlug ? newSlug.toLowerCase().trim() : activity.slug,
        summary,
        pictures_link_list,
        cloudinary_public_ids,
        video_link,
        project_goals: project_goals ? JSON.parse(project_goals) : undefined,
        beneficiaries: beneficiaries ? JSON.parse(beneficiaries) : undefined,
        expense_categories: expense_categories
          ? JSON.parse(expense_categories)
          : undefined,
        project_area,
        duration,
        description:
          typeof description === "string"
            ? JSON.parse(description)
            : description,
      },
      { new: true, runValidators: true },
    );

    sendSuccess(res, updatedActivity, "Activity updated successfully", 200);
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return sendError(res, `Activity ${field} already exists`, 400);
    }
    sendError(res, error.message, 500);
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const slug = req.params.id.trim().toLowerCase(); // This is now the slug

    const activity = await Activity.findOneAndDelete({ slug });

    if (!activity) {
      return sendError(res, "Activity not found", 404);
    }

    if (
      activity.cloudinary_public_ids &&
      activity.cloudinary_public_ids.length > 0
    ) {
      await deleteMultipleFromCloudinary(activity.cloudinary_public_ids);
    }

    sendSuccess(res, {}, "Activity deleted successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  addActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};
