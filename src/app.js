const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index.route");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { corsOptions } = require("./controllers/cors.controller");

app.set("trust proxy", 1);

app.use((req, resp, next) => {
  cors(corsOptions)(req, resp, next);
});

app.use(helmet());

// Increase body size limits for file uploads and large data
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser()); // Add cookie parser middleware

app.use(cookieParser());
app.use("/api/v1", routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(err);
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

module.exports = app;
