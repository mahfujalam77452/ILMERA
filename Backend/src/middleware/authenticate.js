import { verifyToken } from "../utils/jwt.js";
import Admin from "../models/Admin.js";
import { sendError } from "../utils/response.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendError(res, "No token provided", 401);
    }

    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return sendError(res, "Admin not found", 404);
    }

    req.admin = admin;
    next();
  } catch (error) {
    sendError(res, error.message, 401);
  }
};

export default authenticate;
