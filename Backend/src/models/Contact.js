import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    facebook: {
      type: String,
    },
    youtube: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", contactSchema);
