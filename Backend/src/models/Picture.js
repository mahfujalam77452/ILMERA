import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    picture_link: {
      type: String,
      required: [true, "Picture link is required"],
    },
    cloudinary_public_id: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Picture", pictureSchema);
