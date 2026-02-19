import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    video_link: {
      type: String,
      required: [true, "Video link is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Video", videoSchema);
