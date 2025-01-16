import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authHandler from "./routes/authHandler.js";
import blogRoutes from "./routes/blogRoutes.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "./routes/adminUpdates.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// Middleware setup
app.use(cors()); // Handle CORS
app.use(express.json()); // Parse JSON bodies

// CORS configuration (if needed)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Frontend URL
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
app.use("/api/blogs", blogRoutes); // Blog routes
app.get("/get-all-users", getAllUsers); // Admin route to get all users
app.put("/update-role", updateUserRole); // Admin route to update user role
app.delete("/delete-user", deleteUser); // Admin route to delete user

// Catch-all handler for unmatched routes (authentication routes)
app.use(authHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
