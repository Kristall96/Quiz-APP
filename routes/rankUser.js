import express from "express";
import User from "../models/User.js";

const rankUsersRouter = express.Router();

// Route: Get ranked users by points
rankUsersRouter.get("/rank-users", async (req, res) => {
  try {
    // Fetch top 10 users sorted by points in descending order
    const rankedUsers = await User.find({}, "username points")
      .sort({ points: -1 }) // Sort users by points (descending)
      .limit(20); // Limit to top 10 users

    // Generate an array of ranked users with their rank
    const rankedList = rankedUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      points: user.points,
    }));

    res.status(200).json(rankedList);
  } catch (err) {
    console.error("Error fetching ranked users:", err.message);
    res.status(500).json({ error: "Error fetching ranked users" });
  }
});

export default rankUsersRouter;
