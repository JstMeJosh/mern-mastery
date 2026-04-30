import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully ", conn.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1); // exit with failure — don't let the app run without a DB
  }
};

export default ConnectDB;
