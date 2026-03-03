const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    // Reference to a Category Model
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    // Fallback if the user types their own category
    customCategory: {
      type: String,
      trim: true,
    },
    // Reference to an Author Model
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: false,
    },
    // Fallback if the author isn't in your master list
    customAuthor: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    tags: [{ type: String }],
    numberOfPages: { type: Number },
    pages: [
      {
        page_url: { type: String, required: true },
        page_no: { type: Number, required: true },
      },
    ],
    thumbNail: { type: String, default: "" },
    status: {
      type: String,
      enum: ["reading", "want_to_read", "completed"],
      default: "want_to_read",
    },
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = bookSchema;
