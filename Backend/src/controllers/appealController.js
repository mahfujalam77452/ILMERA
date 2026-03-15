import Appeal from "../models/Appeal.js";
import mongoose from "mongoose";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

// 1️⃣ GET full object by slug
export const getAppealById = async (req, res) => {
  try {
    const { id } = req.params; // This is now the slug

    const appeal = await Appeal.findOne({ slug: id.toLowerCase().trim() });

    if (!appeal) {
      return res.status(404).json({ message: "Appeal not found" });
    }

    res.status(200).json(appeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ GET all appeals (only appeal + image) - Latest to Oldest
export const getAllAppealsBasic = async (req, res) => {
  try {
    const appeals = await Appeal.find().select().sort({ createdAt: -1 }); // Latest first

    res.status(200).json(appeals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ POST create new appeal
export const createAppeal = async (req, res) => {
  try {
    const { appeal, slug } = req.body;
    const file = req.file;

    if (!appeal || !slug || !file) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({
        message: "Appeal name, slug, and image file are required",
      });
    }

    // 🔥 Parse JSON fields manually (form-data sends them as strings)
    let title, sections;
    try {
      title = JSON.parse(req.body.title);
      sections = JSON.parse(req.body.sections);
    } catch (parseError) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({
        message: "Invalid JSON format for title or sections",
      });
    }

    if (!title || !sections) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({
        message: "Title and sections are required",
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file, "appeals");

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

    const newAppeal = new Appeal({
      appeal,
      slug: slug.toLowerCase().trim(),
      image: cloudinaryResult.url,
      cloudinary_public_id: cloudinaryResult.public_id,
      title,
      sections,
    });

    const savedAppeal = await newAppeal.save();

    res.status(201).json(savedAppeal);
  } catch (error) {
    // Safe cleanup
    try {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (fsError) {
      console.warn(
        `Warning: Could not delete temporary file: ${fsError.message}`,
      );
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `Appeal ${field} already exists` });
    }
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ DELETE appeal by slug
export const deleteAppeal = async (req, res) => {
  try {
    const { id } = req.params; // This is now the slug

    const appeal = await Appeal.findOneAndDelete({
      slug: id.toLowerCase().trim(),
    });

    if (!appeal) {
      return res.status(404).json({ message: "Appeal not found" });
    }

    // Delete image from Cloudinary
    if (appeal.cloudinary_public_id) {
      await deleteFromCloudinary(appeal.cloudinary_public_id);
    }

    res.status(200).json({
      message: "Appeal deleted successfully",
      deletedAppeal: appeal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5️⃣ UPDATE appeal by slug
export const updateAppeal = async (req, res) => {
  try {
    const { id } = req.params; // This is now the slug
    const { appeal, slug: newSlug } = req.body;
    const file = req.file;

    const existingAppeal = await Appeal.findOne({
      slug: id.toLowerCase().trim(),
    });

    if (!existingAppeal) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(404).json({ message: "Appeal not found" });
    }

    // 🔥 Parse JSON fields manually (form-data sends them as strings)
    let title = existingAppeal.title;
    let sections = existingAppeal.sections;

    if (req.body.title) {
      try {
        title = JSON.parse(req.body.title);
      } catch (parseError) {
        if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return res.status(400).json({
          message: "Invalid JSON format for title",
        });
      }
    }

    if (req.body.sections) {
      try {
        sections = JSON.parse(req.body.sections);
      } catch (parseError) {
        if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return res.status(400).json({
          message: "Invalid JSON format for sections",
        });
      }
    }

    let imageUrl = existingAppeal.image;
    let publicId = existingAppeal.cloudinary_public_id;

    // Upload new image if provided
    if (file) {
      const cloudinaryResult = await uploadToCloudinary(file, "appeals");

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

      imageUrl = cloudinaryResult.url;

      // Delete old image from Cloudinary
      if (existingAppeal.cloudinary_public_id) {
        await deleteFromCloudinary(existingAppeal.cloudinary_public_id);
      }
      publicId = cloudinaryResult.public_id;
    }

    const updatedAppeal = await Appeal.findByIdAndUpdate(
      existingAppeal._id,
      {
        ...(appeal && { appeal }),
        slug: newSlug ? newSlug.toLowerCase().trim() : existingAppeal.slug,
        image: imageUrl,
        cloudinary_public_id: publicId,
        title,
        sections,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedAppeal);
  } catch (error) {
    // Safe cleanup
    try {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (fsError) {
      console.warn(
        `Warning: Could not delete temporary file: ${fsError.message}`,
      );
    }
    res.status(500).json({ message: error.message });
  }
};
