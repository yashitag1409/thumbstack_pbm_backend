const AUTHORMODEL = require("../database/model/author.model");

const { uploadToCloudinary } = require("../utility/cloudinary");

exports.createAuthor = async (req, res) => {
  try {
    let profileImageUrl = "";

    // Upload image if provided
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(
        req.file.path,
        "AksharVault/Authors",
      );
    }

    const author = await AUTHORMODEL.create({
      name: req.body.name,
      biography: req.body.biography,
      website: req.body.website,
      profileImage: profileImageUrl,
      user: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: author,
    });
  } catch (error) {
    // console.log("Create Author Error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get All User Authors
exports.getAllAuthors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Base query (authors of logged in user)
    let queryObj = {
      user: req.user._id,
    };

    // Search functionality
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { biography: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Fetch authors + total count together
    const [authors, totalAuthors] = await Promise.all([
      AUTHORMODEL.find(queryObj)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      AUTHORMODEL.countDocuments(queryObj),
    ]);

    // console.log("authors", authors, "totalAuthors", totalAuthors);

    return res.status(200).json({
      status: "success",
      totalAuthors,
      currentPage: Number(page),
      totalPages: Math.ceil(totalAuthors / limit),
      data: authors,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update Author
exports.updateAuthor = async (req, res) => {
  try {
    const author = await AUTHORMODEL.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!author) {
      return res.status(404).json({
        status: "error",
        message: "Author not found",
      });
    }

    let profileImageUrl = author.profileImage;

    // If new image uploaded
    if (req.file) {
      // Upload to specific user profile folder
      profileImageUrl = await uploadToCloudinary(
        req.file.buffer,
        "AksharVault/Authors",
      );
    }

    author.name = req.body.name ?? author.name;
    author.biography = req.body.biography ?? author.biography;
    author.website = req.body.website ?? author.website;
    author.profileImage = profileImageUrl.secure_url ?? author.profileImage;

    await author.save();

    res.status(200).json({
      status: "success",
      data: author,
    });
  } catch (error) {
    // console.log("Update Author Error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete Author
exports.deleteAuthor = async (req, res) => {
  try {
    const deleted = await AUTHORMODEL.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Author not found" });
    res.status(200).json({ status: "success", message: "Author removed" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
