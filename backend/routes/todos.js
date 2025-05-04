const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth'); // you'll create this soon

// Get all todos for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new todo
router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text is required' });

  try {
    const newTodo = new Todo({ 
      text, 
      userId: req.user.id 
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update todo
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { text, completed } = req.body;
    const updateData = {};

    if (text !== undefined) {
      updateData.text = text;
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
