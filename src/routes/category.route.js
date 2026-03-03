const express = require("express");
const { protect } = require("../utility/middleware/auth.middleware");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.use(protect);
// testing route
router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to aksharVault: the People Book Management System category route",
  });
});

router.post("/add", categoryController.createCategory);
router.get("/all", categoryController.getAllCategories);
router.patch("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
