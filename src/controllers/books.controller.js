const BOOKMODEL = require("../database/model/book.model");
const { uploadToCloudinary } = require("../utility/cloudinary");
const { mailMessages } = require("../utility/mail/mailMessage");
const { sendMail } = require("../utility/mail/sendmail");

// 1. Add New Book (Handles ObjectId vs Custom String)
module.exports.addNewBook = async (req, res) => {
  try {
    const {
      title,
      category, // Expected as ObjectId
      customCategory, // Expected as String if category is null
      description,
      author, // Expected as ObjectId
      customAuthor, // Expected as String if author is null
      tags,
      pages,
      thumbNail,
      status,
      isFavorite,
    } = req.body;

    // Validate Required Fields
    if (!title || (!category && !customCategory) || !description) {
      return res.status(400).json({
        message: "Title, Category, and Description are required.",
        status: "failed",
      });
    }
    let thumbNailUrl = "";
    if (req.file) {
      thumbNailUrl = await uploadToCloudinary(
        req.file.path,
        "AksharVault/Books",
      );
    }
    const pageCount = req.body.numberOfPages || (pages ? pages.length : 0);

    const new_book = await BOOKMODEL.create({
      user: req.user._id,
      title,
      category: category || null,
      customCategory: !category ? customCategory : null,
      author: author || null,
      customAuthor: !author ? customAuthor : null,
      description,
      tags: tags || [],
      numberOfPages: pageCount,
      pages: pages || [],
      thumbNail: thumbNailUrl,
      status: status || "want_to_read",
      isFavorite: isFavorite || false,
    });

    // Determine name for email (either from populated field or custom string)
    // Note: In a real app, you'd likely fetch the category name if 'category' ID was used
    const categoryName = customCategory || "New Category";
    const authorName = customAuthor || "New Author";

    const send_book_html = mailMessages.bookAdded(
      req.user.name,
      title,
      categoryName,
      authorName,
    );

    await sendMail(
      req.user.email,
      send_book_html.subject,
      send_book_html.html,
      "AksharVault Admin",
    );

    console.log(
      "new book added",
      await new_book.populate("category").populate("author").populate("user"),
    );

    return res.status(201).json({
      message: `"${title}" secured successfully!`,
      status: "success",
      data: new_book,
    });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

// 2. Get All Books (with Population)
module.exports.getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      isFavorite,
      search,
    } = req.query;

    let queryObj = { user: req.user._id };

    if (category) queryObj.category = category; // Filtering by Category ID
    if (status) queryObj.status = status;
    if (isFavorite) queryObj.isFavorite = isFavorite === "true";

    if (search) {
      queryObj.$or = [
        { title: { $regex: search, $options: "i" } },
        { customAuthor: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [books, totalBooks] = await Promise.all([
      BOOKMODEL.find(queryObj)
        .populate("category", "name") // Transform ID to Category Name
        .populate("author", "name") // Transform ID to Author Name
        .populate("user") // Transform ID to Author Name
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      BOOKMODEL.countDocuments(queryObj),
    ]);

    return res.status(200).json({
      status: "success",
      totalBooks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBooks / limit),
      data: books,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. Get Single Book (with Population)
module.exports.getSingleBook = async (req, res) => {
  try {
    const book = await BOOKMODEL.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("category")
      .populate("author");

    if (!book)
      return res
        .status(404)
        .json({ status: "failed", message: "Book not found" });

    return res.status(200).json({ status: "success", data: book });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// 4. Grouped Books (Using Lookup to join Category Names)
module.exports.getBooksGroupedByCategory = async (req, res) => {
  try {
    const groupedBooks = await BOOKMODEL.aggregate([
      { $match: { user: req.user._id } },
      {
        $lookup: {
          from: "categories", // Ensure your Category collection is named 'categories'
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $group: {
          _id: {
            // Group by Category ID OR the Custom Category String
            categoryId: "$category",
            customName: "$customCategory",
          },
          count: { $sum: 1 },
          books: { $push: "$$ROOT" },
        },
      },
      { $sort: { "_id.customName": 1 } },
    ]);

    return res.status(200).json({ status: "success", data: groupedBooks });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// Update book details
module.exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle pages/numberOfPages logic if pages are updated
    if (updateData.pages && !updateData.numberOfPages) {
      updateData.numberOfPages = updateData.pages.length;
    }

    // Ensure the book belongs to the logged-in user before updating
    const updatedBook = await BOOKMODEL.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate("category author");

    if (!updatedBook) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found or you don't have permission to edit it.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Vault updated successfully!",
      data: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Remove book from Vault
module.exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await BOOKMODEL.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedBook) {
      return res.status(404).json({
        status: "failed",
        message: "Book not found or already removed.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `"${deletedBook.title}" has been removed from your Vault.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
