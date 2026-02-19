import express from "express";
import multer from "multer";
import path from "path";
import * as volunteerController from "../controllers/volunteerController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Public routes
router.post(
  "/",
  volunteerController.volunteerLimiter,
  upload.single("image"),
  volunteerController.addVolunteer,
);

// Admin routes
router.get("/", authenticate, volunteerController.getAllVolunteers);
router.patch("/:id/member", authenticate, volunteerController.setMemberStatus);
router.delete("/:id", authenticate, volunteerController.deleteVolunteer);

export default router;
