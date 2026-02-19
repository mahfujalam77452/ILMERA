import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },
    summary: {
      type: String,
    },
    pictures_link_list: {
      type: [String],
      required: [true, "At least one picture link is required"],
    },
    cloudinary_public_ids: {
      type: [String],
    },
    video_link: {
      type: String,
    },
    project_goals: {
      type: [String],
    },
    beneficiaries: {
      type: [String],
    },
    expense_categories: {
      type: [String],
    },
    project_area: {
      type: String,
    },
    duration: {
      type: String,
    },
    description: {
      type: [String],
      required: [true, "Description is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Activity", activitySchema);
