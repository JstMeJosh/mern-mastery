import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173", // dev frontend
    "https://your-frontend.vercel.app" // production frontend
  ],
  credentials: true
}));

app.use("/api/auth", authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await ConnectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
};

startServer();
