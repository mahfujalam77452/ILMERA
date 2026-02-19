import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authenticate from "../middleware/authenticate.js";
import {
  getAppealById,
  getAllAppealsBasic,
  createAppeal,
  deleteAppeal,
  updateAppeal,
} from "../controllers/appealController.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        ),
      );
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 1️⃣ Get all appeals (only appeal + image + title, latest first)
router.get("/", getAllAppealsBasic);

// 2️⃣ Get full appeal by ID
router.get("/:id", getAppealById);

// 3️⃣ Create new appeal (Admin only)
router.post("/", authenticate, upload.single("image"), createAppeal);

// 4️⃣ Update appeal by ID (Admin only)
router.put("/:id", authenticate, upload.single("image"), updateAppeal);

// 5️⃣ Delete appeal by ID (Admin only)
router.delete("/:id", authenticate, deleteAppeal);

export default router;
