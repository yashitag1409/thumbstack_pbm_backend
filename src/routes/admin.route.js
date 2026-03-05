const express = require("express");
const {
  restrictTo,
  protect,
} = require("../utility/middleware/auth.middleware");
const { upload } = require("../utility/middleware/multer.middleware");
const {
  addOrigin,
  updateOrigin,
  getAllOrigins,
  deleteOrigin,
} = require("../controllers/cors.controller");
const router = express.Router();

// test api
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the People Book Management System" });
});

// add origin api
router.use(protect, restrictTo("admin"));
router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to aksharVault: the People Book Management System admin route",
  });
});
router.post("/add_origin", addOrigin);
// update origin api
router.patch("/update_origin/:id", updateOrigin);

router.get("/all", getAllOrigins);
router.delete("/delete_origin/:id", deleteOrigin);

module.exports = router;
