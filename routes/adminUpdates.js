import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify token function
const verifyToken = (req) => {
  const authHeader = req.headers && req.headers["authorization"];
  if (!authHeader) {
    throw { status: 401, message: "Unauthorized: Token is missing" };
  }
  const tokenParts = authHeader.split(" ");
  if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
    throw { status: 401, message: "Unauthorized: Token format is invalid" };
  }
  return jwt.verify(tokenParts[1], process.env.JWT_SECRET);
};

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    if (decodedToken.role !== "admin") {
      throw { status: 403, message: "Access denied" };
    }

    const users = await User.find({}, "-password"); // Exclude password field
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(err.status || 500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    if (decodedToken.role !== "admin") {
      throw { status: 403, message: "Access denied" };
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { userId, newRole } = JSON.parse(body);

      const user = await User.findById(userId);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      user.role = newRole; // Update the user's role
      await user.save();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User role updated successfully" }));
    });
  } catch (err) {
    res.writeHead(err.status || 500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    if (decodedToken.role !== "admin") {
      throw { status: 403, message: "Access denied" };
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { userId } = JSON.parse(body);

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User deleted successfully" }));
    });
  } catch (err) {
    res.writeHead(err.status || 500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

export { getAllUsers, updateUserRole, deleteUser };
