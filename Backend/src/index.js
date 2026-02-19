import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { globalErrorHandler } from "./utils/errorHandler.js";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import compression from "compression"; 
// Import routes
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import pictureRoutes from "./routes/pictureRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import appealRoutes from "./routes/appealRoutes.js";
import currentProjectRoutes from "./routes/currentProjectRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware

app.use(helmet());
app.use(cors(
  {
    origin: [process.env.CLIENT_URL_1, process.env.CLIENT_URL_2],
    credentials: true,
  }
));

// ✅ Stripe webhook FIRST (before json middleware) because it need raw body for signature verification
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  webhookRoutes,
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Database connection
connectDB();

// Initialize Admin - Create if doesn't exist
const initializeAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin@123",
        10,
      );
      await Admin.create({
        email: process.env.ADMIN_EMAIL || "admin@ilmera.com",
        password: hashedPassword,
      });
      console.log("✅ Default admin created");
    }
  } catch (error) {
    console.error(`Admin initialization error: ${error.message}`);
  }
};

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/pictures", pictureRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/appeals", appealRoutes);
app.use("/api/current-project", currentProjectRoutes);

//stripe login
//stripe listen --forward-to localhost:5000/api/stripe/webhook

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 5000;

initializeAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(
      `📝 Admin Email: ${process.env.ADMIN_EMAIL || "admin@ilmera.com"}`,
    );
  });
});

export default app;
