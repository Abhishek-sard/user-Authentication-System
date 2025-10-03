import express from "express";
import Blog from "../models/blogModel.js";

const router = express.Router();

// ✅ Add a blog (POST)
router.post("/", async (req, res) => {
  try {
    const { title, author, description, image } = req.body;
    const blog = new Blog({ title, author, description, image });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Fetch all blogs (GET)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Fetch single blog (GET /:id)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Edit blog (PUT /:id)
router.put("/:id", async (req, res) => {
  try {
    const { title, author, description, image } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, description, image },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete blog (DELETE /:id)
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
