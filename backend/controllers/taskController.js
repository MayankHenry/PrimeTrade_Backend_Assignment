const { Task, User } = require("../models");

// @desc    Get all tasks (admin gets all, user gets own)
// @route   GET /api/v1/tasks
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      // admins see everything
      tasks = await Task.findAll({
        include: [{ model: User, attributes: ["id", "name", "email"] }],
        order: [["createdAt", "DESC"]],
      });
    } else {
      tasks = await Task.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
      });
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: err.message,
    });
  }
};

// @desc    Get single task by id
// @route   GET /api/v1/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // only owner or admin can view
    if (task.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this task",
      });
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: err.message,
    });
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: err.message,
    });
  }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
const updateTask = async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // only owner or admin can update
    if (task.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const { title, description, status, priority } = req.body;
    await task.update({ title, description, status, priority });

    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: err.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // only owner or admin can delete
    if (task.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: err.message,
    });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
