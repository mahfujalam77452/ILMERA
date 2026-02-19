import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, categoryController.addCategory);
router.get("/", categoryController.getAllCategories);
router.delete("/:id", authenticate, categoryController.deleteCategory);

export default router;
