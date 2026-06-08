const express = require("express");
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { username, content, link } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newPost = new Post({
      username,
      content,
      link,
      image: imageUrl,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes.push({ username: "Priya" });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    post.comments.push({ username: "Priya", text });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Post Route
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
