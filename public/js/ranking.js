import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userInfoRouter = express.Router();

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

// Route: Get username and points
userInfoRouter.get("/get-user-info", async (req, res) => {
  try {
    const decodedToken = verifyToken(req);

    // Find the user by ID from the decoded token
    const user = await User.findById(decodedToken.id, "username points");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user's username and points
    res.status(200).json({
      username: user.username,
      points: user.points,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Server Error" });
  }
});

export default userInfoRouter;
