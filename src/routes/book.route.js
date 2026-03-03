const express = require("express");
const { protect } = require("../utility/middleware/auth.middleware");
const {
  addNewBook,
  getAllBooks,
  getBooksGroupedByCategory,
  getSingleBook,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");
const { upload } = require("../utility/middleware/multer.middleware");
const router = express.Router();

// we use protect so that only the logged in person will access all this apis

router.use(protect);
// testing route for books library
router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to aksharVault: the People Book Management System books route",
  });
});
// 1. Static/Specific Routes FIRST
router.get("/all", getAllBooks);
router.get("/group_books", getBooksGroupedByCategory); // Moved up!

// 2. Dynamic/Parameter Routes LAST
router.get("/:id", getSingleBook);

// 3. Post Routes
router.post(
  "/add_book",
  upload.fields([
    { name: "thumbNail", maxCount: 1 },
    { name: "pageImages", maxCount: 50 }, // Adjust maxCount as needed
  ]),
  addNewBook,
);

router.patch(
  "/update/:id",
  upload.fields([
    { name: "thumbNail", maxCount: 1 },
    { name: "pageImages", maxCount: 50 },
  ]),
  updateBook,
);
// Delete a specific book
router.delete("/delete/:id", deleteBook);
module.exports = router;
