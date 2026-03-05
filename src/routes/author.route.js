const express = require("express");
const { protect } = require("../utility/middleware/auth.middleware");
const router = express.Router();
const authorController = require("../controllers/author.controller");
const { upload } = require("../utility/middleware/multer.middleware");
router.use(protect);
// testing route
router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to aksharVault: the People Book Management System authors route",
  });
});

router.post(
  "/add",
  upload.single("profileImage"),
  authorController.createAuthor,
);
router.get("/all", authorController.getAllAuthors);
router.patch(
  "/update/:id",
  upload.single("profileImage"),
  authorController.updateAuthor,
);
router.delete("/delete/:id", authorController.deleteAuthor);

module.exports = router;
