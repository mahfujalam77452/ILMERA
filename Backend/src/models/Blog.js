import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },
    pictures_link_list: {
      type: [String],
      required: [true, "At least one picture link is required"],
    },
    cloudinary_public_ids: {
      type: [String],
    },
    description: {
      type: [String],
      required: [true, "Description is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
