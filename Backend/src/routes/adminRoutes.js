import express from "express";
import * as adminController from "../controllers/adminController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/login", adminController.login);
router.post("/update-password", authenticate, adminController.updatePassword);

export default router;
