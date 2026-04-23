import Appeal from "../models/Appeal.js";
import mongoose from "mongoose";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

const getUploadedFiles = (files, fieldName) => {
  if (!files || !files[fieldName]) return [];
  return Array.isArray(files[fieldName]) ? files[fieldName] : [files[fieldName]];
};

const cleanupTempFiles = (files = []) => {
  files.forEach((file) => {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  return JSON.parse(value);
};

const attachSectionImages = async ({ sections, sectionFiles, existingSections }) => {
  const existingById = new Map(
    (existingSections || []).map((section) => [String(section._id), section]),
  );

  const finalSections = [];
  let fileIndex = 0;

  for (const section of sections) {
    const normalized = {
      ...section,
      image: section.image ?? null,
      cloudinary_public_id: section.cloudinary_public_id ?? null,
    };

    const existingSection = section._id
      ? existingById.get(String(section._id))
      : null;

    const shouldAttachImage =
      section.type === "paragraph" && Boolean(section.hasImage);
    const file = shouldAttachImage ? sectionFiles[fileIndex] : null;

    if (file) {
      const uploadResult = await uploadToCloudinary(file, "appeal-sections");

      if (
        existingSection?.cloudinary_public_id &&
        existingSection.cloudinary_public_id !== uploadResult.public_id
      ) {
        await deleteFromCloudinary(existingSection.cloudinary_public_id);
      }

      normalized.image = uploadResult.url;
      normalized.cloudinary_public_id = uploadResult.public_id;
      fileIndex += 1;
    } else if (existingSection) {
      normalized.image = existingSection.image || normalized.image;
      normalized.cloudinary_public_id =
        existingSection.cloudinary_public_id || normalized.cloudinary_public_id;
    }

    delete normalized.hasImage;
    delete normalized.imageFile;
    delete normalized.imagePreview;

    finalSections.push(normalized);
  }

  return { finalSections };
};

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
    const mainImageFile = getUploadedFiles(req.files, "image")[0];
    const sectionFiles = getUploadedFiles(req.files, "sectionImages");

    if (!appeal || !slug || !mainImageFile) {
      cleanupTempFiles([mainImageFile, ...sectionFiles]);
      return res.status(400).json({
        message: "Appeal name, slug, and image file are required",
      });
    }

    // 🔥 Parse JSON fields manually (form-data sends them as strings)
    let title, sections;
    try {
      title = parseJsonField(req.body.title, null);
      sections = parseJsonField(req.body.sections, []);
    } catch (parseError) {
      cleanupTempFiles([mainImageFile, ...sectionFiles]);
      return res.status(400).json({
        message: "Invalid JSON format for title or sections",
      });
    }

    if (!title || !sections) {
      cleanupTempFiles([mainImageFile, ...sectionFiles]);
      return res.status(400).json({
        message: "Title and sections are required",
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(mainImageFile, "appeals");
    const { finalSections } = await attachSectionImages({
      sections,
      sectionFiles,
    });

    cleanupTempFiles([mainImageFile, ...sectionFiles]);

    const newAppeal = new Appeal({
      appeal,
      slug: slug.toLowerCase().trim(),
      image: cloudinaryResult.url,
      cloudinary_public_id: cloudinaryResult.public_id,
      title,
      sections: finalSections,
    });

    const savedAppeal = await newAppeal.save();

    res.status(201).json(savedAppeal);
  } catch (error) {
    // Safe cleanup
    try {
      cleanupTempFiles([
        ...getUploadedFiles(req.files, "image"),
        ...getUploadedFiles(req.files, "sectionImages"),
      ]);
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
    const mainImageFile = getUploadedFiles(req.files, "image")[0];
    const sectionFiles = getUploadedFiles(req.files, "sectionImages");

    const existingAppeal = await Appeal.findOne({
      slug: id.toLowerCase().trim(),
    });

    if (!existingAppeal) {
      cleanupTempFiles([mainImageFile, ...sectionFiles]);
      return res.status(404).json({ message: "Appeal not found" });
    }

    // 🔥 Parse JSON fields manually (form-data sends them as strings)
    let title = existingAppeal.title;
    let sections = existingAppeal.sections;

    if (req.body.title) {
      try {
        title = parseJsonField(req.body.title, existingAppeal.title);
      } catch (parseError) {
        cleanupTempFiles([mainImageFile, ...sectionFiles]);
        return res.status(400).json({
          message: "Invalid JSON format for title",
        });
      }
    }

    if (req.body.sections) {
      try {
        sections = parseJsonField(req.body.sections, existingAppeal.sections);
      } catch (parseError) {
        cleanupTempFiles([mainImageFile, ...sectionFiles]);
        return res.status(400).json({
          message: "Invalid JSON format for sections",
        });
      }
    }

    let imageUrl = existingAppeal.image;
    let publicId = existingAppeal.cloudinary_public_id;

    // Upload new image if provided
    if (mainImageFile) {
      const cloudinaryResult = await uploadToCloudinary(mainImageFile, "appeals");

      cleanupTempFiles([mainImageFile]);

      imageUrl = cloudinaryResult.url;

      // Delete old image from Cloudinary
      if (existingAppeal.cloudinary_public_id) {
        await deleteFromCloudinary(existingAppeal.cloudinary_public_id);
      }
      publicId = cloudinaryResult.public_id;
    }

    const existingSectionsById = new Map(
      existingAppeal.sections.map((section) => [String(section._id), section]),
    );
    const incomingIds = new Set(
      sections.filter((section) => section._id).map((section) => String(section._id)),
    );
    const removedSections = existingAppeal.sections.filter(
      (section) => !incomingIds.has(String(section._id)),
    );

    const removedSectionIds = removedSections
      .map((section) => section.cloudinary_public_id)
      .filter(Boolean);

    const { finalSections } = await attachSectionImages({
      sections,
      sectionFiles,
      existingSections: existingAppeal.sections,
    });

    cleanupTempFiles([mainImageFile, ...sectionFiles]);

    if (removedSectionIds.length > 0) {
      await Promise.all(removedSectionIds.map((publicId) => deleteFromCloudinary(publicId)));
    }

    const updatedAppeal = await Appeal.findByIdAndUpdate(
      existingAppeal._id,
      {
        ...(appeal && { appeal }),
        slug: newSlug ? newSlug.toLowerCase().trim() : existingAppeal.slug,
        image: imageUrl,
        cloudinary_public_id: publicId,
        title,
        sections: finalSections,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedAppeal);
  } catch (error) {
    // Safe cleanup
    try {
      cleanupTempFiles([
        ...getUploadedFiles(req.files, "image"),
        ...getUploadedFiles(req.files, "sectionImages"),
      ]);
    } catch (fsError) {
      console.warn(
        `Warning: Could not delete temporary file: ${fsError.message}`,
      );
    }
    res.status(500).json({ message: error.message });
  }
};
