import jwt from "jsonwebtoken";
import User from "../models/User.js";
import express from "express";

const adminRouter = express.Router();

// Middleware to verify token
const verifyToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw { status: 401, message: "Unauthorized: Token is missing" };
  }
  const tokenParts = authHeader.split(" ");
  if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
    throw { status: 401, message: "Unauthorized: Token format is invalid" };
  }
  return jwt.verify(tokenParts[1], process.env.JWT_SECRET);
};

// Function: Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    if (decodedToken.role !== "admin") {
      throw { status: 403, message: "Access denied" };
    }

    const users = await User.find({}, "-password"); // Exclude password field
    res.status(200).json(users);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

// Function: Update user role
const updateUserRole = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    if (decodedToken.role !== "admin") {
      throw { status: 403, message: "Access denied" };
    }

    const { userId, newRole } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = newRole; // Update the user's role
    await user.save();

    res.status(200).json({ message: "User role updated successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

// Function: Delete user
const deleteUser = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    if (decodedToken.role !== "admin") {
      throw { status: 403, message: "Access denied" };
    }

    const { userId } = req.body;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

// Add functions to the router
adminRouter.get("/get-all-users", getAllUsers);
adminRouter.put("/update-role", updateUserRole);
adminRouter.delete("/delete-user", deleteUser);

// Export individual functions and the router
export { getAllUsers, updateUserRole, deleteUser };
export default adminRouter;
