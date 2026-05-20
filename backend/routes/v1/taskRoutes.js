const express = require("express");
const { body } = require("express-validator");

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../../controllers/taskController");

const { protect } = require("../../middleware/auth");

const router = express.Router();

// All task routes need authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 */
router.get("/", getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get single task
 *     tags: [Tasks]
 */
router.get("/:id", getTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 */
router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),
  ],
  createTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 */
router.put("/:id", updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 */
router.delete("/:id", deleteTask);

module.exports = router;