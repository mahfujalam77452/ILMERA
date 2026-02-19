import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Date is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 1,
    },
    name: {
      type: String,
      trim: true,
    },
    phone_email: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    payment_status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    stripe_payment_intent_id: {
      type: String,
    },
    stripe_charge_id: {
      type: String,
    },
    payment_timestamp: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Donation", donationSchema);
