import CurrentProject from "../models/CurrentProject.js";
import mongoose from "mongoose";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

// 1️⃣ GET current project (singleton)
export const getCurrentProject = async (req, res) => {
  try {
    let project = await CurrentProject.findOne();

    if (!project) {
      return res.status(404).json({ message: "No current project set" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ UPDATE current project (singleton)
export const updateCurrentProject = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    // 🔥 Parse JSON fields manually (form-data sends them as strings)
    let parsedTitle = undefined;
    let sections = undefined;

    if (req.body.title) {
      try {
        parsedTitle = JSON.parse(req.body.title);
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

    // Get existing project
    let project = await CurrentProject.findOne();

    let imageUrl = project?.image || null;
    let publicId = project?.cloudinary_public_id || null;

    // Upload new image if provided
    if (file) {
      const cloudinaryResult = await uploadToCloudinary(
        file,
        "current-project",
      );

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
      if (project?.cloudinary_public_id) {
        await deleteFromCloudinary(project.cloudinary_public_id);
      }
      publicId = cloudinaryResult.public_id;
    }

    const updateData = {};

    if (parsedTitle) {
      updateData.title = parsedTitle;
    }
    if (sections) {
      updateData.sections = sections;
    }
    if (imageUrl) {
      updateData.image = imageUrl;
      updateData.cloudinary_public_id = publicId;
    }

    if (Object.keys(updateData).length === 0 && !file) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    // If project exists, update it; otherwise create new one
    let updatedProject;
    if (project) {
      updatedProject = await CurrentProject.findByIdAndUpdate(
        project._id,
        updateData,
        { new: true, runValidators: true },
      );
    } else {
      if (!imageUrl || !parsedTitle) {
        if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return res.status(400).json({
          message: "Image and title are required for first creation",
        });
      }
      updatedProject = await CurrentProject.create({
        image: imageUrl,
        cloudinary_public_id: publicId,
        title: parsedTitle,
        sections: sections || [],
      });
    }

    res.status(200).json(updatedProject);
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
