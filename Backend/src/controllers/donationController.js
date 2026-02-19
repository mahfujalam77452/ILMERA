import { sendSuccess, sendError } from "../utils/response.js";
import Donation from "../models/Donation.js";
import { createPaymentIntent } from "../utils/stripe.js";
import rateLimit from "express-rate-limit";

export const donationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many donation requests from this IP, please try again later.",
});

export const createDonation = async (req, res) => {
  try {
    const { amount, name, phone_email, category } = req.body;

    if (!amount || !category) {
      return sendError(res, "Amount and category are required", 400);
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await createPaymentIntent(amount, "usd", {
      category,
      name: name || "Anonymous",
    });

    // Create donation record with pending status
    const donation = await Donation.create({
      date: new Date(),
      amount,
      name: name || null,
      phone_email: phone_email || null,
      category,
      payment_status: "pending",
      stripe_payment_intent_id: paymentIntent.id,
    });

    sendSuccess(
      res,
      {
        donation,
        client_secret: paymentIntent.client_secret,
      },
      "Donation initiated, please complete payment",
      201,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const getDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    let query = {};
      
    // Filter by date range
    if (req.query.fromDate || req.query.toDate) {
      query.date = {};
      if (req.query.fromDate) {
        query.date.$gte = new Date(req.query.fromDate);
      }
      if (req.query.toDate) {
        const toDate = new Date(req.query.toDate);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }

    // Filter by name
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    // Filter by phone/email
    if (req.query.phone_email) {
      query.phone_email = { $regex: req.query.phone_email, $options: "i" };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by payment status (default: success)
    if (!req.query.status) {
      query.payment_status = "success";
    } else {
      query.payment_status = req.query.status;
    }

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    sendSuccess(
      res,
      {
        donations,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Donations retrieved successfully",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const { payment_status, stripe_charge_id } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        payment_status,
        stripe_charge_id: stripe_charge_id || undefined,
        payment_timestamp:
          payment_status === "success" ? new Date() : undefined,
      },
      { new: true },
    );

    if (!donation) {
      return sendError(res, "Donation not found", 404);
    }

    sendSuccess(res, donation, "Donation status updated", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  createDonation,
  getDonations,
  updateDonationStatus,
};
