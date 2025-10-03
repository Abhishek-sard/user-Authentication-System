import express from "express";
import Todo from "../models/todoModel.js";

const router = express.Router();

//create a todo
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update a todo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
