import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["heading", "paragraph", "highlight", "quote"],
    required: true,
  },
  content: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  order: {
    type: Number,
    required: true,
  },
});

const currentProjectSchema = new mongoose.Schema(
  {
    image: {
      type: String, // image URL from Cloudinary
      required: true,
    },

    cloudinary_public_id: {
      type: String,
      default: null,
    },

    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true },
    },

    sections: [sectionSchema],
  },
  { timestamps: true },
);

export default mongoose.model("CurrentProject", currentProjectSchema);
