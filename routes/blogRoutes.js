import express from "express";
import BlogPost from "../models/BlogPost.js";
import { authenticateUser, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

// Route: Get all published blog posts (Public)
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).populate(
      "author",
      "name"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

// Route: Get a single blog post by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate(
      "author",
      "name"
    );
    if (!post || !post.published) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the post." });
  }
});

// Route: Create a new blog post (Admin only)
router.post("/", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { title, content, tags, category, coverImage } = req.body;
    const newPost = new BlogPost({
      title,
      content,
      tags,
      category,
      coverImage,
      author: req.user.id, // `req.user` is populated by `authenticateUser`
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: "Failed to create post." });
  }
});

// Route: Update a blog post (Admin only)
router.put("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedPost) return res.status(404).json({ error: "Post not found." });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: "Failed to update post." });
  }
});

// Route: Delete a blog post (Admin only)
router.delete("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found." });
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post." });
  }
});

export default router;
