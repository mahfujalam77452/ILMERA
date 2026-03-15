import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ilmera"
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);

    // retry after 5 seconds
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;