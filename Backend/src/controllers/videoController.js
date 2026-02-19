import { sendSuccess, sendError } from "../utils/response.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res) => {
  try {
    const { video_link, title } = req.body;

    if (!video_link || !title) {
      return sendError(res, "Video link and title are required", 400);
    }

    const video = await Video.create({
      video_link,
      title,
    });

    sendSuccess(res, video, "Video added successfully", 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Video.countDocuments();

    sendSuccess(
      res,
      {
        videos,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Videos retrieved successfully",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return sendError(res, "Video not found", 404);
    }

    sendSuccess(res, {}, "Video deleted successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  addVideo,
  getAllVideos,
  deleteVideo,
};
