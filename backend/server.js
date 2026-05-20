process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

// Load env vars
dotenv.config();

const { connectDB } = require("./config/db");
const swaggerSpec = require("./docs/swagger");

// Load models
require("./models");

// Route files
const authRoutes = require("./routes/v1/authRoutes");
const taskRoutes = require("./routes/v1/taskRoutes");

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Debug startup log
console.log("Starting server...");

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("PrimeTrade Backend API Running");
});

// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// Connect DB then start server
connectDB()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs: /api-docs`);
    });
  })
  .catch((err) => {
    console.error("DATABASE CONNECTION FAILED:", err);
    process.exit(1);
  });

module.exports = app;