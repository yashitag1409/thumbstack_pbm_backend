const AUTHORMODEL = require("../database/model/author.model");

const { uploadToCloudinary } = require("../utility/cloudinary");

exports.createAuthor = async (req, res) => {
  try {
    let profileImageUrl = "";
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(
        req.file.path,
        "AksharVault/Authors",
      );
    }

    const author = await AUTHORMODEL.create({
      ...req.body,
      profileImage: profileImageUrl,
      user: req.user._id,
    });

    res.status(201).json({ status: "success", data: author });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get All User Authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await AUTHORMODEL.find({ user: req.user._id });

    console.log("authors \n\n", authors);
    res.status(200).json({ status: "success", data: authors });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Update Author
exports.updateAuthor = async (req, res) => {
  try {
    const updated = await AUTHORMODEL.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "Author not found" });
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
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
