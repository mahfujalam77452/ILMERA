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
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be in kebab-case format",
      ],
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
    apply_link: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
