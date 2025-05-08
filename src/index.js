require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");
const passport = require("./config/passport");
const errorHandler = require("./middleware/errorHandler");
const { limiter, authLimiter } = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

// Import routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

const app = express();
// test
// Security middleware
app.use(helmet());
const corsOptions = {
  origin: [
    "http://localhost:3000", // Для локального фронтенда
    "http://165.232.73.69", // Для фронтенда на сервере
    "https://165.232.73.69", // Если настроишь HTTPS для фронтенда
    "http://165.22.24.163", // Для фронтенда на сервере
    "https://165.22.24.163", // Если настроишь HTTPS для фронтенда
    "http://64.225.109.169", // Для фронтенда на сервере
    "https://64.225.109.169", // Если настроишь HTTPS для фронтенда
  ],
  credentials: true, // Для отправки cookies (нужно для Google OAuth с withCredentials: true)
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Разрешенные методы
  allowedHeaders: ["Content-Type", "Authorization"], // Разрешенные заголовки
};

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(passport.initialize());

// Rate limiting
app.use(limiter);
app.use("/auth", authLimiter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/api", todoRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Todo API",
    documentation: "/api-docs",
  });
});

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
  logger.info("Available routes:");
  logger.info("- GET /");
  logger.info("- GET /auth/google");
  logger.info("- GET /auth/google/callback");
  logger.info("- GET /api/todos");
  logger.info("- POST /api/todos");
  logger.info("- PATCH /api/todos/:id");
  logger.info("- DELETE /api/todos/:id");

  // Log available routes
  app._router.stack
    .filter((r) => r.route)
    .forEach((r) => {
      Object.keys(r.route.methods).forEach((method) => {
        logger.info(`${method.toUpperCase()}: ${r.route.path}`);
      });
    });
});
