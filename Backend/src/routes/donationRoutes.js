import express from "express";
import * as donationController from "../controllers/donationController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Public routes
router.post(
  "/",
  donationController.donationLimiter,
  donationController.createDonation,
);

// Admin routes
router.get("/", authenticate, donationController.getDonations);
router.patch(
  "/:id/status",
  authenticate,
  donationController.updateDonationStatus,
);

export default router;
