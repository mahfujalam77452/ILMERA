import express from "express";
import * as contactController from "../controllers/contactController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Public route
router.get("/", contactController.getContact);

// Admin route
router.patch("/", authenticate, contactController.updateContact);

export default router;
