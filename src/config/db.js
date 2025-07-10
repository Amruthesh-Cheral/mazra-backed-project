import mongoose from "mongoose";

// Connect to database
const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/mazracare`);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
};

export default connectDb;