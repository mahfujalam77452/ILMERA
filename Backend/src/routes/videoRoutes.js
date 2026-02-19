import express from "express";
import * as videoController from "../controllers/videoController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, videoController.addVideo);
router.get("/", videoController.getAllVideos);
router.delete("/:id", authenticate, videoController.deleteVideo);

export default router;
