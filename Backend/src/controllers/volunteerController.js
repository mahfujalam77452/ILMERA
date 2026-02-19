import { sendSuccess, sendError } from "../utils/response.js";
import Volunteer from "../models/Volunteer.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import rateLimit from "express-rate-limit";
import fs from "fs";

export const volunteerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message:
    "Too many volunteer submissions from this IP, please try again later.",
});

export const addVolunteer = async (req, res) => {
  try {
    const file = req.file;
    const { name, email, country, description, why, motivation, expectation } =
      req.body;

    if (!file) {
      return sendError(res, "Image is required", 400);
    }

    if (
      !name ||
      !email ||
      !country ||
      !description ||
      !why ||
      !motivation ||
      !expectation
    ) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return sendError(
        res,
        "All fields (name, email, country, description, why, motivation, expectation) are required",
        400,
      );
    }

    // Check for duplicate email
    const existingVolunteer = await Volunteer.findOne({ email });

    if (existingVolunteer) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return sendError(res, "Email already registered", 400);
    }

    const cloudinaryResult = await uploadToCloudinary(file, "volunteers");

    // Delete temporary file safely
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (fsError) {
      console.warn(
        `Warning: Could not delete temporary file: ${fsError.message}`,
      );
    }

    const volunteer = await Volunteer.create({
      name,
      email,
      country,
      description,
      why,
      motivation,
      expectation,
      image: cloudinaryResult.url,
      cloudinary_public_id: cloudinaryResult.public_id,
    });

    sendSuccess(res, volunteer, "Volunteer added successfully", 201);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return sendError(res, `${field} already exists`, 400);
    }
    sendError(res, error.message, 500);
  }
};

export const getAllVolunteers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const query = {};

    // Filter by is_member status
    if (req.query.is_member !== undefined) {
      query.is_member = req.query.is_member === "true";
    }

    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search;
      const searchField = req.query.searchField || "name";

      if (searchField === "name") {
        query.name = { $regex: searchTerm, $options: "i" };
      } else if (searchField === "email") {
        query.email = { $regex: searchTerm, $options: "i" };
      } else if (searchField === "country") {
        query.country = { $regex: searchTerm, $options: "i" };
      }
    }

    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Volunteer.countDocuments(query);

    sendSuccess(
      res,
      {
        volunteers,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Volunteers retrieved successfully",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const deleteVolunteer = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const volunteer = await Volunteer.findByIdAndDelete(id);

    if (!volunteer) {
      return sendError(res, "Volunteer not found", 404);
    }

    if (volunteer.cloudinary_public_id) {
      await deleteFromCloudinary(volunteer.cloudinary_public_id);
    }

    sendSuccess(res, {}, "Volunteer deleted successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const setMemberStatus = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { is_member: true },
      { new: true },
    );

    if (!volunteer) {
      return sendError(res, "Volunteer not found", 404);
    }

    sendSuccess(res, volunteer, "Volunteer member status updated", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  addVolunteer,
  getAllVolunteers,
  setMemberStatus,
  deleteVolunteer,
};
