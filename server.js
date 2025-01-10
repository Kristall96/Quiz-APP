import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import pageRoutes from "./routes/pageRoutes.js";
import authRoutes from "./routes/authHeandler.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "./routes/adminUpdates.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500", // Your frontend origin
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    return res.end();
  }
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  next();
});

app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/admin", getAllUsers, updateUserRole, deleteUser);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
