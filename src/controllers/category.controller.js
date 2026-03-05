const CATEGORYMODEL = require("../database/model/category.model");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, isSystemDefault } = req.body;

    const category = await CATEGORYMODEL.create({
      name,
      description,
      isSystemDefault,
      user: req.user._id, // Tied to logged-in user
      slug: name.toLowerCase().split(" ").join("-"),
    });

    res.status(201).json({ status: "success", data: category });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get All User Categories
exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let queryObj = {
      user: req.user._id,
    };

    // Search by name or description
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [categories, totalCategories] = await Promise.all([
      CATEGORYMODEL.find(queryObj)
        .populate("user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      CATEGORYMODEL.countDocuments(queryObj),
    ]);

    res.status(200).json({
      status: "success",
      totalCategories,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCategories / limit),
      data: categories,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await CATEGORYMODEL.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await CATEGORYMODEL.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ status: "success", message: "Category removed" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
