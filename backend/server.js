const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

// load env vars
dotenv.config();

const { connectDB } = require("../backend/config/db");
const swaggerSpec = require("./docs/swagger");

// load models + associations before sync
require("./models");

// route files
const authRoutes = require("./routes/v1/authRoutes");
const taskRoutes = require("./routes/v1/taskRoutes");

const app = express();

// body parser
app.use(express.json());

// enable cors
app.use(cors());

// serve frontend as static files
app.use(express.static(path.join(__dirname, "../frontend")));

// api routes (versioned)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// catch-all for unknown api routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// serve frontend for any non-api route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

// connect to db then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/api-docs`);
    console.log(`Frontend at http://localhost:${PORT}`);
  });
});

module.exports = app;
