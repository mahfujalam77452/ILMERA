import bcrypt from "bcryptjs";
import { sendSuccess, sendError } from "../utils/response.js";
import { generateToken } from "../utils/jwt.js";
import Admin from "../models/Admin.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return sendError(res, "Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    const token = generateToken(admin._id);

    sendSuccess(
      res,
      {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
        },
      },
      "Login successful",
      200,
    );
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return sendError(res, "Old password and new password are required", 400);
    }

    const admin = await Admin.findById(req.admin._id).select("+password");

    if (!admin) {
      return sendError(res, "Admin not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordValid) {
      return sendError(res, "Old password is incorrect", 401);
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    sendSuccess(res, {}, "Password updated successfully", 200);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export default {
  login,
  updatePassword,
};
