import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    cloudinary_public_id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    why: {
      type: String,
      required: [true, "Why section is required"],
      trim: true,
    },
    motivation: {
      type: String,
      required: [true, "Motivation is required"],
      trim: true,
    },
    expectation: {
      type: String,
      required: [true, "Expectation is required"],
      trim: true,
    },
    is_member: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Volunteer", volunteerSchema);
