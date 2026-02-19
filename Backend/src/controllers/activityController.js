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

    if (!title || !files || files.length === 0 || !description) {
      if (files) {
        files.forEach((file) => fs.unlinkSync(file.path));
      }
      return sendError(
        res,
        "Title, pictures, and description are required",
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
    const id = req.params.id.trim();

    const activity = await Activity.findById(id);

    if (!activity) {
      return sendError(res, "Activity not found", 404);
    }

    sendSuccess(res, activity, "Activity retrieved successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const activity = await Activity.findByIdAndDelete(id);

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
  deleteActivity,
};
