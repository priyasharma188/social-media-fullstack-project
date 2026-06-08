const express = require("express");
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");

// 1. Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Post Route
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { username, content, link } = req.body;

    // Check if image or text/link exists
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!content && !imageUrl && !link) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const newPost = new Post({
      username,
      content,
      link,
      image: imageUrl, // Path save ho raha hai
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like Route (OUTSIDE of /create)
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Assuming you want to check if user already liked
    post.likes.push({ username: "Priya" });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comment Route (OUTSIDE of /create)
router.post("/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ username: "Priya", text });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
