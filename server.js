import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authHandler from "./routes/authHeandler.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "./routes/adminUpdates.js";
import rankUsersRouter from "./routes/rankUser.js";
import blogRoutes from "./routes/blogRoutes.js";

import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", rankUsersRouter);
app.use("/api/blogs", blogRoutes);

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Your frontend origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Routes
app.get("/get-all-users", async (req, res) => {
  try {
    await getAllUsers(req, res);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/update-role", async (req, res) => {
  try {
    await updateUserRole(req, res);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete-user", async (req, res) => {
  try {
    await deleteUser(req, res);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Auth handler as a catch-all for remaining routes
app.use((req, res) => {
  authHandler(req, res);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
