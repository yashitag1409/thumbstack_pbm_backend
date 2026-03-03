const express = require("express");
const routes = express.Router();

const authRoute = require("./auth.route");
const bookRoute = require("./book.route");
const categoryRoute = require("./category.route");
const authorRoute = require("./author.route");
// Root route
routes.get("/", (req, res) => {
  res.json({
    message: "Welcome to AksharVault: the People Book Management System",
  });
});

routes.use("/auth", authRoute);
routes.use("/authors", authorRoute);
routes.use("/categories", categoryRoute);
routes.use("/books", bookRoute);

module.exports = routes;
