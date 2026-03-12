import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ilmera",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
