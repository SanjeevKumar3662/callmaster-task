import mongoose from "mongoose";

// console.log("env", process.env.MONGODB_URI);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
    );
    console.log("DB connected ", conn.connection.host);
    // console.log("DB connected ");
  } catch (error) {
    console.log("Error in connectDB");
    throw error;
  }
};
