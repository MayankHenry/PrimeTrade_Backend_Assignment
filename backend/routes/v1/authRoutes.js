const express = require("express");
const { body } = require("express-validator");

const {
  register,
  login,
  getMe,
} = require("../../controllers/authController");

const { protect } = require("../../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user and get token
 *     tags: [Auth]
 */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  login
);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 */
router.get("/me", protect, getMe);

module.exports = router;