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

const appealSchema = new mongoose.Schema(
  {
    appeal: {
      type: String,
      required: true,
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

export default mongoose.model("Appeal", appealSchema);
